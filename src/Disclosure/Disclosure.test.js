/* eslint-disable max-len */
import user from '@/.jest/user';
import Disclosure from '.';

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

    const { detail } = getEventDetails(onInit);

    expect(detail.instance).toStrictEqual(disclosure);
  });

  test('The Disclosure controller includes the expected attribute values', () => {
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
  });

  test('The Disclosure target includes the expected attribute values', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Click events on the Disclosure controller updates atttributes as expected', async () => {
    // Click to open.
    await user.click(controller);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    expect(disclosure.expanded).toBe(true);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // Should allow outside click.
    await user.click(document.body);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    expect(disclosure.expanded).toBe(true);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // Click again to close.
    await user.click(controller);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    expect(disclosure.expanded).toBe(false);
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    const { detail } = getEventDetails(onStateChange);

    expect(detail.expanded).toBe(false);
    expect(detail.instance).toStrictEqual(disclosure);
  });

  test('All attributes are removed from elements managed by the Disclosure', () => {
    disclosure.destroy();

    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual(target.id);

    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(onDestroy).toHaveBeenCalledTimes(1);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(disclosureMarkup);

    const { detail } = getEventDetails(onDestroy);

    expect(detail.element).toStrictEqual(controller);
    expect(detail.instance).toStrictEqual(disclosure);
  });
});

describe('Should not overwrite existing attributes', () => {
  beforeAll(() => {
    controller.setAttribute('aria-expanded', 'true');
    target.setAttribute('aria-hidden', 'false');

    disclosure = new Disclosure(controller);
  });

  it('Should load open', () => expect(disclosure.expanded).toBe(true));
});
