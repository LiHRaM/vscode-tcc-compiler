"use strict";
import * as vscode from "vscode";
import * as path from "path";

let _terminalStack = [];
let _context = null;

const _execSync = require("child_process").execSync;
const _execFile = require("child_process").execFile;

// Main functions
export function run() {
  return vscode.commands.registerCommand("tcc-compiler.run", () => {
    checkTerminal();
    getLatestTerminal().sendText(tcc(' -run "' + getFileName() + '"'));
    getLatestTerminal().show();
  });
}

export function runWithFlags() {
  return vscode.commands.registerCommand(
    "tcc-compiler.runWithFlags",
    (flags: string) => {
      checkTerminal();
      getLatestTerminal().sendText(
        tcc(flags + ' -run "' + getFileName() + '"')
      );
      getLatestTerminal().show();
    }
  );
}

export function compile() {
  return vscode.commands.registerCommand("tcc-compiler.compile", () => {
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
      _execSync(cmd);
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
  });
}

// Helper functions

/**
 * Sets the context.
 */
export function setContext(context: vscode.ExtensionContext) {
	_context = context;
}

/**
 * Creates a new terminal if none exist.
 */
export function checkTerminal() {
  if (0 === _terminalStack.length) {
    let terminal = vscode.window.createTerminal(
      `compiler #${_terminalStack.length + 1}`
    );
    _terminalStack.push(terminal);
  }
}

/**
 * Gets the last terminal.
 */
export function getLatestTerminal() {
  return _terminalStack[_terminalStack.length - 1];
}

/**
 * Gets the name of the current C file.
 */
export function getFileName() {
  return vscode.window.activeTextEditor.document.fileName.toString();
}

/**
 * Gets the path of TCC.
 * @param args Arguments for Tiny C Compiler.
 */
export function tcc(args: string) {
  return path.join(_context.extensionPath, "/Compiler/tcc.exe").concat(args);
}
