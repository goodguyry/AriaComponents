/* eslint-disable max-len */
import { nextPrevious } from './nextPrevious';

// Mock array of items.
const items = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
];

// Mock key codes.
const keys = { next: 'next', previous: 'previous' };

describe('Should return the correct item based on the desired direction', () => {
  it('Returns the next item', () => {
    const nextItem = nextPrevious('next', items[0], items, keys);
    expect(nextItem).toEqual(items[1]);
  });

  it('Returns the first item when the last is passed in', () => {
    const nextItem = nextPrevious('next', items[items.length - 1], items, keys);
    expect(nextItem).toEqual(items[0]);
  });

  it('Returns the previous item', () => {
    const previousItem = nextPrevious('previous', items[1], items, keys);
    expect(previousItem).toEqual(items[0]);
  });

  it('Returns the last item when the first is passed in', () => {
    const previousItem = nextPrevious('previous', items[0], items, keys);
    expect(previousItem).toEqual(items[items.length - 1]);
  });
});
