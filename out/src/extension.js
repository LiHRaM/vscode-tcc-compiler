'use strict';
const vscode = require("vscode");
function activate(context) {
    var path = require("path");
    let terminalStack = [];
    var loc = path.join(__dirname, '..', '..');
    const execSync = require('child_process').execSync;
    const execFile = require('child_process').execFile;
    context.subscriptions.push(vscode.commands.registerCommand('tcc.run', () => {
        if (terminalStack.length === 0) {
            var output = makeTerminal();
        }
        getLatestTerminal().show();
        var fname = vscode.window.activeTextEditor.document.fileName.toString();
        getLatestTerminal().sendText(loc + "\\compiler\\tcc.exe -run \"" + fname + "\"");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('tcc.compile', () => {
        if (terminalStack.length === 0) {
            makeTerminal();
        }
        var loc = path.join(__dirname, '..', '..');
        var fname = vscode.window.activeTextEditor.document.fileName;
        var outname = fname.split("\\");
        var cnt = outname.length;
        var outname = outname[cnt - 1].split(".");
        var output = path.join(vscode.window.activeTextEditor.document.fileName, '..', outname[0] + '.exe');
        try {
            execSync(loc + "\\compiler\\tcc.exe \"" + fname + "\" -o \"" + output + "\"");
            vscode.window.showInformationMessage('Compile successd');
        }
        catch (error) {
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
    }));
    function makeTerminal() {
        terminalStack.push(vscode.window.createTerminal(`compiler #${terminalStack.length + 1}`));
    }
    function makeOutput() {
        var myOutputChannel = vscode.window.createOutputChannel('Running');
        myOutputChannel.show();
        terminalStack.length + 1;
        return myOutputChannel;
    }
    function getLatestTerminal() {
        return terminalStack[terminalStack.length - 1];
    }
    if ('onDidCloseTerminal' in vscode.window) {
        vscode.window.onDidCloseTerminal((terminal) => {
            terminalStack.pop();
        });
    }
    if ('onDidOpenTerminal' in vscode.window) {
        vscode.window.onDidOpenTerminal((terminal) => {
            terminalStack.length + 1;
        });
    }
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map