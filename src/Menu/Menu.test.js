/* eslint-disable max-len */
import user from '@/.jest/user';
import Menu from '.';

const menuMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menu">
      <li id="first">
        <button class="first-item">Fruit</button>
        <ul id="first-disclosure" class="sublist1">
          <li><a class="sublist1-first-item" href="#example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="#example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="#example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="#example.com">Cake</a></li>
      <li id="third">
        <svg><use href="my-icon"></use></svg>
        <a aria-controls="second-disclosure" class="third-item" href="#example.com">Vegetables</a>
        <ul id="second-disclosure" class="sublist2">
          <li><a class="sublist2-first-item" href="#example.com">Carrots</a></li>
          <li><a class="sublist2-second-item" href="#example.com">Broccoli</a></li>
          <li><a class="sublist2-third-item" href="#example.com">Brussel Sprouts</a></li>
          <li><a class="sublist2-last-item" href="#example.com">Asparagus</a></li>
        </ul>
      </li>
      <li><a class="fourth-item" href="#example.com">Pie</a></li>
      <li><a class="last-item" href="#example.com" aria-current="true">Ice Cream</a></li>
      <li><a class="exclude" href="#example.com">Something Gross</a></li>
    </ul>
  </nav>
`;

// Set up our document body
document.body.innerHTML = menuMarkup;

// Collect references to DOM elements.
const list = document.querySelector('.menu');
const sublistOne = document.querySelector('.sublist1');

const firstController = document.querySelector('.first-item');
const firstTarget = document.getElementById('first-disclosure');
const secondController = document.querySelector('[aria-controls="second-disclosure"]');
const secondTarget = document.getElementById('second-disclosure');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

// The `init` event is not trackable via on/off.
list.addEventListener('menu.init', onInit);

let menu = null;

beforeAll(() => {
  menu = new Menu(list);

  menu.on('menu.stateChange', onStateChange);
  menu.on('menu.destroy', onDestroy);
});

describe('The Menu should initialize as expected', () => {
  test('The Disclosure includes the expected property values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(menu.activeDisclosure).toBeUndefined();
    expect(list.id).toEqual(menu.id);
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);

    const { detail } = getEventDetails(onInit);
    expect(detail.instance).toStrictEqual(menu);
  });

  test('The Disclosure controller includes the expected attribute values', () => {
    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(secondController.getAttribute('aria-expanded')).toEqual('false');
  });

  test('The Disclosure target includes the expected attribute values', () => {
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');
    expect(secondTarget.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Click events on the Disclosure controller updates attributes as expected', async () => {
    // Click to open.
    await user.click(firstController);

    expect(menu.activeDisclosure).toStrictEqual(menu.disclosures[0]);
    expect(firstController.getAttribute('aria-expanded')).toEqual('true');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('false');

    expect(onStateChange).toHaveBeenCalledTimes(1);

    const { detail: detailFirst } = getEventDetails(onStateChange);
    expect(detailFirst.instance).toStrictEqual(menu);
    expect(detailFirst.activeDisclosure).toStrictEqual(menu.disclosures[0]);

    // Click again to close.
    await user.click(firstController);

    expect(menu.activeDisclosure).toBeUndefined();
    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');

    expect(onStateChange).toHaveBeenCalledTimes(2);

    const { detail: detailSecond } = getEventDetails(onStateChange);
    expect(detailSecond.instance).toStrictEqual(menu);
    expect(detailSecond.activeDisclosure).toBeUndefined();
  });

  test('Only one submenu Disclosure is allowed to be expanded', async () => {
    // firstController.focus();
    await user.click(firstController);
    // await user.keyboard('{ }');

    expect(menu.activeDisclosure).toStrictEqual(menu.disclosures[0]);
    expect(firstController.getAttribute('aria-expanded')).toEqual('true');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('false');

    // Verify the second is hidden.
    expect(secondController.getAttribute('aria-expanded')).toEqual('false');
    expect(secondTarget.getAttribute('aria-hidden')).toEqual('true');

    expect(onStateChange).toHaveBeenCalledTimes(3);

    const { detail: detailFirst } = getEventDetails(onStateChange);
    expect(detailFirst.instance).toStrictEqual(menu);
    expect(detailFirst.activeDisclosure).toStrictEqual(menu.disclosures[0]);

    // secondController.focus();
    await user.click(secondController);
    // await user.keyboard('{Enter}');

    expect(menu.activeDisclosure).toStrictEqual(menu.disclosures[1]);
    expect(secondController.getAttribute('aria-expanded')).toEqual('true');
    expect(secondTarget.getAttribute('aria-hidden')).toEqual('false');

    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');

    expect(onStateChange).toHaveBeenCalledTimes(4);

    const { detail: detailSecond } = getEventDetails(onStateChange);
    expect(detailSecond.instance).toStrictEqual(menu);
    expect(detailSecond.activeDisclosure).toStrictEqual(menu.disclosures[1]);
  });

  test('The Disclosure closes when the Escape key is pressed', async () => {
    await user.keyboard('{Escape}');

    // Verify both are hidden.
    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(secondController.getAttribute('aria-expanded')).toEqual('false');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');
    expect(secondTarget.getAttribute('aria-hidden')).toEqual('true');

    expect(onStateChange).toHaveBeenCalledTimes(5);

    const { detail: detailSecond } = getEventDetails(onStateChange);
    expect(detailSecond.instance).toStrictEqual(menu);
    expect(detailSecond.activeDisclosure).toBeUndefined();
  });

  test.skip('The Disclosure remains open when Tabbing from the last child', async () => {
    menu.disclosures[0].expanded = true;

    const lastItem = document.querySelector('.sublist1-last-item');
    lastItem.focus();
    await user.keyboard('{Tab}');

    expect(menu.disclosures[0].expanded).toBe(true);
  });

  // Cover potential regressions.
  test.skip('The Disclosure remains open when tabbing back from the last child', async () => {
    menu.disclosures[0].expanded = true;

    const lastItem = document.querySelector('.sublist1-last-item');
    lastItem.focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(menu.disclosures[0].expanded).toBe(true);
  });

  test.skip('The Disclosure remains open when Tabbing from the last child', async () => {
    menu.disclosures[1].expanded = true;

    const lastLink = document.querySelector('.exclude');
    lastLink.focus();
    expect(menu.disclosures[1].expanded).toBe(true);

    await user.keyboard('{Tab}');
    expect(menu.disclosures[1].expanded).toBe(false);
  });

  test.skip('Clicking a menu link re-sets aria-current', async () => {
    const menuLink = document.querySelector('.sublist2-first-item');
    const current = document.querySelector('[aria-current="page"]');

    await user.click(menuLink);

    expect(menuLink.getAttribute('aria-current')).toBe('page');
    expect(current.getAttribute('aria-current')).toBeNull();
  });

  test.skip('All attributes are removed from elements managed by the Menu', () => {
    menu.destroy();

    expect(list.element).toBeUndefined();
    expect(onDestroy).toHaveBeenCalledTimes(1);

    expect(sublistOne.getAttribute('aria-hidden')).toBeNull();

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(menuMarkup);

    expect(onDestroy).toHaveBeenCalledTimes(1);
    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onDestroy);

      expect(detail.element).toStrictEqual(list);
      expect(detail.instance).toStrictEqual(menu);
    });
  });
});
