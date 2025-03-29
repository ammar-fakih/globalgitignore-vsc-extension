# Global Gitignore VS Code Extension

This VS Code extension adds two context menu items to the file explorer:
1. "Add to Global Gitignore" - Adds a file or folder to your global gitignore file
2. "Add to Gitignore" - Adds a file or folder to the project's .gitignore file

## Features

- Right-click on any file or folder in the VS Code file explorer
- Choose either "Add to Global Gitignore" or "Add to Gitignore"
- For global gitignore, if the path hasn't been set before, you'll be prompted to enter it (defaults to ~/.gitignore)
- For local gitignore, it automatically finds the .gitignore file in your project root

## Usage

1. Right-click on a file or folder in the VS Code file explorer
2. Select either "Add to Global Gitignore" or "Add to Gitignore"
3. The path will be added to the respective gitignore file
4. You'll see a notification confirming the action

## Requirements

- VS Code 1.85.0 or higher

## Extension Settings

This extension contributes the following settings:

* `globalGitignorePath`: The path to your global gitignore file (defaults to ~/.gitignore) 