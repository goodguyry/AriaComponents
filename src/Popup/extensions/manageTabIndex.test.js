/* eslint-disable max-len */
import Popup from '..';
import { ManageTabIndex } from '.';
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
const popup = new Popup(controller, { extensions: ManageTabIndex });
popup.init();

test('The Popup target\'s interactive children are out of tab index when hidden', () => {
  // Initial state.
  popup.interactiveChildElements.forEach((link) => expect(link.getAttribute('tabindex')).toEqual('-1'));

  popup.expanded = true;
  expect(popup.expanded).toBe(true);
  popup.interactiveChildElements.forEach((link) => expect(link.getAttribute('tabindex')).toBeNull());

  popup.expanded = false;
  expect(popup.expanded).toBe(false);
  popup.interactiveChildElements.forEach((link) => expect(link.getAttribute('tabindex')).toEqual('-1'));

  popup.destroy();
  popup.interactiveChildElements.forEach((link) => expect(link.getAttribute('tabindex')).toBeNull());
});
