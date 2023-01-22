/* eslint-disable max-len */
import Dialog from '..';
import { UseButtonRole } from '.';
import { events } from '../../../.jest/events';

const { keydownEnter, keydownSpace } = events;

// Set up our document body
document.body.innerHTML = `
  <main>
    <article>
      <h1>The Article Title</h1>
      <a href="#" class="outside-link">Link</a>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.</p>
      <a aria-controls="dialog" class="link" href="#dialog">Open dialog</a>
    </article>
  </main>
  <footer class="site-footer">Site footer</footer>
  <div class="wrapper" id="dialog" tabindex="0">
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-item" href="example.com"></a></li>
    </ul>
  </div>
`;

const controller = document.querySelector('[aria-controls="dialog"]');

const dialog = new Dialog(controller, { extensions: [UseButtonRole] });

beforeEach(() => {
  dialog.expanded = false;
});

test('Should use the button role on the controller', () => {
  expect(controller.getAttribute('role')).toBe('button');
  expect(controller.getAttribute('tabindex')).not.toBe('0');
});

test('The Return key and Spacebar activate the Dialog target', () => {
  // Ensure the Dialog is closed.
  expect(dialog.expanded).toBe(false);

  // Enter.
  controller.dispatchEvent(keydownEnter);
  expect(dialog.expanded).toBe(true);

  // Spacebar.
  controller.dispatchEvent(keydownSpace);
  expect(dialog.expanded).toBe(true);
});
