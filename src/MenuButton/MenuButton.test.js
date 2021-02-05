/* eslint-disable max-len */
import { MenuButton, Popup, Menu } from 'root';
import { events } from '../lib/events';

const {
  click,
  keydownEsc,
  keydownTab,
  keydownShiftTab,
  keydownReturn,
  keydownSpace,
  keydownUp,
  keydownDown,
} = events;

const menuButtonMarkup = `
  <button target="dropdown">Open</button>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>
`;

// Set up our document body
document.body.innerHTML = menuButtonMarkup;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');
const list = document.querySelector('ul');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

const menuButton = new MenuButton(
  controller,
  {
    list,
    onStateChange,
    onInit,
    onDestroy,
  }
);

describe('MenuButton adds and manipulates DOM element attributes', () => {
  it('Should be instantiated as expected', () => {
    expect(menuButton).toBeInstanceOf(MenuButton);
    expect(menuButton.toString()).toEqual('[object MenuButton]');

    expect(controller.popup).toBeInstanceOf(Popup);
    expect(target.popup).toBeInstanceOf(Popup);
    expect(list.menu).toBeInstanceOf(Menu);

    expect(menuButton.getState().expanded).toBeFalsy();

    expect(onInit).toHaveBeenCalled();
  });

  it('Should add the correct attributes to the menuButton controller', () => {
    expect(controller.getAttribute('aria-haspopup')).toEqual('menu');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(controller.getAttribute('aria-controls')).toEqual('dropdown');

    // Button controller should not get button role
    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();

    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  it('Should add the correct attributes to the menuButton target', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
    expect(target.getAttribute('hidden')).toEqual('');
  });

  it('Should run class methods and subscriber functions', () => {
    menuButton.show();
    expect(onStateChange).toHaveBeenCalled();

    menuButton.hide();
    expect(onStateChange).toHaveBeenCalled();
  });
});

describe('MenuButton correctly responds to events', () => {
  // Ensure the menuButton is open before all tests.
  beforeEach(() => {
    menuButton.show();
  });

  it('Should close the menuButton when the ESC key is pressed',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownEsc);
      expect(menuButton.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should move focus to the first menu item with Return key from controller',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownReturn);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  it('Should move focus to the first menu item with Spacebar from controller',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownSpace);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  it('Should move focus to the first menu item with down arrow from controller',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownDown);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  it('Should move focus to the last menu item with up arrow from controller',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownUp);
      expect(document.activeElement)
        .toEqual(domLastChild);
    });

  it('Should move focus to the first menu child on TAB from controller',
    () => {
      controller.dispatchEvent(keydownTab);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  it('Should close the menuButton and focus the controller when the ESC key is pressed',
    () => {
      target.dispatchEvent(keydownEsc);
      expect(menuButton.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the menuButton when tabbing from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownTab);
      expect(menuButton.getState().expanded).toBeFalsy();
    });

  it('Should focus the controller when tabbing back from the first child',
    () => {
      domFirstChild.focus();
      target.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the menuButton when an outside element it clicked',
    () => {
      document.body.dispatchEvent(click);
      expect(menuButton.getState().expanded).toBeFalsy();
    });
});

it('Should destroy the menuButton as expected', () => {
  menuButton.destroy();

  expect(controller.getAttribute('aria-haspopup')).toBeNull();
  expect(controller.getAttribute('aria-expanded')).toBeNull();
  expect(controller.getAttribute('aria-controls')).toBeNull();
  expect(target.getAttribute('aria-hidden')).toBeNull();
  expect(target.getAttribute('hidden')).toBeNull();

  expect(controller.menuButton).toBeUndefined();
  expect(target.menuButton).toBeUndefined();

  controller.dispatchEvent(click);
  expect(menuButton.getState().expanded).toBeFalsy();

  expect(onDestroy).toHaveBeenCalled();

  // Quick and dirty verification that the original markup is restored.
  expect(document.body.innerHTML).toEqual(menuButtonMarkup);
});
