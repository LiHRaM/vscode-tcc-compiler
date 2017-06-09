"use strict";

import * as vscode from "vscode";
import * as path from "path";

// Our files.
import * as functions from "./functions";

export function activate(context: vscode.ExtensionContext) {
  console.log("TCC-Compiler is active.");

	// Send the context to the functions folder to keep this one lean.
  functions.setContext(context);

  /**
	 * TCC: Run
	 */
  context.subscriptions.push(functions.run());

  /**
	 * TCC: Run with flags...
	 */
  context.subscriptions.push(functions.runWithFlags());

  /**
	 * TCC: Compile
	 */
  context.subscriptions.push(functions.compile());
}
