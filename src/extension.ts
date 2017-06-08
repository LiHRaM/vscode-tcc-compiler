"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// Terminals
let terminalStack = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("TCC-Compiler is active.");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("tcc-compiler.run", () => {
      checkTerminal();
      getLatestTerminal().sendText(
        path
          .join(context.extensionPath, "/Compiler/tcc.exe")
          .concat(' -run "' + getFileName() + '"')
      );
      getLatestTerminal().show();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "tcc-compiler.runWithFlags",
      (flags: string) => {
        this;
        checkTerminal();
        getLatestTerminal().sendText(
          path
            .join(context.extensionPath, "/Compiler/tcc.exe")
            .concat(flags + ' -run "' + getFileName() + '"')
        );
        getLatestTerminal().show();
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("tcc-compiler.compile", () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World!");
    })
  );

  function checkTerminal() {
    if (0 === terminalStack.length) {
      let terminal = vscode.window.createTerminal(
        `compiler #${terminalStack.length + 1}`
      );
      terminalStack.push(terminal);
    }
  }

  function getLatestTerminal() {
    return terminalStack[terminalStack.length - 1];
  }

  function getFileName() {
    return vscode.window.activeTextEditor.document.fileName.toString();
  }
}
