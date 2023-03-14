import user from '@/.jest/user';
import Dialog from '.';

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
      <button aria-controls="dialog" class="link">Open dialog</button>
    </article>
  </main>
  <footer class="site-footer">Site footer</footer>
  <div class="wrapper" id="dialog">
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><button class="item-button"></button></li>
      <li><a class="last-item" href="example.com"></a></li>
    </ul>
  </div>
`;

// Set up our document body
document.body.innerHTML = dialogMarkup;

const controller = document.querySelector('[aria-controls="dialog"]');
const target = document.getElementById('dialog');

// Cached elements.
const firstItem = target.querySelector('button');
const lastItem = target.querySelector('.last-item');
const listButton = target.querySelector('.item-button');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

// The `init` event is not trackable via on/off.
target.addEventListener('dialog.init', onInit);

const modal = new Dialog(target, { closeButton: firstItem });
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
    const { detail } = getEventDetails(onInit);

    expect(detail.instance).toStrictEqual(modal);
  });

  test('The Dialog controller includes the expected attribute values', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    expect(target.getAttribute('role')).toEqual('dialog');
    expect(target.getAttribute('aria-modal')).toEqual('true');
  });

  test('The Dialog state and attributes are accurate when opened', async () => {
    await user.click(controller);

    expect(modal.expanded).toBe(true);
    expect(modal.expanded).toBe(true);
    expect(document.activeElement).toEqual(firstItem);

    expect(target.getAttribute('aria-hidden')).toEqual('false');
  });

  test('The `stateChange` event fires when the Dialog is opened', () => {
    expect(onStateChange).toHaveBeenCalledTimes(1);

    const { detail } = getEventDetails(onStateChange);

    expect(detail.expanded).toBe(true);
    expect(detail.instance).toStrictEqual(modal);
  });

  test('The Dialog state and attributes are accurate when closed', () => {
    modal.expanded = false;
    expect(modal.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });
});

describe('The Dialog correctly responds to events', () => {
  beforeEach(() => {
    modal.expanded = true;
  });

  test('The Dialog traps keyboard tabs', async () => {
    firstItem.focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toEqual(lastItem);

    lastItem.focus();
    await user.keyboard('{Tab}');
    expect(document.activeElement).toEqual(firstItem);
  });

  test('The `closeButton` option connects the close button', async () => {
    await user.click(firstItem);

    expect(modal.expanded).toBe(false);
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('The `closeButton` setter overwrites as expected', async () => {
    modal.closeButton = listButton;

    // Listener removed from old button.
    await user.click(firstItem);
    expect(modal.expanded).toBe(true);

    await user.click(listButton);

    expect(modal.expanded).toBe(false);
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  test('The Dialog closes when the Escape key is pressed', async () => {
    lastItem.focus();
    await user.keyboard('{Escape}');
    expect(modal.expanded).toBe(false);
  });

  test('The Dialog remains open when external content is clicked', async () => {
    await user.click(document.body);
    expect(modal.expanded).toBe(true);
  });
});

test('All attributes are removed from elements managed by the Disclosure', () => {
  modal.destroy();

  expect(target.getAttribute('aria-hidden')).toBeNull();

  // Quick and dirty verification that the original markup is restored.
  expect(document.body.innerHTML).toEqual(dialogMarkup);

  expect(onDestroy).toHaveBeenCalledTimes(1);
  const { detail } = getEventDetails(onDestroy);

  expect(detail.element).toStrictEqual(target);
  expect(detail.instance).toStrictEqual(modal);
});
