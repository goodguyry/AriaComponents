/* eslint-disable max-len, no-console */
import getElementPair from './getElementPair';

jest.spyOn(global.console, 'error').mockImplementation();

describe('Collects interactive child elements', () => {
  // Set up our document body
  document.body.innerHTML = `
    <button class="with-pair" aria-controls="existing-id">Correct<button>
    <div id="existing-id"></div>
    <button class="no-target" aria-controls="non-existant-id">Correct<button>
    <div class="no-controller" id="no-matching-controller"></div>
    <div class="no-attributes"></div>
  `;

  const validController = document.querySelector('.with-pair');
  const validTarget = document.getElementById('existing-id');

  const hasNoTarget = document.querySelector('.no-target');
  const hasNoController = document.querySelector('.no-controller');
  const hasNoAttributes = document.querySelector('.no-attributes');

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

  it('Error: Controller has no target', () => {
    expect(getElementPair(hasNoTarget)).toBeUndefined();
    expect(console.error).toBeCalledTimes(1);
  });

  it('Error: Target has no controller', () => {
    expect(getElementPair(hasNoController)).toBeUndefined();
    expect(console.error).toBeCalledTimes(2);
  });

  it('Error: Element has no required attributes', () => {
    expect(getElementPair(hasNoAttributes)).toBeUndefined();
    expect(console.error).toBeCalledTimes(3);
  });
});
