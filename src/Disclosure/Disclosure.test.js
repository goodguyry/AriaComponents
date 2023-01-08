/* eslint-disable max-len */
import { Disclosure } from '../..';
import { events } from '../lib/events';

const {
  click,
  keydownReturn,
  keydownSpace,
  keydownEsc,
  keydownTab,
  keydownShiftTab,
} = events;

const disclosureMarkup = `
  <dl>
    <dt>
      <button aria-controls="answer">What is Lorem Ipsum?</button>
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

const controller = document.querySelector('button');
const target = document.querySelector('#answer');

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

controller.addEventListener('stateChange', onStateChange);
controller.addEventListener('init', onInit);
controller.addEventListener('destroy', onDestroy);

let disclosure;

describe('Disclosure with default configuration', () => {
  beforeEach(() => {
    if (disclosure instanceof Disclosure) {
      disclosure.destroy();
    }

    disclosure = new Disclosure(controller);
  });

  describe('Disclosure adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(disclosure).toBeInstanceOf(Disclosure);
      expect(disclosure.toString()).toEqual('[object Disclosure]');

      expect(disclosure.getState().expanded).toBeFalsy();

      expect(controller.disclosure).toBeInstanceOf(Disclosure);
      expect(target.disclosure).toBeInstanceOf(Disclosure);

      expect(disclosure.firstInteractiveChild).toEqual(domFirstChild);
      expect(disclosure.lastInteractiveChild).toEqual(domLastChild);

      expect(onInit).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onInit);

        expect(detail.instance).toStrictEqual(disclosure);
      });
    });

    it(
      'Should add the correct attributes to the disclosure controller',
      () => {
        expect(controller.getAttribute('aria-expanded')).toEqual('false');
        expect(controller.getAttribute('tabindex')).toBeNull();
        expect(controller.getAttribute('aria-owns')).toEqual(target.id);
      }
    );

    it(
      'Should add the correct attributes to the disclosure target',
      () => {
        expect(target.getAttribute('aria-hidden')).toEqual('true');
      }
    );
  });

  describe('Disclosure correctly responds to events', () => {
    it('Should update attributes when the controller is clicked', () => {
      // Click to open.
      controller.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');

      // Click again to close.
      controller.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');

      // Re-open the disclosure.
      disclosure.open();
      // Should allow outside click.
      document.body.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
    });

    it('Should update attributes when Return or Spacebar are pressed', () => {
      // Ensure the disclosure is closed.
      disclosure.close();

      // Return to open.
      controller.dispatchEvent(keydownReturn);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');

      // Spacebar to close.
      controller.dispatchEvent(keydownSpace);
      expect(disclosure.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
    });
  });

  it('Should fire `stateChange` event on state change: open', () => {
    disclosure.open();
    expect(disclosure.getState().expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalled();

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: true });
      expect(detail.instance).toStrictEqual(disclosure);
    });
  });

  it('Should remove all DOM attributes when destroyed', () => {
    disclosure.destroy();

    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual(target.id);
    expect(controller.getAttribute('tabindex')).toBeNull();
    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-owns')).toBeNull();

    expect(target.getAttribute('aria-hidden')).toBeNull();

    expect(disclosure.controller.disclosure).toBeUndefined();
    expect(disclosure.target.disclosure).toBeUndefined();

    expect(onDestroy).toHaveBeenCalledTimes(7);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(disclosureMarkup);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onDestroy);

      expect(detail.element).toStrictEqual(controller);
      expect(detail.instance).toStrictEqual(disclosure);
    });
  });
});

describe('Disclosure with non-default configuration', () => {
  beforeEach(() => {
    if (disclosure instanceof Disclosure) {
      disclosure.destroy();
    }

    disclosure = new Disclosure(
      controller,
      {
        loadOpen: true,
        allowOutsideClick: false,
      }
    );
  });

  it('Should run class methods and subscriber functions', () => {
    disclosure.open();
    expect(disclosure.getState().expanded).toBeTruthy();
    expect(onStateChange).toHaveBeenCalled();

    disclosure.close();
    expect(disclosure.getState().expanded).toBeFalsy();
    expect(onStateChange).toHaveBeenCalled();

    disclosure.destroy();
    expect(disclosure.controller.disclosure).toBeUndefined();
    expect(disclosure.target.disclosure).toBeUndefined();
    expect(onDestroy).toHaveBeenCalledTimes(9);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(disclosureMarkup);
  });

  it('Should load open', () => {
    expect(disclosure.getState().expanded).toBeTruthy();
  });

  it('Should close the disclosure on outside click', () => {
    document.body.dispatchEvent(click);
    expect(disclosure.getState().expanded).toBeFalsy();
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });
});

describe('Disclosure supresses firing the `init` event', () => {
  const beCalled = jest.fn();
  const shouldNotBeCalled = jest.fn();
  controller.addEventListener('init', shouldNotBeCalled);
  controller.addEventListener('stateChange', beCalled);
  controller.addEventListener('destroy', shouldNotBeCalled);

  disclosure = new Disclosure(controller, { _stateDispatchesOnly: true });
  disclosure.open();
  disclosure.destroy();
  expect(beCalled).toHaveBeenCalledTimes(1);
  expect(shouldNotBeCalled).toHaveBeenCalledTimes(0);
});

describe('Disclosure with autoClose: true', () => {
  beforeEach(() => {
    if (disclosure instanceof Disclosure) {
      disclosure.destroy();
    }

    disclosure = new Disclosure(controller, { autoClose: true });
  });

  describe('Disclosure correctly responds to events', () => {
    // Ensure the Disclosure is open before all tests.
    beforeEach(() => {
      disclosure.open();
    });

    it(
      'Should close the Disclosure when the ESC key is pressed',
      () => {
        controller.focus();
        controller.dispatchEvent(keydownEsc);
        expect(disclosure.getState().expanded).toBeFalsy();
        expect(document.activeElement).toEqual(controller);
      }
    );

    it(
      'Should move focus to the first Disclosure child on TAB from controller',
      () => {
        controller.dispatchEvent(keydownTab);
        expect(document.activeElement)
          .toEqual(domFirstChild);
      }
    );

    it('Should update Disclosure state with keyboard', () => {
      // Toggle Disclosure
      controller.dispatchEvent(keydownSpace);
      expect(disclosure.getState().expanded).toBeFalsy();

      // Toggle Disclosure
      controller.dispatchEvent(keydownReturn);
      expect(disclosure.getState().expanded).toBeTruthy();
    });

    it(
      'Should close the Disclosure and focus the controller when the ESC key is pressed',
      () => {
        target.dispatchEvent(keydownEsc);
        expect(disclosure.getState().expanded).toBeFalsy();
        expect(document.activeElement).toEqual(controller);
      }
    );

    it(
      'Should close the Disclosure when tabbing from the last child',
      () => {
        domLastChild.focus();
        target.dispatchEvent(keydownTab);
        expect(disclosure.getState().expanded).toBeFalsy();
      }
    );

    it(
      'Should not close the Disclosure when tabbing back from the last child',
      () => {
        domLastChild.focus();
        target.dispatchEvent(keydownShiftTab);
        expect(disclosure.getState().expanded).toBeTruthy();
      }
    );

    it(
      'Should focus the controller when tabbing back from the first child',
      () => {
        domFirstChild.focus();
        target.dispatchEvent(keydownShiftTab);
        expect(document.activeElement).toEqual(controller);
      }
    );

    it.skip(
      'Should close the Disclosure when an outside element it clicked',
      () => {
        document.body.dispatchEvent(click);
        expect(disclosure.getState().expanded).toBeFalsy();
      }
    );
  });
});
