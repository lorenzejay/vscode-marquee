import { State, Configuration } from './types'

export const HN_RSS_HOSTNAME = 'hnrss.org'
export const MIN_UPDATE_INTERVAL = 1000 * 60
export const FETCH_DATA_TIMEOUT = 10000
export const DEFAULT_STATE: State = {
  news: [],
  isFetching: true,
  channel: 'HN Newest',
  error: null
}
export const DEFAULT_CONFIGURATION: Configuration = {
  feeds: {},
  updateInterval: MIN_UPDATE_INTERVAL
}
