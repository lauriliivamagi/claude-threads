import * as vscode from "vscode";
import { listThreads, removeThread, type ThreadMeta } from "../state.js";
import { findLinkTargetSpans } from "../linkInsertion.js";
import { deriveTitleSlug } from "../titleSlug.js";
import { truncate } from "../utils.js";

/**
 * `threads.promoteThread` — finalize a thread:
 *   1. Derive a title + slug locally from the `## Notes` body of the scratch
 *      file (first heading, else first line — no network call).
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

  const titleSlug = deriveTitleSlug(notes);
  if (!titleSlug) {
    vscode.window.showErrorMessage(
      'Threads: could not derive a title from the notes. Add a heading or some prose under "## Notes".'
    );
    return;
  }

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
