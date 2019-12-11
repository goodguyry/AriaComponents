import Menu from 'root/src/Menu';
import {
  ariaDescribedbyElementsFound,
} from './ariaDescribedbyElementsFound';
import ariaDescribedbyTestMarkup from '../Menu/Menu.test';

describe('Document contains aria-describedby elements', () => {
  // Set up our document body
  document.body.innerHTML = ariaDescribedbyTestMarkup;

  it('Should return `true`', () => {
    expect(ariaDescribedbyElementsFound(Menu.getHelpIds())).toBeTruthy();
  });

  describe('Document does not contain all aria-describedby elements', () => {
    it('Should return `false`', () => {
      // Remove one of the elements.
      document.body.children[2].remove();

      expect(ariaDescribedbyElementsFound(Menu.getHelpIds())).toBeFalsy();
    });
  });
});

describe('Document does not contain aria-describedby elements', () => {
  it('Should return `false`', () => {
    // Set up our document body
    document.body.innerHTML = '';

    expect(ariaDescribedbyElementsFound(Menu.getHelpIds())).toBeFalsy();
  });
});

