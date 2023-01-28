import AriaComponent from '../AriaComponent';

describe('Adds a unique ID attribute to the given element.', () => {
  // Set up our document body
  document.body.innerHTML = '<span></span><div></div>';

  const span = document.querySelector('span');
  const div = document.querySelector('div');

  beforeEach(() => {
    span.removeAttribute('id');
    div.removeAttribute('id');
  });

  // get
  it('Should return an ID', () => {
    expect(AriaComponent.getUniqueId()).toMatch(/ac-id_[\d\w]+/);
  });

  it('Should return unique IDs', () => {
    expect(AriaComponent.getUniqueId()).not.toEqual(AriaComponent.getUniqueId());
  });
});
