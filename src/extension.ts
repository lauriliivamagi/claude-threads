import * as vscode from "vscode";
import { spawnFromSelection } from "./commands/spawnFromSelection.js";
import { discardThread } from "./commands/discardThread.js";
import { promoteThread } from "./commands/promoteThread.js";

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel("Threads");
  context.subscriptions.push(output);
  output.appendLine(`[activate] extensionPath=${context.extensionUri.fsPath}`);

  context.subscriptions.push(
    vscode.commands.registerCommand("threads.spawnFromSelection", () =>
      spawnFromSelection(context.workspaceState)
    ),
    vscode.commands.registerCommand("threads.discardThread", () =>
      discardThread(context.workspaceState, output)
    ),
    vscode.commands.registerCommand("threads.promoteThread", () =>
      promoteThread(context.workspaceState, output)
    )
  );
}

export function deactivate(): void {
  // no-op
}
