"use strict";
import { window, ExtensionContext, Terminal, workspace } from 'vscode';
import * as path from "path";
import * as fs from "fs";

let _terminalStack = [];
let _context = null;

/**
 * Runs according to current flags.
 * Defaults to currently open C file if no flags are given.
 */
export function run(): void {
  checkTerminal();
  getLatestTerminal().sendText(tcc(getArgs() + " -run "));
  getLatestTerminal().show();
}

/**
 * Runs TCC according to given flags.
 * Defaults to currently open C file if no tcc.json file is found.
 */
export function compile(): void {
  checkTerminal();
  getLatestTerminal().sendText(tcc(getArgs()));
  getLatestTerminal().show();
}

/**
 * Opens up and edits the current flags.
 */
export function setFlags(): void {
  window
    .showInputBox({ prompt: "Please input compile arguments." })
    .then((val: string) => {
      // No input?
      if (val !== undefined || val === "") {
        // Write to file.
        let args = { fileArgs: val };
        fs.writeFileSync(
          path.join(getSettingsDirectory(), "tcc.json"),
          JSON.stringify(args)
        );
      }
    });
}

/**
 * Sets the context.
 */
export function setContext(context: ExtensionContext) {
  _context = context;
}

/**
 * Gets the arguments from tcc.json
 */
function getArgs(): string {
  let args = " ";
  try {
    var argsFile = JSON.parse(
      fs.readFileSync(path.join(getSettingsDirectory(), "tcc.json"), "utf8")
    );
    args += argsFile.fileArgs;
  } catch (error) {
    args += getFileName();
  } finally {
    return args;
  }
}

/**
 * Creates a new terminal if none exist.
 */
function checkTerminal() {
  if (0 === _terminalStack.length) {
    let terminal = window.createTerminal(
      `compiler #${_terminalStack.length + 1}`
    );
    _terminalStack.push(terminal);
  }
}

/**
 * Gets the current terminal.
 */
function getLatestTerminal(): Terminal {
  return _terminalStack[_terminalStack.length - 1];
}

/**
 * Gets the name of the current C file.
 */
function getFileName(): string {
  return '"' + window.activeTextEditor.document.fileName.toString() + '"';
}

/**
 * Gets the path of TCC.
 * @param args Arguments for Tiny C Compiler.
 */
function tcc(args: string): string {
  let space = " ";
  return path
    .join(_context.extensionPath, "/Compiler/tcc.exe")
    .concat(space + args);
}

/**
 * If a folder is selected in vscode, then get the current workspace. Otherwise, it is assumed to be the current file folder.
 */
function getSettingsDirectory(): string {
	return workspace.rootPath === undefined
		? path.join(getFileName(), "..", ".vscode")
		: path.join(workspace.rootPath, ".vscode");
}
