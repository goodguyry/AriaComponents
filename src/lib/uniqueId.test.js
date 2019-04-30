import { getUniqueId, setUniqueId } from './uniqueId';

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
    expect(getUniqueId()).toMatch(/id_[\d\w]+/);
  });

  it('Should return unique IDs', () => {
    expect(getUniqueId()).not.toEqual(getUniqueId());
  });

  // set
  it('Should add an ID attribute', () => {
    setUniqueId(span);
    expect(span.id).toMatch(/id_[\d\w]+/);
  });

  it('Should add unique ID attributes', () => {
    setUniqueId(span);
    setUniqueId(div);
    expect(span.id).not.toEqual(div.id);
  });
});
