import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

class GlobalGitignoreProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return Promise.resolve([]);
    }
}

export function activate(context: vscode.ExtensionContext) {
    let globalGitignorePath = context.globalState.get<string>('globalGitignorePath') || path.join(os.homedir(), '.gitignore');

    // Register the view
    const globalGitignoreProvider = new GlobalGitignoreProvider();
    vscode.window.registerTreeDataProvider('globalGitignoreExplorer', globalGitignoreProvider);

    const openGlobalGitignore = vscode.commands.registerCommand('global-gitignore.openGlobalGitignore', async () => {
        try {
            // Check if global gitignore exists
            if (!fs.existsSync(globalGitignorePath)) {
                const result = await vscode.window.showInputBox({
                    prompt: 'Enter the path to your global gitignore file',
                    value: globalGitignorePath,
                    ignoreFocusOut: true
                });

                if (result) {
                    globalGitignorePath = result;
                    context.globalState.update('globalGitignorePath', globalGitignorePath);
                } else {
                    return;
                }
            }

            // Create the file if it doesn't exist
            if (!fs.existsSync(globalGitignorePath)) {
                fs.writeFileSync(globalGitignorePath, '');
            }

            // Open the file
            const document = await vscode.workspace.openTextDocument(globalGitignorePath);
            await vscode.window.showTextDocument(document);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open global gitignore: ${error}`);
        }
    });

    const addToGlobalGitignore = vscode.commands.registerCommand('global-gitignore.addToGlobalGitignore', async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        try {
            let targetPaths: string[] = [];
            
            if (uris) {
                // If called from context menu with multiple selections
                targetPaths = uris.map(uri => uri.fsPath);
            } else if (uri) {
                // If called from context menu with single selection
                targetPaths = [uri.fsPath];
            } else {
                // If called from command palette, get the active editor
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No active editor or file selected');
                    return;
                }
                targetPaths = [editor.document.uri.fsPath];
            }

            // Check if global gitignore exists
            if (!fs.existsSync(globalGitignorePath)) {
                const result = await vscode.window.showInputBox({
                    prompt: 'Enter the path to your global gitignore file',
                    value: globalGitignorePath,
                    ignoreFocusOut: true
                });

                if (result) {
                    globalGitignorePath = result;
                    context.globalState.update('globalGitignorePath', globalGitignorePath);
                } else {
                    return;
                }
            }

            const gitignoreContent = fs.existsSync(globalGitignorePath) 
                ? fs.readFileSync(globalGitignorePath, 'utf8')
                : '';

            let addedPaths: string[] = [];
            let existingPaths: string[] = [];

            for (const targetPath of targetPaths) {
                const relativePath = path.relative(os.homedir(), targetPath);
                if (!gitignoreContent.includes(relativePath)) {
                    fs.appendFileSync(globalGitignorePath, `\n${relativePath}`);
                    addedPaths.push(relativePath);
                } else {
                    existingPaths.push(relativePath);
                }
            }

            if (addedPaths.length > 0) {
                vscode.window.showInformationMessage(`Added ${addedPaths.length} path(s) to global gitignore`);
            }
            if (existingPaths.length > 0) {
                vscode.window.showInformationMessage(`${existingPaths.length} path(s) already in global gitignore`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to add to global gitignore: ${error}`);
        }
    });

    const addToGitignore = vscode.commands.registerCommand('global-gitignore.addToGitignore', async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        try {
            let targetPaths: string[] = [];
            let workspaceFolder: vscode.WorkspaceFolder | undefined;
            
            if (uris) {
                // If called from context menu with multiple selections
                targetPaths = uris.map(uri => uri.fsPath);
                workspaceFolder = vscode.workspace.getWorkspaceFolder(uris[0]);
            } else if (uri) {
                // If called from context menu with single selection
                targetPaths = [uri.fsPath];
                workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
            } else {
                // If called from command palette, get the active editor
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No active editor or file selected');
                    return;
                }
                targetPaths = [editor.document.uri.fsPath];
                workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
            }

            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            const gitignorePath = path.join(workspaceFolder.uri.fsPath, '.gitignore');
            const gitignoreContent = fs.existsSync(gitignorePath)
                ? fs.readFileSync(gitignorePath, 'utf8')
                : '';

            let addedPaths: string[] = [];
            let existingPaths: string[] = [];

            for (const targetPath of targetPaths) {
                const relativePath = path.relative(workspaceFolder.uri.fsPath, targetPath);
                if (!gitignoreContent.includes(relativePath)) {
                    fs.appendFileSync(gitignorePath, `\n${relativePath}`);
                    addedPaths.push(relativePath);
                } else {
                    existingPaths.push(relativePath);
                }
            }

            if (addedPaths.length > 0) {
                vscode.window.showInformationMessage(`Added ${addedPaths.length} path(s) to .gitignore`);
            }
            if (existingPaths.length > 0) {
                vscode.window.showInformationMessage(`${existingPaths.length} path(s) already in .gitignore`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to add to .gitignore: ${error}`);
        }
    });

    context.subscriptions.push(addToGlobalGitignore, addToGitignore, openGlobalGitignore);
}

export function deactivate() {} 