import uniqueId from './uniqueId';

describe('Adds a unique ID attribute to the given element.', () => {
  // Set up our document body
  document.body.innerHTML = '<span></span><div></div>';

  const span = document.querySelector('span');
  const div = document.querySelector('div');

  it('Should not have an ID attribute', () => {
    expect(span.id).toBeFalsy();
  });

  it('Should have an ID attribute', () => {
    span.id = uniqueId();
    expect(span.id).toMatch(/id_[\d\w]+/);
  });

  it('Should have a unique ID attribute', () => {
    span.id = uniqueId();
    div.id = uniqueId();
    expect(span.id).not.toEqual(div.id);
  });
});
