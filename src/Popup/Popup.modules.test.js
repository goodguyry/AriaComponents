/* eslint-disable max-len */
import user from '@/.jest/user';
import Popup, {
  ComponentConnector,
  ManageTabIndex,
  UseButtonRole,
  UseHiddenAttribute,
} from '.';

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

let popup;
beforeEach(() => {
  popup = new Popup(
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

  popup.init();
});

const targetFirstChild = document.querySelector('.first-child');

test('ComponentConnector: Connect disconnected controller-target pair', async () => {
  expect(controller.getAttribute('aria-owns')).toEqual(target.id);

  popup.expanded = true;
  expect(popup.expanded).toBe(true);

  controller.focus();

  await user.keyboard('{Tab}');
  expect(document.activeElement).toEqual(targetFirstChild);

  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(document.activeElement).toEqual(controller);

  popup.destroy();
  expect(controller.getAttribute('aria-owns')).toBeNull();
});

test('ManageTabIndex: Manage target element tabindex', () => {
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

describe('UseButtonRole', () => {
  test('Should use the button role on the controller', () => {
    expect(controller.getAttribute('role')).toBe('button');
    expect(controller.getAttribute('tabindex')).not.toBe('0');
  });

  test('The Return key and Spacebar activate the Popup target', async () => {
    // Ensure the Popup is closed.
    expect(popup.expanded).toBe(false);

    // Enter.
    await user.keyboard('{Enter}');
    expect(popup.expanded).toBe(true);

    // Spacebar.
    await user.keyboard('{ }');
    expect(popup.expanded).toBe(false);
  });

  // @todo Clean these up!
  test.skip('Module cleanup runs', () => {
    popup.destroy();
    expect(controller.getAttribute('role')).toBeNull();
    expect(controller.getAttribute('tabindex')).toBeNull();
  });
});

test('UseHiddenAttribute: Uses hidden attribute when target not expanded', () => {
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
