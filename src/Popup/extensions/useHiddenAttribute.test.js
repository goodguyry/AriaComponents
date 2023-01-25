/* eslint-disable max-len */
import Popup from '..';
import { UseHiddenAttribute } from '.';
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
const target = document.querySelector('.wrapper');

const popup = new Popup(controller, { extensions: UseHiddenAttribute });
popup.init();

test('The hidden attribute is added and removed after state changes', () => {
  expect(popup.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  popup.expanded = true;
  expect(popup.expanded).toBe(true);
  expect(target.getAttribute('hidden')).toBeNull();

  popup.expanded = false;
  expect(popup.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  popup.destroy();
  expect(target.getAttribute('hidden')).toBeNull();
});
