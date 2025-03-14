const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
    let disposable = vscode.commands.registerCommand('ai-code-reviewer.openPanel', () => {
        const panel = vscode.window.createWebviewPanel(
            'aiCodeReviewPanel',
            'AI Code Reviewer',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'reviewCode') {
             
                    const response = await axios.post('https://code-reviewer-backend-production.up.railway.app/ai/get-review', { code: message.code });
                    panel.webview.postMessage({ command: 'updateReview', review: response.data });
                
            }
        }, undefined, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Code Reviewer</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
            <style>
                body { font-family: Arial, sans-serif; padding: 10px; background-color: #1e1e1e; color: #ffffff; }
                textarea { width: 100%; height: 200px; background: #282c34; color: white; border: 1px solid #ddd; padding: 10px; font-family: 'Fira Code', monospace; }
                button { margin-top: 10px; padding: 8px 12px; background-color: #007ACC; color: white; border: none; cursor: pointer; }
                pre { background: #282c34; padding: 10px; border-radius: 5px; overflow-x: auto; }
                code { font-family: "Fira Code", monospace; font-size: 14px; }
                .markdown-container { margin-top: 10px; padding: 10px; border: 1px solid #ddd; background-color: #2d2d2d; color: #ccc; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <h2>AI Code Reviewer</h2>
            <textarea id="codeInput">// Paste your code here</textarea>
            <button onclick="reviewCode()">Review Code</button>
            <h3>Review Output:</h3>
            <div id="reviewOutput" class="markdown-container">Code review results will appear here...</div>

            <script>
                const vscode = acquireVsCodeApi();

                function reviewCode() {
                    const code = document.getElementById('codeInput').value;
                    vscode.postMessage({ command: 'reviewCode', code });
                }

                window.addEventListener('message', event => {
                    if (event.data.command === 'updateReview') {
                        document.getElementById('reviewOutput').innerText = event.data.review;
                    }
                });
            </script>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
