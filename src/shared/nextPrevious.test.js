/* eslint-disable max-len */
import nextPrevious from './nextPrevious';

// Mock array of items.
const items = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
];

describe('Should return the correct item based on the desired direction with cycling', () => {
  it('Returns the next item', () => {
    const nextItem = nextPrevious('ArrowDown', items[0], items);
    expect(nextItem).toEqual(items[1]);
  });

  it('Returns the first item when the last is passed in', () => {
    const nextItem = nextPrevious('ArrowRight', items[items.length - 1], items);
    expect(nextItem).toEqual(items[0]);
  });

  it('Returns the previous item', () => {
    const previousItem = nextPrevious('ArrowUp', items[1], items);
    expect(previousItem).toEqual(items[0]);
  });

  it('Returns the last item when the first is passed in', () => {
    const previousItem = nextPrevious('ArrowLeft', items[0], items);
    expect(previousItem).toEqual(items[items.length - 1]);
  });
});

describe('Should remain on the first/last item when not cycling', () => {
  it('Stays at the last item when not cycling', () => {
    const nextItem = nextPrevious('ArrowDown', items[items.length - 1], items, false);
    expect(nextItem).toEqual(items[items.length - 1]);
  });

  it('Stays at the first item when not cycling', () => {
    const previousItem = nextPrevious('ArrowUp', items[0], items, false);
    expect(previousItem).toEqual(items[0]);
  });
});
