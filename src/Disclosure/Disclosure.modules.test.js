/* eslint-disable max-len */
import user from '@/.jest/user';
import Disclosure, {
  ComponentConnector,
  ManageTabIndex,
  UseButtonRole,
  UseHiddenAttribute,
} from '.';

// Set up our document body
document.body.innerHTML = `
  <a href="#" aria-controls="answer">What is Lorem Ipsum?</a>
  <a href="/why-is-this-here" tabindex="0"></a>
  <div id="answer">
    <a class="first-child" href="example.com"></a>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <a class="last-child" href="example.com"></a>
  </div>
`;

const controller = document.querySelector('[aria-controls="answer"]');
const target = document.querySelector('#answer');

const targetFirstChild = document.querySelector('.first-child');
let disclosure;

beforeEach(() => {
  disclosure = new Disclosure(
    controller,
    {
      modules: [
        ComponentConnector,
        ManageTabIndex,
        UseButtonRole,
        UseHiddenAttribute,
      ],
    }
  );
});

test('ComponentConnector: Connect disconnected controller-target pair', async () => {
  disclosure.expanded = true;

  // Verify initial state.
  expect(disclosure.expanded).toBe(true);
  expect(controller.getAttribute('aria-owns')).toEqual(target.id);

  controller.focus();
  await user.keyboard('{Tab}');
  expect(document.activeElement).toEqual(targetFirstChild);

  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(document.activeElement).toEqual(controller);

  disclosure.destroy();
  expect(controller.getAttribute('aria-owns')).toBeNull();
});

test('ManageTabIndex: Manage target element tabindex', () => {
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  disclosure.expanded = true;
  expect(disclosure.expanded).toBe(true);

  // All should be allowed.
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });

  disclosure.expanded = false;
  expect(disclosure.expanded).toBe(false);

  // All should be disallowed.
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  disclosure.destroy();
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });
});

describe('UseButtonRole', () => {
  beforeEach(() => {
    disclosure.expanded = false;
  });

  test('Should use the button role on the controller', () => {
    expect(controller.getAttribute('role')).toBe('button');
    expect(controller.getAttribute('tabindex')).not.toBe('0');
  });

  test('The Return key and Spacebar activate the Disclosure target', async () => {
    // Ensure the disclosure is closed.
    expect(disclosure.expanded).toBe(false);

    // Enter.
    await user.keyboard('{Enter}');
    expect(disclosure.expanded).toBe(true);

    // Spacebar.
    await user.keyboard('{ }');
    expect(disclosure.expanded).toBe(false);
  });

  // @todo
  test.skip('Module cleanup runs', () => {
    disclosure.destroy();
    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();
  });
});

test('UseHiddenAttribute: Uses hidden attribute when target not expanded', () => {
  disclosure.expanded = false;
  expect(disclosure.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  disclosure.expanded = true;
  expect(disclosure.expanded).toBe(true);
  expect(target.getAttribute('hidden')).toBeNull();

  disclosure.expanded = false;
  expect(disclosure.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  disclosure.destroy();
  expect(target.getAttribute('hidden')).toBeNull();
});
