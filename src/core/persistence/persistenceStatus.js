export const PERSISTENCE_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  DIRTY: 'pending',
  SAVING: 'saving',
  SAVED: 'saved',
  OFFLINE: 'offline',
  ERROR: 'error',
})

export const isPersistenceBusy = (status) => (
  status === PERSISTENCE_STATUS.DIRTY
  || status === PERSISTENCE_STATUS.SAVING
  || status === PERSISTENCE_STATUS.LOADING
)
