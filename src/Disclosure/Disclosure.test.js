/* eslint-disable max-len */
import { Disclosure } from '../..';
import { events } from '../../.jest/events';

const {
  click,
  keydownEnter,
  keydownSpace,
  keydownEscape,
  keydownTab,
  keydownShiftTab,
} = events;

const disclosureMarkup = `
  <dl>
    <dt>
      <a href="#" aria-controls="answer">What is Lorem Ipsum?</a>
    </dt>
    <dd id="answer">
      <a class="first-child" href="example.com"></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <a class="last-child" href="example.com"></a>
    </dd>
  </dl>
`;

// Set up our document body
document.body.innerHTML = disclosureMarkup;

const controller = document.querySelector('[aria-controls="answer"]');
const target = document.querySelector('#answer');

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

controller.addEventListener('disclosure.stateChange', onStateChange);
controller.addEventListener('disclosure.init', onInit);
controller.addEventListener('disclosure.destroy', onDestroy);

let disclosure = null;

beforeAll(() => {
  disclosure = new Disclosure(controller);
});

describe('The Disclosure should initialize as expected', () => {
  test('The Disclosure includes the expected property values', () => {
    expect(disclosure).toBeInstanceOf(Disclosure);
    expect(disclosure.toString()).toEqual('[object Disclosure]');

    expect(controller.id).toEqual(disclosure.id);

    expect(disclosure.expanded).toBe(false);
    expect(disclosure.lastInteractiveChild).toEqual(domLastChild);
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(disclosure);
    });
  });

  test('The Disclosure controller includes the expected attribute values', () => {
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(controller.getAttribute('tabindex')).toBeNull();
    expect(controller.getAttribute('aria-owns')).toEqual(target.id);
  });

  test('The Disclosure target includes the expected attribute values', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Click events on the Disclosure controller updates atttributes as expected', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    expect(disclosure.expanded).toBe(true);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // Should allow outside click.
    document.body.dispatchEvent(click);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    expect(disclosure.expanded).toBe(true);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // Click again to close.
    controller.dispatchEvent(click);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    expect(disclosure.expanded).toBe(false);
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.expanded).toBe(false);
      expect(detail.instance).toStrictEqual(disclosure);
    });
  });

  test('Focus moves to the first Disclosure child on Tab key from the controller', () => {
    disclosure.expanded = true;
    controller.dispatchEvent(keydownTab);

    expect(document.activeElement).toEqual(domFirstChild);
  });

  test('All attributes are removed from elements managed by the Disclosure', () => {
    disclosure.destroy();

    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual(target.id);
    expect(controller.getAttribute('tabindex')).toBeNull();
    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-owns')).toBeNull();

    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(onDestroy).toHaveBeenCalledTimes(1);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(disclosureMarkup);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onDestroy);

      expect(detail.element).toStrictEqual(controller);
      expect(detail.instance).toStrictEqual(disclosure);
    });
  });

  describe('Disclosure with `allowOutsideClick` disabled', () => {
    beforeAll(() => {
      disclosure = new Disclosure(controller);
      disclosure.allowOutsideClick = false;
    });

    test('The Disclosure closes when an external element is clicked', () => {
      document.body.dispatchEvent(click);

      expect(disclosure.expanded).toBe(false);
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
    });
  });

  describe('Disclosure with `autoClose` enabled', () => {
    beforeAll(() => {
      disclosure.autoClose = true;
      disclosure.allowOutsideClick = true; // Restore default.
    });

    // Open the disclosure prior to each test.
    beforeEach(() => {
      disclosure.expanded = true;
    });

    test('The Disclosure closes when the Escape key is pressed', () => {
      controller.focus();
      controller.dispatchEvent(keydownEscape);

      expect(disclosure.expanded).toBe(false);
      expect(document.activeElement).toEqual(controller);
    });

    test(
      'The Disclosure closes and focus is moved to the controller when the Escape key is pressed',
      () => {
        target.dispatchEvent(keydownEscape);

        expect(disclosure.expanded).toBe(false);
        expect(document.activeElement).toEqual(controller);
      }
    );

    test('The Disclosure closes when Tabbing from the last child', () => {
      domLastChild.focus();
      target.dispatchEvent(keydownTab);

      expect(disclosure.expanded).toBe(false);
    });

    test('The Disclosure remains open when tabbing back from the last child', () => {
      domLastChild.focus();
      target.dispatchEvent(keydownShiftTab);

      expect(disclosure.expanded).toBe(true);
    });

    test('Focus moves to the controller when tabbing back from the first child', () => {
      domFirstChild.focus();
      target.dispatchEvent(keydownShiftTab);

      expect(document.activeElement).toEqual(controller);
    });
  });
});

describe('Should accept static options', () => {
  beforeAll(() => {
    disclosure = new Disclosure(controller, { loadOpen: true });
  });

  it('Should load open', () => expect(disclosure.expanded).toBe(true));
});
