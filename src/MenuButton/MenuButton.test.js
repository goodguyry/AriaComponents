import { MenuButton, Popup, Menu } from 'root';
import { events } from 'root/utils/events';
import ariaDescribedbyTestMarkup from '../Menu/Menu.test';

const {
  click,
  keydownEsc,
  keydownTab,
  keydownShiftTab,
} = events;

// Set up our document body
document.body.innerHTML = `
  <button>Open</button>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>

  ${ariaDescribedbyTestMarkup}
`;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');
const menu = document.querySelector('ul');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

const menuButton = new MenuButton({
  controller,
  target,
  menu,
  onStateChange,
  onInit,
  onDestroy,
});

describe('MenuButton adds and manipulates DOM element attributes', () => {
  it('Should be instantiated as expected', () => {
    expect(menuButton).toBeInstanceOf(MenuButton);

    expect(controller.popup).toBeInstanceOf(Popup);
    expect(target.popup).toBeInstanceOf(Popup);
    expect(menu.menu).toBeInstanceOf(Menu);

    expect(menuButton.popup.getState().expanded).toBeFalsy();

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
  });

  it('Should run class methods and subscriber functions', () => {
    menuButton.show();
    expect(onStateChange).toHaveBeenCalled();

    menuButton.hide();
    expect(onStateChange).toHaveBeenCalled();
  });
});

describe('MenuButton correctly responds to events', () => {
  // Enter, Space: Opens the menu and places focus on the first menu item.
  // Down Arrow: opens the menu and moves focus to the first menu item
  // Up Arrow: opens the menu and moves focus to the last menu item.

  // Ensure the menuButton is open before all tests.
  beforeEach(() => {
    menuButton.setState({ expanded: true });
  });

  it('Should close the menuButton when the ESC key is pressed',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownEsc);
      expect(menuButton.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  // eslint-disable-next-line max-len
  it.skip('Should move focus to the first menuButton child on TAB from controller',
    () => {
      controller.dispatchEvent(keydownTab);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  // eslint-disable-next-line max-len
  it('Should close the menuButton and focus the controller when the ESC key is pressed',
    () => {
      target.dispatchEvent(keydownEsc);
      expect(menuButton.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the menuButton when tabbing from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownTab);
      expect(menuButton.popup.getState().expanded).toBeFalsy();
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
      expect(menuButton.popup.getState().expanded).toBeFalsy();
    });
});

it('Should destroy the menuButton as expected', () => {
  menuButton.destroy();

  expect(controller.getAttribute('aria-haspopup')).toBeNull();
  expect(controller.getAttribute('aria-expanded')).toBeNull();
  expect(controller.getAttribute('aria-controls')).toBeNull();
  expect(target.getAttribute('aria-hidden')).toBeNull();

  expect(controller.menuButton).toBeUndefined();
  expect(target.menuButton).toBeUndefined();

  controller.dispatchEvent(click);
  expect(menuButton.popup.getState().expanded).toBeFalsy();

  expect(onDestroy).toHaveBeenCalled();
});
