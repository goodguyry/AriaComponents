/* eslint-disable max-len */
import { Disclosure } from '../..';
import { events } from '../lib/events';

const {
  click,
  keydownReturn,
  keydownSpace,
} = events;

const disclosureMarkup = `
  <dl>
    <dt>
      <button aria-controls="answer">What is Lorem Ipsum?</button>
    </dt>
    <dd id="answer">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </dd>
  </dl>
`;

// Set up our document body
document.body.innerHTML = disclosureMarkup;

const controller = document.querySelector('button');
const target = document.querySelector('#answer');

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
        expect(target.getAttribute('hidden')).toEqual('');
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
      expect(target.getAttribute('hidden')).toBeNull();

      // Click again to close.
      controller.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');

      // Re-open the disclosure.
      disclosure.open();
      // Should allow outside click.
      document.body.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
      expect(target.getAttribute('hidden')).toBeNull();
    });

    it('Should update attributes when Return or Spacebar are pressed', () => {
      // Ensure the disclosure is closed.
      disclosure.close();

      // Return to open.
      controller.dispatchEvent(keydownReturn);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
      expect(target.getAttribute('hidden')).toBeNull();

      // Spacebar to close.
      controller.dispatchEvent(keydownSpace);
      expect(disclosure.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');
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
    expect(target.getAttribute('hidden')).toBeNull();

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
        useHiddenAttribute: false,
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

  it('Should not manage the target element\'s `hidden` attribute', () => {
    disclosure.open();
    expect(disclosure.target.getAttribute('hidden')).toBeNull();

    disclosure.close();
    expect(disclosure.target.getAttribute('hidden')).toBeNull();

    /**
     * Add the `hidden` attribute, then test that it isn't removed since we've
     * set `useHiddenAttribute` to `false`.
     */
    disclosure.target.setAttribute('hidden', 'hidden-test');

    disclosure.destroy();
    expect(disclosure.target.getAttribute('hidden')).toEqual('hidden-test');
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
