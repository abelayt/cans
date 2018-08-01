import { validate, validateCaseNumber, isFormValid } from './ClientFormValidator';

describe('ClientFormValidator', () => {
  describe('#validate()', () => {
    it('first_name', () => {
      expect(validate('first_name', 'Mike')).toBe(true);
      expect(validate('first_name', 'Mike John')).toBe(true);
      expect(validate('first_name', 'Mike  John')).toBe(false);
      expect(validate('first_name', 'Mike-John')).toBe(true);
      expect(validate('first_name', 'mike')).toBe(true);
      expect(validate('first_name', 'Mike1')).toBe(false);
      expect(validate('first_name', 'Mike-')).toBe(false);
      expect(validate('first_name', '   ')).toBe(false);
      expect(validate('first_name', 'Mike#')).toBe(false);
      expect(validate('first_name', '@')).toBe(false);
    });

    it('last_name', () => {
      expect(validate('last_name', 'Mike')).toBe(true);
      expect(validate('last_name', 'Mike John')).toBe(true);
      expect(validate('last_name', 'Mike  John')).toBe(false);
      expect(validate('last_name', 'Mike-John')).toBe(true);
      expect(validate('last_name', 'mike')).toBe(true);
      expect(validate('last_name', 'Mike1')).toBe(false);
      expect(validate('last_name', 'Mike-')).toBe(false);
      expect(validate('last_name', '   ')).toBe(false);
      expect(validate('last_name', 'Mike#')).toBe(false);
      expect(validate('last_name', '@')).toBe(false);
    });

    it('external_id', () => {
      expect(validate('external_id', '1234567891234567890')).toBe(true);
      expect(validate('external_id', '1234-5678-9123-4567890')).toBe(true);
      expect(validate('external_id', '12345678912345678900')).toBe(false);
      expect(validate('external_id', '123456789')).toBe(false);
      expect(validate('external_id', '1234--5678-9123-4567890')).toBe(false);
      expect(validate('external_id', '76cv39d6')).toBe(false);
      expect(validate('external_id', 'vgh7321 ')).toBe(false);
      expect(validate('external_id', '#34la7sd')).toBe(false);
      expect(validate('external_id', '   ')).toBe(false);
    });

    it('dob', () => {
      expect(validate('dob', '2012/10/12')).toBe(true);
      expect(validate('dob', null)).toBe(false);
      expect(validate('dob', undefined)).toBe(false);
      expect(validate('dob', '')).toBe(false);
    });

    it('county', () => {
      expect(validate('county', { id: '1' })).toBe(true);
      expect(validate('county', {})).toBe(false);
      expect(validate('county', null)).toBe(false);
      expect(validate('county', undefined)).toBe(false);
      expect(validate('county', '')).toBe(false);
    });

    it('unknown field name', () => {
      expect(validate('unknownFieldName', { id: '1' })).toBe(false);
      expect(validate('unknownFieldName', {})).toBe(false);
      expect(validate('unknownFieldName', null)).toBe(false);
      expect(validate('unknownFieldName', undefined)).toBe(false);
      expect(validate('unknownFieldName', '')).toBe(false);
      expect(validate('unknownFieldName', 'string')).toBe(false);
    });
  });

  describe('#validateCaseNumber()', () => {
    it('should return true for empty case numbers', () => {
      expect(validateCaseNumber(undefined)).toBeTruthy();
      expect(validateCaseNumber(null)).toBeTruthy();
      expect(validateCaseNumber('')).toBeTruthy();
    });

    it('should return true for valid case numbers', () => {
      expect(validateCaseNumber('a')).toBeTruthy();
      expect(validateCaseNumber('abc')).toBeTruthy();
      expect(validateCaseNumber('abcXYZ123')).toBeTruthy();
    });

    it('should return false for invalid case numbers', () => {
      expect(validateCaseNumber('/')).toBeFalsy();
      expect(validateCaseNumber('a%')).toBeFalsy();
      expect(validateCaseNumber('123456789012345678901234567890123456789012345678901')).toBeFalsy();
    });
  });

  describe('#isFormValid()', () => {
    it('returns false when invalid', () => {
      expect(
        isFormValid({
          first_name: '',
          last_name: '',
          dob: '',
          external_id: '',
          county: '',
          cases: [],
        })
      ).toBe(false);
    });

    it('returns true when valid', () => {
      expect(
        isFormValid({
          first_name: 'Amber',
          last_name: 'Jersey',
          dob: '10/12/2012',
          external_id: '1234567891234567890',
          county: { id: 1 },
          cases: [
            {
              external_id: '123',
            },
          ],
        })
      ).toBe(true);
    });
  });
});
