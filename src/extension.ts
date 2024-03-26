// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import chokidar from 'chokidar';
import debounce from 'debounce';

let watcher: chokidar.FSWatcher;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('TS Restarter is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ts-restarter.startWatch', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('TS Restarter will start watching!');

		console.log('TS Restarter will start watching!');

		startWatch();
	});

	let stopped = vscode.commands.registerCommand('ts-restarter.stopWatch', () => {
		// Display a message box to the user
		console.log('TS Restarter will stop watching!');

		stopWatcher();
	});

	vscode.commands.executeCommand('ts-restarter.startWatch');

	context.subscriptions.push(disposable);
	context.subscriptions.push(stopped);
}

// This method is called when your extension is deactivated
export function deactivate() {
	stopWatcher();
	console.log('TS Restarter is now deactivated!');
}

function readConfig() {
  const config = vscode.workspace.getConfiguration();
  const watch: string[] | undefined = config.get('ts-restarter.watch');
  const ignore: string[] | undefined = config.get('ts-restarter.ignore');

	return { watch, ignore };
}

function startWatch() {
	const { watch, ignore } = readConfig();
	if (!watch) {
		console.error('No watch paths specified');
		return;
	}
	console.log('TS Restarter: watching', watch);
	console.log('TS Restarter: ignoring', ignore);
	const projectFolder = getProjectFolder();
	console.log('TS Restarter: project folder found:', projectFolder);
	const globs = watch.map((w) => `${projectFolder}/${w}`);
	watcher = chokidar.watch(globs, {
		ignored: ignore,
		ignoreInitial: true
	});
	watcher
		.on('add', debouncedRestartTSServer)
		.on('change', debouncedRestartTSServer)
		.on('unlink', debouncedRestartTSServer);
}

const debouncedRestartTSServer = debounce(function restartTSServer() {
	console.log('TS Restarter: restarting TS server');
	vscode.commands.executeCommand('typescript.restartTsServer');
}, 300);

function restartWatcher() {
	stopWatcher();
	startWatch();
}

function stopWatcher() {
	if (watcher) {
		watcher.close();
	}
	console.log('TS Restarter: stopped watching');
}

function getProjectFolder() {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders[0].uri.fsPath; // Renvoie le chemin du premier dossier
  } else {
    vscode.window.showInformationMessage("No workspace folder found. TS Restarter won't work.");
    return null;
  }
}

vscode.workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('ts-restarter.watch')) {
    restartWatcher();
  }
});
