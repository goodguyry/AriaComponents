/* eslint-disable max-len */
import { Popup } from '../..';
import { events } from '../../.jest/events';

const {
  click,
  keydownEscape,
  keydownTab,
  keydownShiftTab,
  keydownSpace,
  keydownEnter,
} = events;

const popupMarkup = `
  <a aria-controls="dropdown" href="#dropdown" class="link">Open</a>
  <span>Break up DOM hierarchy</span>
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
document.body.innerHTML = popupMarkup;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

// Test uses link as controller, which is handled a bit differently than a button.
const controller = document.querySelector('.link');
const target = document.querySelector('.wrapper');

// Mock functions.
const onStateChange = jest.fn();

const popup = new Popup(controller);
popup.on('popup.stateChange', onStateChange);

// Popup has to be instanitated.
popup.init();

describe('The Popup should initialize as expected', () => {
  test('The Popup includes the expected property values', () => {
    expect(popup).toBeInstanceOf(Popup);
    expect(popup.toString()).toEqual('[object Popup]');

    expect(controller.id).toEqual(popup.id);

    expect(popup.firstInteractiveChild).toEqual(domFirstChild);
    expect(popup.lastInteractiveChild).toEqual(domLastChild);
  });

  test('The `init` event fires once', () => {
    expect(popup.getState().expanded).toBeFalsy();

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });
  });

  test('The Popup controller includes the expected attribute values', () => {
    expect(controller.getAttribute('aria-haspopup')).toEqual('true');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');

    // Link controller should get button role.
    expect(controller.getAttribute('role')).toEqual('button');

    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  test('The Popup target includes the expected attribute values', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Expanded state changes update properties and attributes as expected', () => {
    popup.show();
    expect(popup.getState().expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: true });
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  test('Hidden state changes update properties and attributes as expected', () => {
    popup.hide();
    expect(popup.getState().expanded).toBe(false);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: false });
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  test('Click events on the Popup controller updates atttributes as expected', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeTruthy();
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toBeNull();
    });

    // Click again to close.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();
    expect(onStateChange).toHaveBeenCalledTimes(4);
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });
  });
});

describe('Popup correctly responds to events', () => {
  // Ensure the popup is open before all tests.
  beforeEach(() => popup.show());

  test('The Disclosure closes when the Escape key is pressed', () => {
    controller.focus();
    controller.dispatchEvent(keydownEscape);
    expect(popup.getState().expanded).toBeFalsy();
    expect(document.activeElement).toEqual(controller);
  });

  test('Should move focus to the first popup child on Tab from controller', () => {
    controller.dispatchEvent(keydownTab);
    expect(document.activeElement).toEqual(domFirstChild);
  });

  test('Should update Popup state with keyboard', () => {
    // Toggle popup
    controller.dispatchEvent(keydownSpace);
    expect(popup.getState().expanded).toBeFalsy();

    // Toggle popup
    controller.dispatchEvent(keydownEnter);
    expect(popup.getState().expanded).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  test(
    'The Disclosure closes and focus is moved to the controller when the Escape key is pressed',
    () => {
      target.dispatchEvent(keydownEscape);
      expect(popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    }
  );

  test('The Disclosure closes when Tabbing from the last child', () => {
    domLastChild.focus();
    target.dispatchEvent(keydownTab);
    expect(popup.getState().expanded).toBeFalsy();
  });

  test('The Disclosure remains open when tabbing back from the last child', () => {
    domLastChild.focus();
    target.dispatchEvent(keydownShiftTab);
    expect(popup.getState().expanded).toBeTruthy();
  });

  test('Focus moves to the controller when tabbing back from the first child', () => {
    domFirstChild.focus();
    target.dispatchEvent(keydownShiftTab);
    expect(document.activeElement).toEqual(controller);
  });

  test('The Disclosure closes when an external element is clicked', () => {
    document.body.dispatchEvent(click);

    expect(popup.getState().expanded).toBeFalsy();
  });

  test('All attributes are removed from elements managed by the Disclosure', () => {
    popup.destroy();

    if ('BUTTON' !== controller.nodeName && null === controller.getAttribute('role')) {
      expect(controller.getAttribute('role')).toBeNull();
    }
    expect(controller.getAttribute('aria-haspopup')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual('dropdown');
    expect(controller.getAttribute('aria-owns')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toBeNull();

    expect(controller.popup).toBeUndefined();
    expect(target.popup).toBeUndefined();

    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(popupMarkup);
  });
});
