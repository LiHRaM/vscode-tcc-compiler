"use strict";
import {
  window,
  ExtensionContext,
  Terminal,
  workspace,
  WorkspaceConfiguration
} from "vscode";
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
  getLatestTerminal().sendText(tcc(getFlags() + " -run " + getArgs()));
  getLatestTerminal().show();
}

/**
 * Runs TCC according to given flags.
 * Defaults to currently open C file if no tcc.json file is found.
 */
export function compile(): void {
  checkTerminal();
  getLatestTerminal().sendText(tcc(getFlags()));
  getLatestTerminal().show();
}

/**
 * Opens up and edits the current flags.
 * TODO: Make work!
 */
export function setFlags(): void {
  window
    .showInputBox({ prompt: "Please input compile arguments." })
    .then((val: string) => {
      // No input?
      if (val !== undefined || val === "") {
        try {
          let conf = workspace.getConfiguration("TCC");
          conf
            .update("TCC.flags", val, false)
            .then(() =>
              window.showInformationMessage("Flags successfully saved!")
            );
        } catch (error) {
          console.log(error.message);
        }
      }
    });
}

/**
 * File args for the TCC: Run command.
 * TODO: Make work!
 */
export function setArgs(): void {
  window
    .showInputBox({ prompt: "Please input run arguments." })
    .then((val: string) => {
      // No input?
      if (val !== undefined || val === "") {
        try {
          let conf = workspace.getConfiguration("TCC");
          conf
            .update("TCC.args", val, false)
            .then(() =>
              window.showInformationMessage("Arguments successfully saved!")
            );
        } catch (error) {
          console.log(error.message);
        }
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
 * Gets the flags from settings
 */
function getFlags(): string {
  let space = " ";
  try {
    var conf = workspace.getConfiguration("TCC");
    if (conf.flags !== undefined) {
      return space + conf.flags;
    }
    throw new Error("No flags given. Reverting to default.");
  } catch (error) {
    console.log(error);
    return space + getFileName();
  }
}

/**
 * Gets the args from settings
 */
function getArgs(): string {
  try {
    var conf = workspace.getConfiguration("TCC");
    if (conf.args !== undefined) {
      return conf.args;
    }
    throw new Error("No args given. Reverting to default.");
  } catch (error) {
    console.log(error);
    return "";
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
function tcc(flags: string): string {
  let space = " ";
  return path
    .join(_context.extensionPath, "/Compiler/tcc.exe")
    .concat(space + flags);
}
