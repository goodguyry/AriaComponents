/* eslint-disable max-len */
import Popup from '..';
import { ComponentConnector } from '.';
import { events } from '../../../.jest/events';

const { keydownTab, keydownShiftTab } = events;

// Set up our document body
document.body.innerHTML = `
  <a aria-controls="dropdown" href="#dropdown" class="link">Open</a>
  <span>Break up DOM</span>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>
`;

const controller = document.querySelector('.link');
const target = document.querySelector('.wrapper');

const popup = new Popup(controller, { modules: ComponentConnector });
popup.init();

const targetFirstChild = document.querySelector('.first-child');

test('Keyboard support for disconnected markup', () => {
  expect(controller.getAttribute('aria-owns')).toEqual(target.id);

  popup.expanded = true;
  expect(popup.expanded).toBe(true);

  controller.focus();
  controller.dispatchEvent(keydownTab);
  expect(document.activeElement).toEqual(targetFirstChild);

  target.dispatchEvent(keydownShiftTab);
  expect(document.activeElement).toEqual(controller);

  popup.destroy();
  expect(controller.getAttribute('aria-owns')).toBeNull();
});
