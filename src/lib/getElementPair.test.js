import getElementPair from './getElementPair';

describe('Collects interactive child elements', () => {
  // Set up our document body
  document.body.innerHTML = `
    <button class="with-pair" aria-controls="existing-id">Correct<button>
    <div id="existing-id"></div>
    <button class="no-target" aria-controls="non-existant-id">Correct<button>
    <div class="no-controller" id="no-matching-controller"></div>
  `;

  const validController = document.querySelector('.with-pair');
  const validTarget = document.getElementById('existing-id');

  const hasNoTarget = document.querySelector('.no-target');
  const hasNoController = document.querySelector('.no-controller');

  it('Given a valid controller, should return a matching pair of elements', () => {
    const actual = getElementPair(validController);

    expect(actual).toEqual({
      controller: validController,
      target: validTarget,
    });
  });

  it('Given a valid target, should return a matching pair of elements', () => {
    const actual = getElementPair(validTarget);

    expect(actual).toEqual({
      controller: validController,
      target: validTarget,
    });
  });

  it('Invalid: Controller has no target', () => {
    expect(() => getElementPair(hasNoTarget)).toThrow();
  });

  it('Invalid: Target has no controller', () => {
    expect(() => getElementPair(hasNoController)).toThrow();
  });
});
