/* eslint-disable max-len */
import { Disclosure } from 'root';
import { events } from '../lib/events';

const {
  click,
  keydownReturn,
  keydownSpace,
} = events;

// Set up our document body
document.body.innerHTML = `
  <dl>
    <dt class="question">
      <button class="button">What is Lorem Ipsum?</button>
    </dt>
    <dd class="answer">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </dd>
  </dl>
`;

const controller = document.querySelector('.button');
const target = document.querySelector('.answer');

let disclosure;

describe('Disclosure with default configuration', () => {
  beforeEach(() => {
    disclosure = new Disclosure({ controller, target });
  });

  describe('Disclosure adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(disclosure).toBeInstanceOf(Disclosure);

      expect(disclosure.getState().expanded).toBeFalsy();

      expect(controller.disclosure).toBeInstanceOf(Disclosure);
      expect(target.disclosure).toBeInstanceOf(Disclosure);
    });

    it('Should add the correct attributes to the disclosure controller',
      () => {
        expect(controller.getAttribute('aria-expanded')).toEqual('false');
        expect(controller.getAttribute('aria-controls')).toEqual(target.id);
        expect(controller.getAttribute('tabindex')).toBeNull();
        expect(controller.getAttribute('aria-owns')).toEqual(target.id);
      });

    it('Should add the correct attributes to the disclosure target',
      () => {
        expect(target.getAttribute('aria-hidden')).toEqual('true');
      });
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
      disclosure.setState({ expanded: true });
      // Should close on outside click.
      document.body.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
    });

    it('Should update attributes when Return or Spacebar are pressed', () => {
      // Ensure the disclosure is closed.
      disclosure.setState({ expanded: false });

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

  it('Should remove all DOM attributes when destroyed', () => {
    disclosure.destroy();

    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();
    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-owns')).toBeNull();

    expect(target.getAttribute('aria-hidden')).toBeNull();

    expect(disclosure.controller.disclosure).toBeUndefined();
    expect(disclosure.target.disclosure).toBeUndefined();
  });
});

describe('Disclosure with non-default configuration', () => {
  // Mock functions.
  const onStateChange = jest.fn();
  const onInit = jest.fn();
  const onDestroy = jest.fn();

  beforeEach(() => {
    disclosure = new Disclosure({
      controller,
      target,
      loadOpen: true,
      allowOutsideClick: false,
      onStateChange,
      onInit,
      onDestroy,
    });
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

  it('Should run class methods and subscriber functions', () => {
    expect(onInit).toHaveBeenCalled();

    disclosure.open();
    expect(disclosure.getState().expanded).toBeTruthy();
    expect(onStateChange).toHaveBeenCalled();

    disclosure.close();
    expect(disclosure.getState().expanded).toBeFalsy();
    expect(onStateChange).toHaveBeenCalled();

    disclosure.destroy();
    expect(disclosure.controller.disclosure).toBeUndefined();
    expect(disclosure.target.disclosure).toBeUndefined();
    expect(onDestroy).toHaveBeenCalled();
  });
});
