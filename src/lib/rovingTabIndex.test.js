/* eslint-disable max-len */
import {
  rovingTabIndex,
  tabIndexAllow,
  tabIndexDeny,
  toArray,
} from './rovingTabIndex';

// Set up our document body
document.body.innerHTML = `
  <div>
    <span class="span-1"></span>
    <span class="span-2"></span>
    <span class="span-3"></span>
  </div>
`;

const elements = document.querySelectorAll('span');
const div = document.querySelector('div');

describe('Correctly updates tabindex attribute.', () => {
  it('Allow on a single element', () => {
    rovingTabIndex(elements, elements[1]);

    expect(elements[0].getAttribute('tabindex')).toEqual('-1');
    expect(elements[1].getAttribute('tabindex')).toBeNull();
    expect(elements[2].getAttribute('tabindex')).toEqual('-1');
  });

  it('Allow on a NodeList of elements', () => {
    tabIndexAllow(elements);

    expect(elements[0].getAttribute('tabindex')).toBeNull();
    expect(elements[1].getAttribute('tabindex')).toBeNull();
    expect(elements[2].getAttribute('tabindex')).toBeNull();
  });

  it('Missing `allowed` argument', () => {
    tabIndexDeny(elements);

    expect(elements[0].getAttribute('tabindex')).toEqual('-1');
    expect(elements[1].getAttribute('tabindex')).toEqual('-1');
    expect(elements[2].getAttribute('tabindex')).toEqual('-1');
  });
});

it('Should convert an HTMLElement and NodeList to an Array', () => {
  expect(toArray(elements)).toEqual(expect.arrayContaining([elements[0], elements[1], elements[2]]));
  expect(toArray(elements[1])).toEqual(expect.arrayContaining([elements[1]]));
  expect(toArray(elements[1].classList)).toEqual(expect.arrayContaining([]));
  expect(toArray(div.children)).toEqual(expect.arrayContaining([elements[0], elements[1], elements[2]]));
});
