"use strict";
// The module 'vscode' contains the VS Code extensibility API
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
  const execSync = require("child_process").execSync;
  const execFile = require("child_process").execFile;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  /**
	 * TCC: Run
	 */
  context.subscriptions.push(
    vscode.commands.registerCommand("tcc-compiler.run", () => {
      checkTerminal();
      getLatestTerminal().sendText(tcc(' -run "' + getFileName() + '"'));
      getLatestTerminal().show();
    })
  );

  /**
	 * TCC: Run with flags...
	 */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "tcc-compiler.runWithFlags",
      (flags: string) => {
        checkTerminal();
        getLatestTerminal().sendText(
          tcc(flags + ' -run "' + getFileName() + '"')
        );
        getLatestTerminal().show();
      }
    )
  );

  /**
	 * TCC: Compile
	 */
  context.subscriptions.push(
    vscode.commands.registerCommand("tcc-compiler.compile", () => {
      checkTerminal();
      var loc = path.join(__dirname, "..", "..");
      var fname = vscode.window.activeTextEditor.document.fileName;
      var outname = fname.split("\\");
      var cnt = outname.length;
      var outname = outname[cnt - 1].split(".");
      var output = path.join(
        vscode.window.activeTextEditor.document.fileName,
        "..",
        outname[0] + ".exe"
      );
      try {
        let cmd = tcc(' "' + getFileName() + '" -o "' + output + '"');
        execSync(cmd);
        vscode.window.showInformationMessage("Compile success!");
      } catch (error) {
        // TODO: Do this better.
        const editor = vscode.window.activeTextEditor;
        var errormsg = error.message.split("/");
        vscode.window.showErrorMessage(errormsg[errormsg.length - 1]);
        var line = errormsg[errormsg.length - 1].split(":");
        var position = editor.selection.active;
        var newPosition = position.with(parseInt(line[1]) - 1, 100);
        var StartPosition = position.with(parseInt(line[1]) - 1, 0);
        var newSelection = new vscode.Selection(StartPosition, newPosition);
        editor.selection = newSelection;
      }
    })
  );

  /**
	 * Creates a new terminal if none exist.
	 */
  function checkTerminal() {
    if (0 === terminalStack.length) {
      let terminal = vscode.window.createTerminal(
        `compiler #${terminalStack.length + 1}`
      );
      terminalStack.push(terminal);
    }
  }

  /**
	 * Gets the last terminal.
	 */
  function getLatestTerminal() {
    return terminalStack[terminalStack.length - 1];
  }

  /**
	 * Gets the name of the current C file.
	 */
  function getFileName() {
    return vscode.window.activeTextEditor.document.fileName.toString();
  }

  /**
	 * Gets the path of TCC.
	 * @param args Arguments for Tiny C Compiler.
	 */
  function tcc(args: string) {
    return path.join(context.extensionPath, "/Compiler/tcc.exe").concat(args);
  }
}
