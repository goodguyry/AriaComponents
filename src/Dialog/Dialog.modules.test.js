/* eslint-disable max-len */
import user from '@/.jest/user';
import Dialog, {
  ManageTabIndex,
  UseButtonRole,
  UseHiddenAttribute,
} from '.';

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
const target = document.getElementById('dialog');

let dialog;
beforeEach(() => {
  dialog = new Dialog(
    controller,
    {
      modules: [
        ManageTabIndex,
        UseButtonRole,
        UseHiddenAttribute,
      ],
    }
  );
});

test('ManageTabIndex: Manage target element tabindex', () => {
  dialog.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  dialog.expanded = true;
  expect(dialog.expanded).toBe(true);
  dialog.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });

  dialog.expanded = false;
  expect(dialog.expanded).toBe(false);
  dialog.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  dialog.destroy();
  dialog.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });
});

describe('UseButtonRole', () => {
  beforeEach(() => {
    dialog.expanded = false;
  });

  test('Should use the button role on the controller', () => {
    expect(controller.getAttribute('role')).toBe('button');
    expect(controller.getAttribute('tabindex')).not.toBe('0');
  });

  test('The Return key and Spacebar activate the Dialog target', async () => {
    // Ensure the Dialog is closed.
    expect(dialog.expanded).toBe(false);

    // Enter.
    await user.keyboard('{Enter}');
    expect(dialog.expanded).toBe(true);

    // Spacebar.
    await user.keyboard('{ }');
    expect(dialog.expanded).toBe(true);
  });

  test.skip('Module cleanup runs', () => {
    dialog.destroy();
    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();
  });
});

test('UseHiddenAttribute: Uses hidden attribute when target not expanded', () => {
  expect(dialog.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  dialog.expanded = true;
  expect(dialog.expanded).toBe(true);
  expect(target.getAttribute('hidden')).toBeNull();

  dialog.expanded = false;
  expect(dialog.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  dialog.destroy();
  expect(target.getAttribute('hidden')).toBeNull();
});
