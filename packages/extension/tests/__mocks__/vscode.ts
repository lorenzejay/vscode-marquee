const vscode: any = {
  env: {},
  ConfigurationTarget: { Global: 1 },
  CodeActionKind: { QuickFix: 1 },
  Uri: { parse: (param: string) => `parsedUri-${param}` },
  Range: jest.fn()
};
vscode.TreeItemCollapsibleState = {
  Expanded: 'foo',
  Collapsed: 'bar'
};

vscode.commands = {
  registerCommand: jest.fn().mockImplementation((cmd: string) => cmd),
  executeCommand: jest.fn()
};

vscode.TreeItem = jest.fn();
vscode.EventEmitter = jest.fn();
vscode.workspace = {
  name: 'foobarWorkspace',
  workspaceFile: { path: '/foo/bar' },
  getConfiguration: jest.fn().mockReturnValue({ get: jest.fn(), update: jest.fn() }),
  onDidChangeConfiguration: jest.fn()
};
vscode.window = {
  createOutputChannel: jest.fn().mockReturnValue({ appendLine: jest.fn() }),
  createTreeView: jest.fn().mockReturnValue({ reveal: jest.fn() }),
  onDidChangeActiveColorTheme: jest.fn(),
  showOpenDialog: jest.fn().mockResolvedValue(['/foo/bar']),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  showSaveDialog: jest.fn().mockResolvedValue({ fsPath: '/bar/foo' })
};

export default vscode;
