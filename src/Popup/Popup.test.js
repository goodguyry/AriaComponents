import { Popup } from 'root';
import { events } from '../lib/events';

const {
  click,
  keydownEsc,
  keydownTab,
  keydownShiftTab,
  keydownSpace,
  keydownReturn,
} = events;

// Set up our document body
document.body.innerHTML = `
  <a href="#dropdown" class="link">Open</a>
  <button>Open</button>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>
`;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

const link = document.querySelector('.link');
const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

const popup = new Popup({
  controller,
  target,
  onStateChange,
  onInit,
  onDestroy,
});

describe('Popup adds and manipulates DOM element attributes', () => {
  it('Should be instantiated as expected', () => {
    expect(popup).toBeInstanceOf(Popup);

    expect(popup.firstChild).toEqual(domFirstChild);
    expect(popup.lastChild).toEqual(domLastChild);

    expect(popup.getState().expanded).toBeFalsy();

    expect(controller.popup).toBeInstanceOf(Popup);
    expect(target.popup).toBeInstanceOf(Popup);

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });

    expect(onInit).toHaveBeenCalled();
  });

  it('Should add the correct attributes to the popup controller', () => {
    expect(controller.getAttribute('aria-haspopup')).toEqual('true');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(controller.getAttribute('aria-controls')).toEqual('dropdown');

    // Button controller should not get button role
    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();

    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  it('Should add the correct attributes to the popup target', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  it('Should update attributes when the controller is clicked', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeTruthy();
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toBeNull();
    });

    // Click again to close.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });
  });

  it('Should run class methods and subscriber functions', () => {
    popup.show();
    expect(onStateChange).toHaveBeenCalled();

    popup.hide();
    expect(onStateChange).toHaveBeenCalled();
  });
});

describe('Popup correctly responds to events', () => {
  // Ensure the popup is open before all tests.
  beforeEach(() => {
    popup.setState({ expanded: true });
  });

  it('Should close the popup when the ESC key is pressed',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownEsc);
      expect(popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should move focus to the first popup child on TAB from controller',
    () => {
      controller.dispatchEvent(keydownTab);
      expect(document.activeElement)
        .toEqual(domFirstChild);
    });

  // eslint-disable-next-line max-len
  it('Should close the popup and focus the controller when the ESC key is pressed',
    () => {
      target.dispatchEvent(keydownEsc);
      expect(popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the popup when tabbing from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownTab);
      expect(popup.getState().expanded).toBeFalsy();
    });

  it('Should not close the popup when tabbing back from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownShiftTab);
      expect(popup.getState().expanded).toBeTruthy();
    });

  it('Should focus the controller when tabbing back from the first child',
    () => {
      domFirstChild.focus();
      target.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(controller);
    });

  it('Should close the popup when an outside element it clicked',
    () => {
      document.body.dispatchEvent(click);
      expect(popup.getState().expanded).toBeFalsy();
    });
});

describe('Test button behaviors in non-button element controller', () => {
  const linkPopup = new Popup({
    controller: link,
    target,
    onStateChange,
    onInit,
    onDestroy,
  });

  it('Should add the correct attributes', () => {
    expect(link.getAttribute('role')).toEqual('button');
    expect(link.getAttribute('tabindex')).toEqual('0');
  });

  it('Should update Popup state with keyboard', () => {
    // Toggle popup
    link.dispatchEvent(keydownSpace);
    expect(linkPopup.getState().expanded).toBeTruthy();

    // Toggle popup
    link.dispatchEvent(keydownReturn);
    expect(linkPopup.getState().expanded).toBeFalsy();
  });
});

it('Should destroy the popup as expected', () => {
  popup.destroy();

  expect(controller.getAttribute('aria-haspopup')).toBeNull();
  expect(controller.getAttribute('aria-expanded')).toBeNull();
  expect(controller.getAttribute('aria-controls')).toBeNull();
  expect(target.getAttribute('aria-hidden')).toBeNull();

  expect(controller.popup).toBeUndefined();
  expect(target.popup).toBeUndefined();

  controller.dispatchEvent(click);
  expect(popup.getState().expanded).toBeFalsy();

  expect(onDestroy).toHaveBeenCalled();
});
