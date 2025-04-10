# Global Gitignore VS Code Extension

This VS Code extension adds context menu items to the file explorer:
1. "Add to Global Gitignore" - Adds a file or folder to your global gitignore file
2. "Add to Gitignore" - Adds a file or folder to the project's .gitignore file
3. "Add to .git/info/exclude" - Adds a file or folder to the repository's exclude file (local only, not shared with remote)

## Features

- Right-click on any file or folder in the VS Code file explorer
- Choose from three options:
  1. "Add to Global Gitignore" - affects all repositories
  2. "Add to Gitignore" - affects the current repository and shared with remote
  3. "Add to .git/info/exclude" - affects only the current repository locally
- For global gitignore, if the path hasn't been set before, you'll be prompted to enter it (defaults to ~/.gitignore)
- For local gitignore, it automatically finds the .gitignore file in your project root
- For .git/info/exclude, it automatically creates the file if it doesn't exist
- Open commands available in the command palette (Cmd+Shift+P / Ctrl+Shift+P):
  - "Open Global Gitignore"
  - "Open .git/info/exclude"

## Usage

1. Right-click on a file or folder in the VS Code file explorer
2. Select one of the three options:
   - "Add to Global Gitignore"
   - "Add to Gitignore"
   - "Add to .git/info/exclude"
3. The path will be added to the respective file
4. You'll see a notification confirming the action

## Requirements

- VS Code 1.85.0 or higher

## Extension Settings

This extension contributes the following settings:

* `globalGitignorePath`: The path to your global gitignore file (defaults to ~/.gitignore) 