import { clone } from './common';

describe('common', () => {
  describe('#clone()', () => {
    it('copies the object fields values not the pointers ', () => {
      // given
      const original = {
        number: 123,
        obj: {
          a: 'b',
        },
        arr: [{ c: 'd' }],
      };

      // when
      const theClone = clone(original);
      original.number = 321;
      original.obj.a = 'xyz';
      original.arr[0].c = 'xyz';

      // then
      expect(theClone).toEqual({
        number: 123,
        obj: {
          a: 'b',
        },
        arr: [{ c: 'd' }],
      });
    });
  });
});
