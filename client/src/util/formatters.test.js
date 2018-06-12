import { trimSafely, toDateFormat } from './formatters';

describe('formatters', () => {
  describe('#trimSafely()', () => {
    it('returns original string if null', () => {
      expect(trimSafely('hello')).toEqual('hello');
    });

    it('returns empty string if null input', () => {
      expect(trimSafely(null)).toEqual('');
    });

    it('returns empty string if undefined input', () => {
      expect(trimSafely(undefined)).toEqual('');
    });

    it('returns empty string if empty string input', () => {
      expect(trimSafely('')).toEqual('');
    });
  });

  describe('#toDateFormat()', () => {
    it('returns a formatted date', () => {
      expect(toDateFormat('2012-05-31')).toEqual('5/31/2012');
    });

    it('returns a formatted date only when date and time in input', () => {
      expect(toDateFormat('1941-12-07T12:00:00.123Z')).toEqual('12/7/1941');
    });
  });
});
