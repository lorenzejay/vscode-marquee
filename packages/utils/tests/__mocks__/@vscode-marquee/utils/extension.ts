const actualExport = jest.requireActual('../../../../src/extension')

const defaultChannel = {
  appendLine: jest.fn()
}

export default class ExtensionManagerMock {
  on = jest.fn()
  emit = jest.fn()
  updateState = jest.fn()
  updateConfiguration = jest.fn()
  broadcast = jest.fn()
  getActiveWorkspace = jest.fn().mockReturnValue(null)
  getTextSelection = jest.fn().mockReturnValue({})
  generateId = jest.fn().mockReturnValue('123457890')
  _disposables = []
  _tangle: any
  _state: any
  _configuration: any

  constructor (
    public _context = {},
    public _channel = defaultChannel,
    ___: any,
    defaultConfig: any,
    defaultState: any
  ) {
    this._configuration = defaultConfig
    this._state = defaultState
  }

  get configuration () {
    return this._configuration
  }

  get state () {
    return this._state
  }

  setBroadcaster (tangle: any) {
    this._tangle = tangle
    return this
  }
}

export const getExtProps = jest.fn().mockReturnValue({ some: 'props' })
export const WorkspaceType = actualExport.WorkspaceType
export const pkg = actualExport.pkg
export const defaultConfigurations = actualExport.defaultConfigurations
export const DEFAULT_STATE = actualExport.DEFAULT_STATE
export const DEFAULT_CONFIGURATION = actualExport.DEFAULT_CONFIGURATION

export const GitProvider = class {}
