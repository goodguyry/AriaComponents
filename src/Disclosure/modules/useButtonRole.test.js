/* eslint-disable max-len */
import Disclosure from '..';
import { UseButtonRole } from '.';
import { events } from '../../../.jest/events';

const { keydownEnter, keydownSpace } = events;

// Set up our document body
document.body.innerHTML = `
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

const controller = document.querySelector('[aria-controls="answer"]');
const disclosure = new Disclosure(controller, { modules: [UseButtonRole] });

beforeEach(() => {
  disclosure.expanded = false;
});

test('Should use the button role on the controller', () => {
  expect(controller.getAttribute('role')).toBe('button');
  expect(controller.getAttribute('tabindex')).not.toBe('0');
});

test('The Return key and Spacebar activate the Disclosure target', () => {
  // Ensure the disclosure is closed.
  expect(disclosure.expanded).toBe(false);

  // Enter.
  controller.dispatchEvent(keydownEnter);
  expect(disclosure.expanded).toBe(true);

  // Spacebar.
  controller.dispatchEvent(keydownSpace);
  expect(disclosure.expanded).toBe(false);
});
