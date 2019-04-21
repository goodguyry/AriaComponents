import rovingTabIndex from './rovingTabIndex';

describe('Correctly updates tabindex attribute.', () => {
  // Set up our document body
  document.body.innerHTML = `
    <span class="span-1"></span>
    <span class="span-2"></span>
    <span class="span-3"></span>
  `;

  const elements = document.querySelectorAll('span');

  it('Allow on a single element', () => {
    rovingTabIndex(elements, elements[1]);

    expect(elements[0].getAttribute('tabindex')).toEqual('-1');
    expect(elements[1].getAttribute('tabindex')).toEqual(null);
    expect(elements[2].getAttribute('tabindex')).toEqual('-1');
  });

  it('Allow on a NodeList of elements', () => {
    rovingTabIndex(elements, elements);

    expect(elements[0].getAttribute('tabindex')).toEqual(null);
    expect(elements[1].getAttribute('tabindex')).toEqual(null);
    expect(elements[2].getAttribute('tabindex')).toEqual(null);
  });

  it('Missing `allowed` argument', () => {
    rovingTabIndex(elements);

    expect(elements[0].getAttribute('tabindex')).toEqual('-1');
    expect(elements[1].getAttribute('tabindex')).toEqual('-1');
    expect(elements[2].getAttribute('tabindex')).toEqual('-1');
  });
});
