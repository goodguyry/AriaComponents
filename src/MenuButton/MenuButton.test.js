/* eslint-disable max-len */
import { MenuButton, Menu } from 'root';
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

controller.addEventListener('stateChange', onStateChange);
controller.addEventListener('init', onInit);
controller.addEventListener('destroy', onDestroy);

const menuButton = new MenuButton(controller, { list });

describe('MenuButton adds and manipulates DOM element attributes', () => {
  it('Should be instantiated as expected', () => {
    expect(menuButton).toBeInstanceOf(MenuButton);
    expect(menuButton.toString()).toEqual('[object MenuButton]');

    expect(list.menu).toBeInstanceOf(Menu);

    expect(menuButton.getState().expanded).toBeFalsy();

    expect(onInit).toHaveBeenCalledTimes(1);
    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(menuButton);
    });
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
    expect(onStateChange).toHaveBeenCalledTimes(1);

    menuButton.hide();
    expect(onStateChange).toHaveBeenCalledTimes(2);
  });
});

it('Should fire `stateChange` event on state change: open', () => {
  menuButton.show();
  expect(menuButton.getState().expanded).toBe(true);
  expect(onStateChange).toHaveBeenCalledTimes(3);

  return Promise.resolve().then(() => {
    const { detail } = getEventDetails(onStateChange);

    expect(detail.props).toMatchObject(['expanded']);
    expect(detail.state).toStrictEqual({ expanded: true });
    expect(detail.instance).toStrictEqual(menuButton);
  });
});

it('Should fire `stateChange` event on state change: hidden', () => {
  menuButton.hide();
  expect(menuButton.getState().expanded).toBe(false);
  expect(onStateChange).toHaveBeenCalledTimes(4);

  return Promise.resolve().then(() => {
    const { detail } = getEventDetails(onStateChange);

    expect(detail.props).toMatchObject(['expanded']);
    expect(detail.state).toStrictEqual({ expanded: false });
    expect(detail.instance).toStrictEqual(menuButton);
  });
});

describe('MenuButton correctly responds to events', () => {
  it('Should close the menuButton when the ESC key is pressed',
    () => {
      menuButton.show();
      controller.focus();
      controller.dispatchEvent(keydownEsc);
      expect(menuButton.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should move focus to the first menu item with Return key from controller',
    () => {
      menuButton.hide();
      controller.focus();
      controller.dispatchEvent(keydownReturn);
      expect(menuButton.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(domFirstChild);
    });

  it('Should move focus to the first menu item with Spacebar from controller',
    () => {
      menuButton.hide();
      controller.focus();
      controller.dispatchEvent(keydownSpace);
      expect(menuButton.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(domFirstChild);
    });

  it('Should move focus to the first menu item with down arrow from controller',
    () => {
      menuButton.hide();
      controller.focus();
      controller.dispatchEvent(keydownDown);
      expect(menuButton.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(domFirstChild);
    });

  it('Should move focus to the last menu item with up arrow from controller',
    () => {
      menuButton.hide();
      controller.focus();
      controller.dispatchEvent(keydownUp);
      expect(menuButton.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(domLastChild);
    });

  it('Should move focus to the first menu child on TAB from controller',
    () => {
      menuButton.show();
      controller.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(domFirstChild);
    });

  it('Should close the menuButton and focus the controller when the ESC key is pressed',
    () => {
      menuButton.show();
      target.dispatchEvent(keydownEsc);
      expect(menuButton.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the menuButton when tabbing from the last child',
    () => {
      menuButton.show();
      domLastChild.focus();
      target.dispatchEvent(keydownTab);
      expect(menuButton.getState().expanded).toBeFalsy();
    });

  it('Should focus the controller when tabbing back from the first child',
    () => {
      menuButton.show();
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

  // Quick and dirty verification that the original markup is restored.
  expect(document.body.innerHTML).toEqual(menuButtonMarkup);

  expect(onDestroy).toHaveBeenCalledTimes(1);
  return Promise.resolve().then(() => {
    const { detail } = getEventDetails(onDestroy);

    expect(detail.element).toStrictEqual(controller);
  });
});
