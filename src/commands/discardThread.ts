import * as vscode from "vscode";
import { listThreads, removeThread, type ThreadMeta } from "../state.js";
import { findLinkByTarget } from "../linkInsertion.js";
import { truncate } from "../utils.js";

/**
 * `threads.discardThread` command — undo the creation artifacts for a thread:
 * remove the markdown link from the source doc, delete the scratch file, and
 * forget the workspaceState record.
 */
export async function discardThread(
  memento: vscode.Memento,
  output: vscode.OutputChannel
): Promise<void> {
  const threads = listThreads(memento);
  if (threads.length === 0) {
    vscode.window.showInformationMessage("Threads: no threads to discard.");
    return;
  }

  const picked = await vscode.window.showQuickPick(
    threads.map((t) => ({
      label: truncate(t.inquiry, 80),
      description: t.scratchFilename,
      detail: t.sourcePath,
      thread: t,
    })),
    { placeHolder: "Select a thread to discard" }
  );
  if (!picked) return;

  const confirm = await vscode.window.showWarningMessage(
    `Discard this thread? The link will be removed from ${picked.thread.sourcePath} and ${picked.thread.scratchFilename} will be deleted.`,
    { modal: true },
    "Discard"
  );
  if (confirm !== "Discard") return;

  const warnings: string[] = [];

  const linkRemoved = await removeLinkFromSource(picked.thread);
  if (!linkRemoved) warnings.push(`link not found in ${picked.thread.sourcePath}`);

  const fileDeleted = await deleteScratchFile(picked.thread, output);
  if (!fileDeleted) warnings.push(`scratch file ${picked.thread.scratchFilename} not found`);

  await removeThread(memento, picked.thread.id);

  if (warnings.length > 0) {
    vscode.window.showWarningMessage(`Threads: discarded with warnings — ${warnings.join("; ")}.`);
  } else {
    vscode.window.showInformationMessage("Threads: discarded.");
  }
}

async function removeLinkFromSource(thread: ThreadMeta): Promise<boolean> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) return false;
  const sourceUri = vscode.Uri.joinPath(folder.uri, thread.sourcePath);
  let document: vscode.TextDocument;
  try {
    document = await vscode.workspace.openTextDocument(sourceUri);
  } catch {
    return false;
  }
  const link = findLinkByTarget(document.getText(), thread.scratchFilename);
  if (!link) return false;

  // Replace just the link's range with its current link text. Preserves the
  // user's edits to the link text and avoids the editor jump that comes with
  // a full-document replacement.
  const range = new vscode.Range(document.positionAt(link.start), document.positionAt(link.end));
  const edit = new vscode.WorkspaceEdit();
  edit.replace(sourceUri, range, link.linkText);
  const applied = await vscode.workspace.applyEdit(edit);
  if (applied) await document.save();
  return applied;
}

async function deleteScratchFile(
  thread: ThreadMeta,
  output: vscode.OutputChannel
): Promise<boolean> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) return false;
  const scratchUri = vscode.Uri.joinPath(folder.uri, thread.scratchPath);
  try {
    await vscode.workspace.fs.delete(scratchUri);
    return true;
  } catch (err) {
    output.appendLine(
      `[discard] failed to delete ${thread.scratchPath}: ${(err as Error).message}`
    );
    return false;
  }
}
