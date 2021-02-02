/* eslint-disable max-len */
import { rovingTabIndex, tabIndexAllow, tabIndexDeny } from './rovingTabIndex';

// Set up our document body
document.body.innerHTML = `
  <div>
    <span class="span-1"></span>
    <span class="span-2"></span>
    <span class="span-3"></span>
  </div>
`;

const elements = document.querySelectorAll('span');

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
