import { LoadingState, isReadyForAction } from './loadingHelper';

describe('loadingHelper', () => {
  describe('#isReadyForAction()', () => {
    it('returns true for idle and ready state', () => {
      expect(isReadyForAction(LoadingState.idle)).toBeTruthy();
      expect(isReadyForAction(LoadingState.ready)).toBeTruthy();
    });

    it('returns false for any state besides idle and ready state', () => {
      expect(isReadyForAction(LoadingState.updating)).toBeFalsy();
      expect(isReadyForAction(LoadingState.error)).toBeFalsy();
      expect(isReadyForAction(LoadingState.waiting)).toBeFalsy();
      expect(isReadyForAction('any string')).toBeFalsy();
      expect(isReadyForAction(null)).toBeFalsy();
      expect(isReadyForAction(undefined)).toBeFalsy();
    });
  });
});
