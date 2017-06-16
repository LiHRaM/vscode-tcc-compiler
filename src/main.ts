"use strict";
import { ExtensionContext, commands } from "vscode";
import { run, compile, setFlags, setArgs, setContext } from "./commands";

export function activate(context: ExtensionContext) {
  console.log("TCC-Compiler is active.");

  // Send the context to the functions folder to keep this one lean.
  setContext(context);

  // TCC: Run
  context.subscriptions.push(
    commands.registerCommand("tcc-compiler.run", () => {
      run();
    })
  );

  // TCC: Compile
  context.subscriptions.push(
    commands.registerCommand("tcc-compiler.compile", () => {
      compile();
    })
  );

  // TCC: Set flags
  context.subscriptions.push(
    commands.registerCommand("tcc-compiler.setFlags", () => {
      setFlags();
    })
	);
	
	// TCC: Set args
	context.subscriptions.push(
		commands.registerCommand("tcc-compiler.setArgs", () => {
			setArgs();
		})
	);
}