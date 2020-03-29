import Menu from 'root/src/Menu';
import { ariaDescribedbyElementsFound } from './ariaDescribedbyElementsFound';

describe('Document contains aria-describedby elements', () => {
  // Set up our document body
  document.body.innerHTML = `
    <div id="ac-describe-submenu-help"></div>
    <div id="ac-describe-esc-help"></div>
    <div id="ac-describe-submenu-explore"></div>
    <div id="ac-describe-submenu-back"></div>
    <div id="ac-describe-top-level-help"></div>
  `;

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

