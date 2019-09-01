/* eslint-disable max-len */
import Listbox from '.';
import Popup from '../Popup';
import events from '../../utils/events';

const {
  click,
  keydownReturn,
  keydownEsc,
  keydownSpace,
  keydownUp,
  keydownDown,
  keydownHome,
  keydownEnd,
  keyUpUp,
  keyUpDown,
} = events;

// Set up our document body
document.body.innerHTML = `
  <button>Choose</button>
  <ul>
    <li>Anchorage</li>
    <li>Baltimore</li>
    <li>Chicago</li>
    <li>Dallas</li>
    <li>El Paso</li>
    <li>Fort Lauderdale</li>
    <li>Grand Rapids</li>
    <li>Hartford</li>
    <li>Idaho Falls</li>
  </ul>
`;

const controller = document.querySelector('button');
const target = document.querySelector('ul');
const listItems = Array.from(target.children);

let listbox = {};

function typeCharacter(character) {
  return new KeyboardEvent('keydown', { keyCode: character.charCodeAt(), bubbles: true });
}

describe('Listbox with default configuration', () => {
  beforeEach(() => {
    listbox = new Listbox({ target, controller });
  });

  describe('Listbox adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(listbox).toBeInstanceOf(Listbox);

      expect(listbox.getState().expanded).toBeFalsy();
      const [firstListItem] = listItems;
      expect(listbox.getState().activeDescendant).toEqual(firstListItem);

      expect(controller.popup).toBeInstanceOf(Popup);

      expect(controller.listbox).toBeInstanceOf(Listbox);
      expect(target.listbox).toBeInstanceOf(Listbox);
    });

    it('Should add the correct attributes', () => {
      expect(controller.getAttribute('aria-haspopup')).toEqual('listbox');
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      // expect(controller.getAttribute('aria-labelledby')).toEqual('location-label location-listbox-button');
      expect(controller.getAttribute('aria-activedescendant')).toBeNull();

      expect(target.getAttribute('role')).toEqual('listbox');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      // expect(target.getAttribute('aria-labelledby')).toEqual('label');
      expect(target.getAttribute('tabindex')).toEqual('-1');

      listItems.forEach((listItem) => {
        expect(listItem.id).not.toBeNull();
        expect(listItem.getAttribute('role')).toEqual('option');
      });
    });

    it('Should update Listbox attributes correctly when opened', () => {
      listbox.popup.show();
      expect(listbox.popup.getState().expanded).toBeTruthy();

      expect(controller.getAttribute('aria-expanded')).toEqual('true');

      expect(target.getAttribute('aria-hidden')).toEqual('false');
      expect(target.getAttribute('aria-activedescendant')).toEqual(target.children[0].id);
      expect(document.activeElement).toEqual(target);
    });
  });

  describe('Listbox controller should respond to events as expected', () => {
    beforeEach(() => {
      listbox.popup.hide();
      expect(listbox.popup.getState().expanded).toBeFalsy();
    });

    it('Should open the popup on controller DOWN arrow key', () => {
      controller.dispatchEvent(keyUpDown);
      expect(document.activeElement).toEqual(target);
      // @todo Why does this fail?!?!
      // expect(listbox.popup.getState().expanded).toBeTruthy();
    });

    it('Should open the popup on controller UP arrow key', () => {
      controller.dispatchEvent(keyUpUp);
      expect(document.activeElement).toEqual(target);
      // @todo Why does this fail?!?!
      // expect(listbox.popup.getState().expanded).toBeTruthy();
    });
  });

  describe('Listbox target should respond to events as expected', () => {
    beforeEach(() => {
      listbox.popup.show();
    });

    it('Should close the popup and focus the controller on RETURN key', () => {
      target.dispatchEvent(keydownReturn);
      expect(listbox.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should close the popup and focus the controller on ESC key', () => {
      target.dispatchEvent(keydownEsc);
      expect(listbox.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should close the popup and focus the controller on SPACE key', () => {
      target.dispatchEvent(keydownSpace);
      expect(listbox.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should set next element as activedescendant on target UP arrow key', () => {
      listbox.setState({ activeDescendant: target.children[3] });
      expect(target.children[3].getAttribute('aria-selected')).toEqual('true');

      target.dispatchEvent(keydownUp);

      expect(document.activeElement).toEqual(target);
      expect(target.children[3].getAttribute('aria-selected')).toBeNull();
      expect(listbox.getState().activeDescendant).toEqual(target.children[2]);
      expect(target.children[2].getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set previous element as activedescendant on target DOWN arrow key', () => {
      listbox.setState({ activeDescendant: target.children[4] });
      expect(target.children[4].getAttribute('aria-selected')).toEqual('true');

      target.dispatchEvent(keydownDown);

      expect(document.activeElement).toEqual(target);
      expect(target.children[4].getAttribute('aria-selected')).toBeNull();
      expect(listbox.getState().activeDescendant).toEqual(target.children[5]);
      expect(target.children[5].getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set first element as activedescendant on target HOME key', () => {
      target.dispatchEvent(keydownHome);

      expect(document.activeElement).toEqual(target);
      expect(listbox.getState().activeDescendant).toEqual(target.children[0]);
      expect(target.children[0].getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set last element as activedescendant on target END key', () => {
      const lastChild = target.children[target.children.length - 1];

      target.dispatchEvent(keydownEnd);

      expect(document.activeElement).toEqual(target);
      expect(listbox.getState().activeDescendant).toEqual(lastChild);
      expect(lastChild.getAttribute('aria-selected')).toEqual('true');
    });

    it('Should select the correct option by keyword search', () => {
      // Typing 'El Paso'
      const typeE = typeCharacter('e');
      const typeL = typeCharacter('l');

      // Typing 'Hartford'
      const typeH = typeCharacter('h');
      const typeA = typeCharacter('a');

      target.dispatchEvent(typeE);
      target.dispatchEvent(typeL);

      expect(listbox.getState().activeDescendant).toEqual(target.children[4]);
      expect(target.children[4].getAttribute('aria-selected')).toEqual('true');

      // Make sure the search string it cleared as expected.
      setTimeout(() => {
        target.dispatchEvent(typeH);
        target.dispatchEvent(typeA);

        expect(listbox.getState().activeDescendant).toEqual(target.children[7]);
        expect(target.children[7].getAttribute('aria-selected')).toEqual('true');
      }, 500);
    });

    it('Should select the clicked listbox item and close', () => {
      target.children[3].dispatchEvent(click);

      expect(listbox.popup.getState().expanded).toBeFalsy();
      expect(listbox.getState().activeDescendant).toEqual(target.children[3]);
      expect(document.activeElement).toEqual(controller);

      expect(controller.getAttribute('aria-activedescendant')).toBeNull();
      expect(controller.textContent).toEqual(target.children[3].textContent);
    });

    it('Should close on outside click', () => {
      listbox.setState({ activeDescendant: target.children[5] });

      document.body.dispatchEvent(click);

      expect(listbox.popup.getState().expanded).toBeFalsy();
      expect(listbox.getState().activeDescendant).toEqual(target.children[5]);
      // @todo Is this beyond the capabilities of JSDOM?
      // expect(document.activeElement).not.toEqual(controller);

      expect(controller.getAttribute('aria-activedescendant')).toBeNull();
      expect(controller.textContent).toEqual(target.children[5].textContent);
    });
  });
});
