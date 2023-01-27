/* eslint-disable max-len */
import Popup from '..';
import { UseButtonRole } from '.';
import { events } from '../../../.jest/events';

const { keydownEnter, keydownSpace } = events;

// Set up our document body
document.body.innerHTML = `
  <a aria-controls="dropdown" href="#dropdown" class="link">Open</a>
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
const popup = new Popup(controller, { modules: UseButtonRole });
popup.init();

test('Should use the button role on the controller', () => {
  expect(controller.getAttribute('role')).toBe('button');
  expect(controller.getAttribute('tabindex')).not.toBe('0');
});

test('The Return key and Spacebar activate the Popup target', () => {
  // Ensure the Popup is closed.
  expect(popup.expanded).toBe(false);

  // Enter.
  controller.dispatchEvent(keydownEnter);
  expect(popup.expanded).toBe(true);

  // Spacebar.
  controller.dispatchEvent(keydownSpace);
  expect(popup.expanded).toBe(false);
});
