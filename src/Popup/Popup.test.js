/* eslint-disable max-len */
import { Popup } from '../..';
import { events } from '../../.jest/events';

const {
  click,
  keydownEscape,
  keydownTab,
  keydownShiftTab,
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
    expect(popup.expanded).toBe(false);
  });

  test('The Popup controller includes the expected attribute values', () => {
    expect(controller.getAttribute('aria-haspopup')).toEqual('true');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');

    // The test markup isn't detatched, so this doesn't apply.
    // @todo Not so sure about that, bud.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  test('The Popup target includes the expected attribute values', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Expanded state changes update properties and attributes as expected', () => {
    popup.expanded = true;
    expect(popup.expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.expanded).toBe(true);
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  test('Hidden state changes update properties and attributes as expected', () => {
    popup.expanded = false;
    expect(popup.expanded).toBe(false);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.expanded).toBe(false);
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  test('Click events on the Popup controller updates atttributes as expected', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(popup.expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // Click again to close.
    controller.dispatchEvent(click);
    expect(popup.expanded).toBe(false);
    expect(onStateChange).toHaveBeenCalledTimes(4);
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });
});

describe('Popup correctly responds to events', () => {
  // Ensure the popup is open before all tests.
  beforeEach(() => {
    popup.expanded = true;
  });

  test('The Disclosure closes when the Escape key is pressed', () => {
    controller.focus();
    controller.dispatchEvent(keydownEscape);
    expect(popup.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
  });

  test('Should move focus to the first popup child on Tab from controller', () => {
    controller.dispatchEvent(keydownTab);
    expect(document.activeElement).toEqual(domFirstChild);
  });

  // eslint-disable-next-line max-len
  test(
    'The Disclosure closes and focus is moved to the controller when the Escape key is pressed',
    () => {
      target.dispatchEvent(keydownEscape);
      expect(popup.expanded).toBe(false);
      expect(document.activeElement).toEqual(controller);
    }
  );

  test('The Disclosure closes when Tabbing from the last child', () => {
    domLastChild.focus();
    target.dispatchEvent(keydownTab);
    expect(popup.expanded).toBe(false);
  });

  test('The Disclosure remains open when tabbing back from the last child', () => {
    domLastChild.focus();
    target.dispatchEvent(keydownShiftTab);
    expect(popup.expanded).toBe(true);
  });

  test('Focus moves to the controller when tabbing back from the first child', () => {
    domFirstChild.focus();
    target.dispatchEvent(keydownShiftTab);
    expect(document.activeElement).toEqual(controller);
  });

  test('The Disclosure closes when an external element is clicked', () => {
    document.body.dispatchEvent(click);

    expect(popup.expanded).toBe(false);
  });

  test('All attributes are removed from elements managed by the Disclosure', () => {
    popup.destroy();

    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('aria-haspopup')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual('dropdown');
    expect(controller.getAttribute('aria-owns')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toBeNull();

    expect(controller.popup).toBeUndefined();
    expect(target.popup).toBeUndefined();

    controller.dispatchEvent(click);
    expect(popup.expanded).toBe(false);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(popupMarkup);
  });
});
