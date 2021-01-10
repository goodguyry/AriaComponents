/* eslint-disable max-len */
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

const popupMarkup = `
  <a href="#dropdown" class="link">Open</a>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a class="move" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>
`;

// Set up our document body
document.body.innerHTML = popupMarkup;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');
const domMoveChild = document.querySelector('.move');
const domList = document.querySelector('ul');

// Test uses link as controller, which is handled a bit differently than a button.
const controller = document.querySelector('.link');
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

    expect(popup.firstInteractiveChild).toEqual(domFirstChild);
    expect(popup.lastInteractiveChild).toEqual(domLastChild);

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

    // Link controller should get button role.
    expect(controller.getAttribute('role')).toEqual('button');
    expect(controller.getAttribute('tabindex')).toEqual('0');

    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  it('Should add the correct attributes to the popup target', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
    expect(target.getAttribute('hidden')).toEqual('');
  });

  it('Should update attributes when the controller is clicked', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeTruthy();
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');
    expect(target.getAttribute('hidden')).toBeNull();

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toBeNull();
    });

    // Click again to close.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');
    expect(target.getAttribute('hidden')).toEqual('');

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
    popup.show();
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
      expect(document.activeElement).toEqual(domFirstChild);
    });

  it('Should update Popup state with keyboard', () => {
    // Toggle popup
    controller.dispatchEvent(keydownSpace);
    expect(popup.getState().expanded).toBeFalsy();

    // Toggle popup
    controller.dispatchEvent(keydownReturn);
    expect(popup.getState().expanded).toBeTruthy();
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

  it('Should update interactive child elements',
    () => {
      // Move the second item to the first positon.
      domList.insertBefore(
        domMoveChild,
        domList.firstElementChild
      );

      popup.setInteractiveChildren();

      expect(popup.firstInteractiveChild).toEqual(domMoveChild);

      // Move it to the end.
      domList.append(domMoveChild);

      popup.setInteractiveChildren();

      expect(popup.lastInteractiveChild).toEqual(domMoveChild);

      // Move it back before someone notices!
      domList.insertBefore(
        domMoveChild,
        domList.firstElementChild.nextElementSibling
      );

      popup.setInteractiveChildren();

      expect(popup.firstInteractiveChild).toEqual(domFirstChild);
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

describe('Popup destroy', () => {
  it('Should destroy the popup as expected', () => {
    popup.destroy();

    if ('BUTTON' !== controller.nodeName && null === controller.getAttribute('role')) {
      expect(controller.getAttribute('role')).toBeNull();
      expect(controller.getAttribute('tabindex')).toBeNull();
    }
    expect(controller.getAttribute('aria-haspopup')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toBeNull();
    expect(controller.getAttribute('aria-owns')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(target.getAttribute('hidden')).toBeNull();

    expect(controller.popup).toBeUndefined();
    expect(target.popup).toBeUndefined();

    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();

    expect(onDestroy).toHaveBeenCalled();

    // Quick and dirty verification that the original markup is restored.
    // https://jestjs.io/docs/en/expect.html#expectextendmatchers
    // />([\n\r\t\s]+)</
    // expect(document.body.innerHTML).toEqual(popupMarkup);
  });
});
