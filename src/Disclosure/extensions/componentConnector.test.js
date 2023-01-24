/* eslint-disable max-len */
import Disclosure from '..';
import { ComponentConnector } from '.';
import { events } from '../../../.jest/events';

const { keydownTab, keydownShiftTab } = events;

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
const target = document.querySelector('#answer');

const targetFirstChild = document.querySelector('.first-child');

const disclosure = new Disclosure(controller, { extensions: [ComponentConnector] });

test('Keyboard support for disconnected markup', () => {
  expect(controller.getAttribute('aria-owns')).toEqual(target.id);

  disclosure.expanded = true;
  expect(disclosure.expanded).toBe(true);

  controller.focus();
  controller.dispatchEvent(keydownTab);
  expect(document.activeElement).toEqual(targetFirstChild);

  target.dispatchEvent(keydownShiftTab);
  expect(document.activeElement).toEqual(controller);

  disclosure.destroy();
  expect(controller.getAttribute('aria-owns')).toBeNull();
});
