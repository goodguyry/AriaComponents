/* eslint-disable max-len */
import { Listbox } from '../..';
import { events } from '../lib/events';

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

const listboxMarkup = `
  <button aria-controls="options">Choose</button>
  <ul id="options">
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

// Set up our document body
document.body.innerHTML = listboxMarkup;

const controller = document.querySelector('button');
const target = document.querySelector('ul');
const listItems = Array.from(target.children);

let listbox = {};

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

controller.addEventListener('stateChange', onStateChange);
controller.addEventListener('init', onInit);
controller.addEventListener('destroy', onDestroy);

describe('Listbox with default configuration', () => {
  beforeAll(() => {
    listbox = new Listbox(controller);
  });

  describe('Listbox adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(listbox).toBeInstanceOf(Listbox);
      expect(listbox.toString()).toEqual('[object Listbox]');

      expect(listbox.getState().expanded).toBeFalsy();
      const [firstListItem] = listItems;
      expect(listbox.getState().activeDescendant).toEqual(firstListItem);

      expect(controller.listbox).toBeInstanceOf(Listbox);
      expect(target.listbox).toBeInstanceOf(Listbox);

      expect(onInit).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onInit);

        expect(detail.instance).toStrictEqual(listbox);
      });
    });

    it('Should add the correct attributes', () => {
      expect(controller.getAttribute('aria-haspopup')).toEqual('listbox');
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      // expect(controller.getAttribute('aria-labelledby')).toEqual('location-label location-listbox-button');
      expect(controller.getAttribute('aria-activedescendant')).toBeNull();

      expect(target.getAttribute('role')).toEqual('listbox');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');
      // expect(target.getAttribute('aria-labelledby')).toEqual('label');
      expect(target.getAttribute('tabindex')).toEqual('-1');

      listItems.forEach((listItem) => {
        expect(listItem.id).not.toBeNull();
        expect(listItem.getAttribute('role')).toEqual('option');
      });
    });

    it('Should update Listbox attributes correctly when opened', () => {
      listbox.show();
      expect(listbox.getState().expanded).toBeTruthy();

      expect(controller.getAttribute('aria-expanded')).toEqual('true');

      expect(target.getAttribute('aria-hidden')).toEqual('false');
      expect(target.getAttribute('hidden')).toBeNull();
      expect(target.getAttribute('aria-activedescendant')).toEqual(target.children[0].id);
      expect(document.activeElement).toEqual(target);

      expect(onStateChange).toHaveBeenCalledTimes(1);
    });
  });

  it('Should fire `stateChange` event on state change: open', () => {
    listbox.show();
    expect(listbox.getState().expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({
        expanded: true,
        activeDescendant: target.children[0],
      });
      expect(detail.instance).toStrictEqual(listbox);
    });
  });

  it('Should fire `stateChange` event on state change: active descendant', () => {
    listbox.setState({ activeDescendant: target.children[3] });

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['activeDescendant']);
      expect(detail.state).toStrictEqual({
        expanded: true,
        activeDescendant: target.children[3],
      });
      expect(detail.instance).toStrictEqual(listbox);
    });
  });

  describe('Listbox controller should respond to events as expected', () => {
    beforeEach(() => {
      listbox.hide();
      expect(listbox.getState().expanded).toBeFalsy();
    });

    it('Should open the popup on controller DOWN arrow key', () => {
      controller.dispatchEvent(keyUpDown);
      expect(document.activeElement).toEqual(target);
      expect(listbox.getState().expanded).toBeTruthy();
    });

    it('Should open the popup on controller UP arrow key', () => {
      controller.dispatchEvent(keyUpUp);
      expect(document.activeElement).toEqual(target);
      expect(listbox.getState().expanded).toBeTruthy();
    });
  });

  describe('Listbox target should respond to events as expected', () => {
    beforeEach(() => {
      listbox.show();
    });

    it('Should close the popup and focus the controller on RETURN key', () => {
      target.dispatchEvent(keydownReturn);
      expect(listbox.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should close the popup and focus the controller on ESC key', () => {
      target.dispatchEvent(keydownEsc);
      expect(listbox.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should close the popup and focus the controller on SPACE key', () => {
      target.dispatchEvent(keydownSpace);
      expect(listbox.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

    it('Should set previous element as activedescendant on target UP arrow key', () => {
      listbox.setState({ activeDescendant: target.children[3] });
      expect(target.children[3].getAttribute('aria-selected')).toEqual('true');

      target.dispatchEvent(keydownUp);

      expect(document.activeElement).toEqual(target);
      expect(target.children[3].getAttribute('aria-selected')).toBeNull();
      expect(listbox.getState().activeDescendant).toEqual(target.children[2]);
      expect(target.children[2].getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set next element as activedescendant on target DOWN arrow key', () => {
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

    it('Should select the clicked listbox item and close', () => {
      target.children[3].dispatchEvent(click);

      expect(listbox.getState().expanded).toBeFalsy();
      expect(listbox.getState().activeDescendant).toEqual(target.children[3]);
      expect(document.activeElement).toEqual(controller);

      expect(controller.getAttribute('aria-activedescendant')).toBeNull();
      expect(controller.textContent).toEqual(target.children[3].textContent);
    });

    it('Should close on outside click', () => {
      listbox.setState({ activeDescendant: target.children[5] });

      document.body.dispatchEvent(click);

      expect(listbox.getState().expanded).toBeFalsy();
      expect(listbox.getState().activeDescendant).toEqual(target.children[5]);
      expect(document.activeElement).not.toEqual(target);

      expect(controller.getAttribute('aria-activedescendant')).toBeNull();
      expect(controller.textContent).toEqual(target.children[5].textContent);
    });
  });

  describe('Listbox destroy', () => {
    it('Should destroy the Listbox as expected', () => {
      listbox.destroy();

      expect(controller.getAttribute('aria-haspopup')).toBeNull();
      expect(controller.getAttribute('aria-expanded')).toBeNull();
      expect(controller.getAttribute('aria-controls')).toBeNull();
      expect(target.getAttribute('aria-activedescendant')).toBeNull();
      expect(target.getAttribute('aria-hidden')).toBeNull();
      expect(target.getAttribute('hidden')).toBeNull();

      listItems.forEach((item) => {
        expect(item.getAttribute('role')).toBeNull();
        expect(item.getAttribute('aria-selected')).toBeNull();
      });

      expect(controller.listbox).toBeUndefined();
      expect(target.listbox).toBeUndefined();

      controller.dispatchEvent(click);
      expect(listbox.getState().expanded).toBeFalsy();

      // Quick and dirty verification that the original markup is restored.
      // But first, restore the button's original text label.
      controller.textContent = 'Choose';
      expect(document.body.innerHTML).toEqual(listboxMarkup);

      expect(onDestroy).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onDestroy);

        expect(detail.element).toStrictEqual(controller);
        expect(detail.instance).toStrictEqual(listbox);
      });
    });
  });
});
