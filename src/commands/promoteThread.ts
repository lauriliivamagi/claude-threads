import * as vscode from "vscode";
import { execFile, type ChildProcess } from "node:child_process";
import { listThreads, removeThread, type ThreadMeta } from "../state.js";
import { findLinkTargetSpans } from "../linkInsertion.js";
import { truncate } from "../utils.js";

/**
 * `threads.promoteThread` — finalize a thread:
 *   1. Ask Claude (via `claude -p`) for a title + slug derived from the
 *      `## Notes` body of the scratch file.
 *   2. Write `<sourceDir>/<slug>.md` containing `# <title>\n\n<notes>`.
 *   3. Update the link target in the source markdown from the old scratch
 *      filename to `<slug>.md`. The link text (the user's selected passage)
 *      is left untouched so the prose still reads naturally.
 *   4. Delete the old scratch file.
 *   5. Purge the workspaceState record. Promotion is one-way.
 */
export async function promoteThread(
  memento: vscode.Memento,
  output: vscode.OutputChannel
): Promise<void> {
  const threads = listThreads(memento);
  if (threads.length === 0) {
    vscode.window.showInformationMessage("Threads: no threads to promote.");
    return;
  }

  const picked = await vscode.window.showQuickPick(
    threads.map((t) => ({
      label: truncate(t.inquiry, 80),
      description: t.scratchFilename,
      detail: t.sourcePath,
      thread: t,
    })),
    { placeHolder: "Select a thread to promote" }
  );
  if (!picked) return;

  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showErrorMessage("Threads: no workspace folder is open.");
    return;
  }

  const scratchUri = vscode.Uri.joinPath(folder.uri, picked.thread.scratchPath);
  let scratchContent: string;
  try {
    const bytes = await vscode.workspace.fs.readFile(scratchUri);
    scratchContent = Buffer.from(bytes).toString("utf8");
  } catch (err) {
    vscode.window.showErrorMessage(`Threads: cannot read scratch file — ${(err as Error).message}`);
    return;
  }

  const notes = extractNotesBody(scratchContent);
  if (!notes) {
    vscode.window.showErrorMessage(
      'Threads: scratch file has no content under "## Notes" to promote.'
    );
    return;
  }

  const titleSlug = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Threads: deriving title and slug from notes…",
      cancellable: true,
    },
    (_progress, token) => askClaudeForTitleSlug(notes, folder.uri.fsPath, token)
  );
  if (!titleSlug) return;

  const { title, slug } = titleSlug;
  const newFilename = `${slug}.md`;
  const scratchDir = vscode.Uri.joinPath(scratchUri, "..");
  const newUri = vscode.Uri.joinPath(scratchDir, newFilename);

  if (await fileExists(newUri)) {
    vscode.window.showErrorMessage(
      `Threads: "${newFilename}" already exists in the source directory. Aborting promotion.`
    );
    return;
  }

  const newContent = `# ${title}\n\n${notes}\n`;
  try {
    await vscode.workspace.fs.writeFile(newUri, Buffer.from(newContent, "utf8"));
  } catch (err) {
    vscode.window.showErrorMessage(
      `Threads: cannot write ${newFilename} — ${(err as Error).message}`
    );
    return;
  }

  const linkUpdated = await retargetSourceLink(folder, picked.thread, newFilename);

  try {
    await vscode.workspace.fs.delete(scratchUri);
  } catch (err) {
    output.appendLine(
      `[promote] failed to delete ${picked.thread.scratchPath}: ${(err as Error).message}`
    );
  }

  await removeThread(memento, picked.thread.id);

  if (!linkUpdated) {
    vscode.window.showWarningMessage(
      `Threads: promoted to ${newFilename}, but the link in ${picked.thread.sourcePath} could not be retargeted.`
    );
  } else {
    vscode.window.showInformationMessage(`Threads: promoted to ${newFilename} ("${title}").`);
  }
}

async function askClaudeForTitleSlug(
  notes: string,
  cwd: string,
  token: vscode.CancellationToken
): Promise<{ title: string; slug: string } | null> {
  const prompt =
    `Return ONLY a single-line JSON object with two fields and nothing else:\n` +
    `- "title": a 3-8 word sentence-case summary of the notes below, no filler like "Notes on" or "Analysis of"\n` +
    `- "slug": kebab-case derived from the title, lowercase, only [a-z0-9-], max 50 chars\n\n` +
    `Notes:\n${notes}`;

  let child: ChildProcess | null = null;
  let cancelled = false;
  const cancelSubscription = token.onCancellationRequested(() => {
    cancelled = true;
    child?.kill();
  });

  let stdout: string;
  try {
    stdout = await new Promise<string>((resolve, reject) => {
      child = execFile("claude", ["-p", prompt], { cwd, maxBuffer: 1024 * 1024 }, (err, out) => {
        if (err) reject(err);
        else resolve(out);
      });
    });
  } catch (err) {
    if (cancelled) return null;
    const e = err as NodeJS.ErrnoException;
    const msg = e.code === "ENOENT" ? "`claude` CLI not found on PATH" : e.message;
    vscode.window.showErrorMessage(`Threads: failed to invoke claude — ${msg}`);
    return null;
  } finally {
    cancelSubscription.dispose();
  }

  const parsed = parseTitleSlug(stdout);
  if (!parsed) {
    vscode.window.showErrorMessage(
      `Threads: could not parse title/slug from claude output: ${stdout.slice(0, 200)}`
    );
    return null;
  }

  const title = parsed.title.trim();
  const slug = sanitizeSlug(parsed.slug);
  if (!title || !slug) {
    vscode.window.showErrorMessage("Threads: could not derive a valid title/slug.");
    return null;
  }
  return { title, slug };
}

function parseTitleSlug(stdout: string): { title: string; slug: string } | null {
  const cleaned = stdout
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const tryParse = (text: string): { title: string; slug: string } | null => {
    try {
      const obj = JSON.parse(text) as unknown;
      if (
        obj &&
        typeof obj === "object" &&
        typeof (obj as { title?: unknown }).title === "string" &&
        typeof (obj as { slug?: unknown }).slug === "string"
      ) {
        return {
          title: (obj as { title: string }).title,
          slug: (obj as { slug: string }).slug,
        };
      }
    } catch {
      // fall through
    }
    return null;
  };

  const direct = tryParse(cleaned);
  if (direct) return direct;

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) return tryParse(match[0]);
  return null;
}

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function extractNotesBody(scratchContent: string): string | null {
  const lines = scratchContent.split("\n");
  const idx = lines.findIndex((l) => l.trim() === "## Notes");
  if (idx === -1) return null;
  const body = lines
    .slice(idx + 1)
    .join("\n")
    .trim();
  return body.length > 0 ? body : null;
}

async function retargetSourceLink(
  folder: vscode.WorkspaceFolder,
  thread: ThreadMeta,
  newFilename: string
): Promise<boolean> {
  const sourceUri = vscode.Uri.joinPath(folder.uri, thread.sourcePath);
  let document: vscode.TextDocument;
  try {
    document = await vscode.workspace.openTextDocument(sourceUri);
  } catch {
    return false;
  }
  const text = document.getText();
  const spans = findLinkTargetSpans(text, thread.scratchFilename);
  if (spans.length === 0) return false;

  const newTarget = `](./${newFilename})`;
  const edit = new vscode.WorkspaceEdit();
  for (const { start, end } of spans) {
    const range = new vscode.Range(document.positionAt(start), document.positionAt(end));
    edit.replace(sourceUri, range, newTarget);
  }
  const applied = await vscode.workspace.applyEdit(edit);
  if (applied) await document.save();
  return applied;
}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}
