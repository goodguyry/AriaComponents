import { events } from '@/.jest/events';
import Dialog from '.';

const {
  click,
  keydownTab,
  keydownShiftTab,
  keydownEscape,
} = events;

const dialogMarkup = `
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

// Set up our document body
document.body.innerHTML = dialogMarkup;

const controller = document.querySelector('[aria-controls="dialog"]');
const target = document.getElementById('dialog');
const content = document.querySelector('main');
const footer = document.querySelector('footer');
const outsideLink = document.querySelector('.outside-link');

// Cached elements.
const firstItem = target.querySelector('button');
const lastItem = target.querySelector('.last-item');
const anyLink = target.querySelector('a');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

// The `init` event is not trackable via on/off.
target.addEventListener('dialog.init', onInit);

const modal = new Dialog(target);
modal.on('dialog.stateChange', onStateChange);
modal.on('dialog.destroy', onDestroy);

describe('The Dialog should initialize as expected', () => {
  test('The Dialog includes the expected property values', () => {
    expect(modal).toBeInstanceOf(Dialog);
    expect(modal.toString()).toEqual('[object Dialog]');

    expect(modal.expanded).toBe(false);
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);
    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(modal);
    });
  });

  test('The Dialog controller includes the expected attribute values', () => {
    expect(target.getAttribute('tabindex')).toEqual('0');

    expect(target.getAttribute('aria-hidden')).toEqual('true');

    expect(target.getAttribute('role')).toEqual('dialog');
    expect(target.getAttribute('aria-modal')).toEqual('true');
  });

  test('The Dialog state and attributes are accurate when opened', () => {
    modal.expanded = true;
    expect(modal.expanded).toBe(true);
    expect(document.activeElement).toEqual(target);

    expect(footer.getAttribute('aria-hidden')).toEqual('true');
    expect(content.getAttribute('aria-hidden')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');
  });

  test('The `stateChange` event fires when the Dialog is opened', () => {
    expect(onStateChange).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.expanded).toBe(true);
      expect(detail.instance).toStrictEqual(modal);
    });
  });

  test('The Dialog state and attributes are accurate when closed', () => {
    modal.expanded = false;
    expect(modal.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    expect(footer.getAttribute('aria-hidden')).toBeNull();
    expect(content.getAttribute('aria-hidden')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });
});

describe('The Dialog correctly responds to events', () => {
  beforeEach(() => {
    modal.expanded = true;
  });

  test('The Dialog traps keyboard tabs', () => {
    firstItem.focus();
    firstItem.dispatchEvent(keydownShiftTab);
    expect(document.activeElement).toEqual(lastItem);

    lastItem.focus();
    lastItem.dispatchEvent(keydownTab);
    expect(document.activeElement).toEqual(firstItem);
  });

  test('The `close` setter connects the close button', () => {
    modal.closeButton = firstItem;
    firstItem.dispatchEvent(click);

    expect(modal.expanded).toBe(false);
    expect(footer.getAttribute('aria-hidden')).toBeNull();
    expect(content.getAttribute('aria-hidden')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('The `close` setter overwrites as expected', () => {
    modal.closeButton = anyLink;

    // Listener removed from old button.
    firstItem.dispatchEvent(click);
    expect(modal.expanded).toBe(true);

    anyLink.dispatchEvent(click);

    expect(modal.expanded).toBe(false);
    expect(footer.getAttribute('aria-hidden')).toBeNull();
    expect(content.getAttribute('aria-hidden')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  // What was this in response to?
  test('Focus moves back to the Dialog from outside', () => {
    outsideLink.focus();
    outsideLink.dispatchEvent(keydownTab);
    expect(document.activeElement).toEqual(firstItem);
  });

  test('The Dialog closes when the Escape key is pressed', () => {
    lastItem.focus();
    lastItem.dispatchEvent(keydownEscape);
    expect(modal.expanded).toBe(false);
  });

  test('The Dialog remains open when external content is clicked', () => {
    document.body.dispatchEvent(click);
    expect(modal.expanded).toBe(true);
  });
});

test('All attributes are removed from elements managed by the Disclosure', () => {
  modal.destroy();

  expect(target.getAttribute('aria-hidden')).toBeNull();

  // Quick and dirty verification that the original markup is restored.
  expect(document.body.innerHTML).toEqual(dialogMarkup);

  expect(onDestroy).toHaveBeenCalledTimes(1);
  return Promise.resolve().then(() => {
    const { detail } = getEventDetails(onDestroy);

    expect(detail.element).toStrictEqual(target);
    expect(detail.instance).toStrictEqual(modal);
  });
});
