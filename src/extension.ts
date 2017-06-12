"use strict";
import * as vscode from "vscode";

// Our files.
import * as functions from "./functions";

export function activate(context: vscode.ExtensionContext) {
  console.log("TCC-Compiler is active.");

	// Send the context to the functions folder to keep this one lean.
  functions.setContext(context);

  // TCC: Run
  context.subscriptions.push(functions.run());

	 // TCC: Compile
	context.subscriptions.push(functions.compile());

	// TCC: Set flags
	context.subscriptions.push(functions.setFlags());
}
