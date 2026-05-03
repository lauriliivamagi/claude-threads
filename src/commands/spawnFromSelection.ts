import * as vscode from "vscode";
import { dirname, relative as pathRelative, posix } from "node:path";
import { randomUUID } from "node:crypto";
import { addThread, type ThreadMeta } from "../state.js";
import { renderScratchFile } from "../scratchFile.js";
import { buildLinkText } from "../linkInsertion.js";
import { shellQuote, truncate, validateSelectionForLink } from "../utils.js";

/**
 * `threads.spawnFromSelection` command.
 *
 * Workflow:
 * 1. Read editor selection (markdown only).
 * 2. Prompt for the inquiry text.
 * 3. Create `scratch-<timestamp>.md` next to the source file.
 * 4. Wrap the selected text with a markdown link to the scratch file.
 * 5. Persist a ThreadMeta record so the thread can be rolled back later.
 * 6. Open Claude Code in a terminal with the prepared prompt.
 */
export async function spawnFromSelection(memento: vscode.Memento): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Threads: open a markdown file and select some text first.");
    return;
  }
  if (editor.document.languageId !== "markdown") {
    vscode.window.showWarningMessage("Threads: only markdown files are supported.");
    return;
  }
  if (editor.selection.isEmpty) {
    vscode.window.showWarningMessage("Threads: select the term or passage to explore first.");
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  const validationError = validateSelectionForLink(selectedText);
  if (validationError) {
    vscode.window.showWarningMessage(`Threads: ${validationError}`);
    return;
  }

  const inquiry = await vscode.window.showInputBox({
    prompt: "What do you want to ask about this passage?",
    placeHolder: "e.g. Why does the author claim X here?",
    validateInput: (v) => (v.trim().length === 0 ? "Inquiry is required" : undefined),
  });
  if (!inquiry) return;

  if (editor.document.isDirty) {
    await editor.document.save();
  }

  const sourceUri = editor.document.uri;
  const sourceFsPath = sourceUri.fsPath;
  const sourceDir = dirname(sourceFsPath);

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceUri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("Threads: source file is not inside a workspace folder.");
    return;
  }

  const scratchFilename = makeScratchFilename();
  const scratchUri = vscode.Uri.joinPath(vscode.Uri.file(sourceDir), scratchFilename);

  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  const sourceRelativePath = toPosix(pathRelative(workspaceFolder.uri.fsPath, sourceFsPath));

  const scratchContent = renderScratchFile({
    inquiry,
    sourceRelativePath,
    startLine,
    endLine,
    selectedText: selectedText.trim(),
    backLinkRelative: `./${posix.basename(sourceFsPath)}`,
  });

  try {
    await vscode.workspace.fs.writeFile(scratchUri, Buffer.from(scratchContent, "utf8"));
  } catch (err) {
    vscode.window.showErrorMessage(
      `Threads: failed to write scratch file — ${(err as Error).message}`
    );
    return;
  }

  const linkText = buildLinkText(selectedText, scratchFilename);
  const edit = new vscode.WorkspaceEdit();
  edit.replace(sourceUri, selection, linkText);
  const applied = await vscode.workspace.applyEdit(edit);
  if (!applied) {
    vscode.window.showErrorMessage("Threads: failed to insert link in source document.");
    await safeDelete(scratchUri);
    return;
  }
  await editor.document.save();

  const meta: ThreadMeta = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    inquiry,
    scratchPath: toPosix(pathRelative(workspaceFolder.uri.fsPath, scratchUri.fsPath)),
    sourcePath: sourceRelativePath,
    selectedText,
    scratchFilename,
    startLine,
    endLine,
  };
  await addThread(memento, meta);

  await vscode.window.showTextDocument(scratchUri, { preview: false });

  const scratchFromWorkspace = toPosix(pathRelative(workspaceFolder.uri.fsPath, scratchUri.fsPath));
  const prompt =
    `Read ./${scratchFromWorkspace} for the user's inquiry, source back-link, and the selected passage. ` +
    `Source location: ${sourceRelativePath}:${startLine}${startLine === endLine ? "" : `-${endLine}`}. ` +
    `User asked: ${inquiry}`;

  const terminal = vscode.window.createTerminal({
    name: `thread:${truncate(inquiry, 40)}`,
    cwd: workspaceFolder.uri.fsPath,
  });
  terminal.show();
  terminal.sendText(`claude ${shellQuote(prompt)}`, true);

  vscode.window.showInformationMessage(`Threads: spawned thread (${scratchFilename}).`);
}

function makeScratchFilename(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `scratch-${stamp}.md`;
}

function toPosix(p: string): string {
  return p.split(/[\\/]/).join("/");
}

async function safeDelete(uri: vscode.Uri): Promise<void> {
  try {
    await vscode.workspace.fs.delete(uri);
  } catch {
    // ignore — best-effort cleanup
  }
}
