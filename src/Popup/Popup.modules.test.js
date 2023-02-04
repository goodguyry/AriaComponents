/* eslint-disable max-len */
import { events } from '@/.jest/events';
import Popup, {
  ComponentConnector,
  ManageTabIndex,
  UseButtonRole,
  UseHiddenAttribute,
} from '.';

const {
  keydownEnter,
  keydownShiftTab,
  keydownSpace,
  keydownTab,
} = events;

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

test('ComponentConnector: Connect disconnected controller-target pair', () => {
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
