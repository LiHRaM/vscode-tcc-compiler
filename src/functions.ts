"use strict";
import * as vscode from "vscode";
import * as path from "path";

let _terminalStack = [];
let _context = null;

const _execSync = require("child_process").execSync;
const _execFile = require("child_process").execFile;

/**
 * Compiles and runs the currently open C file.
 */
export function run(): vscode.Disposable {
  return vscode.commands.registerCommand("tcc-compiler.run", () => {
    checkTerminal();
    getLatestTerminal().sendText(tcc(' -run "' + getFileName() + '"'));
    getLatestTerminal().show();
  });
}

/**
 * Compiles the current file with user-specified flags and then runs it.
 * It does not save the compiled file.
 */
export function runWithFlags(): vscode.Disposable {
  return vscode.commands.registerCommand("tcc-compiler.runWithFlags", () => {
    let flags = " ";
    vscode.window
      .showInputBox({ prompt: "Please input flags." })
      .then((val: string) => {
        flags += val;
        checkTerminal();
        getLatestTerminal().sendText(
          tcc(flags + ' -run "' + getFileName() + '"')
        );
        getLatestTerminal().show();
      });
  });
}

/**
 * Compiles the currently open C file.
 */
export function compile(): vscode.Disposable {
  return vscode.commands.registerCommand("tcc-compiler.compile", () => {
    checkTerminal();
    _execSync(() => {
      getLatestTerminal().sendText(tcc(getFileName()));
      getLatestTerminal().show();
    });
  });
}

/**
 * Compiles the currently open C file with user specified flags.
 */
export function compileWithFlags(): vscode.Disposable {
  return vscode.commands.registerCommand(
    "tcc-compiler.compileWithFlags",
    () => {
      let flags = " ";
      vscode.window
        .showInputBox({ prompt: "Please input flags." })
        .then((val: string) => {
          flags += val;
          checkTerminal();
          getLatestTerminal().sendText(tcc(flags + " " + getFileName()));
					getLatestTerminal().show();
        });
    }
  );
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
function checkTerminal() {
  if (0 === _terminalStack.length) {
    let terminal = vscode.window.createTerminal(
      `compiler #${_terminalStack.length + 1}`
    );
    _terminalStack.push(terminal);
  }
}

/**
 * Gets the current terminal.
 */
function getLatestTerminal(): vscode.Terminal {
  return _terminalStack[_terminalStack.length - 1];
}

/**
 * Gets the name of the current C file.
 */
function getFileName(): string {
  return '"' + vscode.window.activeTextEditor.document.fileName.toString() + '"';
}

/**
 * Gets the path of TCC.
 * @param args Arguments for Tiny C Compiler.
 */
function tcc(args: string): string {
  return path.join(_context.extensionPath, "/Compiler/tcc.exe").concat(args);
}

/**
 * Gets the compilation flags from the user via input box.
 */
function getFlags(): Thenable<string> {
  return vscode.window.showInputBox({ prompt: "Please input flags." }).then(
    // TODO: Parse flags for validity.
    (value: string) => {
      return value;
    },
    (reason: any) => {
      vscode.window.showInformationMessage("Error!" + reason);
    }
  );
}
