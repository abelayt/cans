export const LoadingState = Object.freeze({
  idle: 'IDLE',
  error: 'ERROR',
  ready: 'READY',
  updating: 'UPDATING',
  waiting: 'WAITING',
});

export function isReadyForAction(status) {
  return LoadingState.idle === status || LoadingState.ready === status;
}
