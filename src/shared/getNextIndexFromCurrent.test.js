/* eslint-disable max-len */
import getNextIndexFromCurrent from './getNextIndexFromCurrent';

describe('Should return the correct item based on the desired direction with cycling', () => {
  it('Returns the next item', () => {
    expect(getNextIndexFromCurrent({ index: 0, last: 3 }, 'ArrowDown')).toEqual(1);
  });

  it('Returns the first item when the last is passed in', () => {
    expect(getNextIndexFromCurrent({ index: 3, last: 3 }, 'ArrowRight')).toEqual(0);
  });

  it('Returns the previous item', () => {
    expect(getNextIndexFromCurrent({ index: 1, last: 3 }, 'ArrowUp')).toEqual(0);
  });

  it('Returns the last item when the first is passed in', () => {
    expect(getNextIndexFromCurrent({ index: 0, last: 3 }, 'ArrowLeft')).toEqual(3);
  });
});

describe('Should remain on the first/last item when not cycling', () => {
  it('Stays at the last item when not cycling', () => {
    expect(getNextIndexFromCurrent({ index: 3, last: 3 }, 'ArrowDown', false)).toEqual(3);
  });

  it('Stays at the first item when not cycling', () => {
    expect(getNextIndexFromCurrent({ index: 0, last: 3 }, 'ArrowUp', false)).toEqual(0);
  });
});
