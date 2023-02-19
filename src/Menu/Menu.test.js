/* eslint-disable max-len */
import user from '@/.jest/user';
import Menu from '.';
import Disclosure from '../Disclosure';

const menuMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menu">
      <li>
        <button aria-controls="first-disclosure" class="first-item">Fruit</button>
        <ul id="first-disclosure" class="sublist1">
          <li><a class="sublist1-first-item" href="#example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="#example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="#example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="#example.com">Cake</a></li>
      <li>
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

const firstController = document.querySelector('[aria-controls="first-disclosure"]');
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

    expect(menu.disclosures[0].expanded).toBe(false);
    expect(menu.disclosures[0]).toBeInstanceOf(Disclosure);

    expect(list.id).toEqual(menu.id);
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(menu);
    });
  });

  test('The Disclosure controller includes the expected attribute values', () => {
    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(secondController.getAttribute('aria-expanded')).toEqual('false');
  });

  test('The Disclosure target includes the expected attribute values', () => {
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');
    expect(secondTarget.getAttribute('aria-hidden')).toEqual('true');
  });

  test('Click events on the Disclosure controller updates atttributes as expected', async () => {
    // Click to open.
    await user.click(firstController);

    expect(menu.disclosures[0].expanded).toBe(true);
    expect(firstController.getAttribute('aria-expanded')).toEqual('true');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('false');

    expect(onStateChange).toHaveBeenCalledTimes(1);

    // Click again to close.
    await user.click(firstController);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    expect(menu.disclosures[0].expanded).toBe(false);
    expect(firstController.getAttribute('aria-expanded')).toEqual('false');
    expect(firstTarget.getAttribute('aria-hidden')).toEqual('true');

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.activeDisclosure).toBe(menu.disclosures[0]);
      expect(detail.instance).toStrictEqual(disclosure);
    });
  });

  test.skip('Submenu Disclosures stay open when another opens', () => {
    menu.disclosures[0].open();
    menu.disclosures[1].open();

    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(true);

    menu.disclosures[0].open();
    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(true);
  });

  test('Only one submenu Disclosure is allowed to be expanded', () => {
    menu.disclosures[0].open();
    menu.disclosures[1].open();

    expect(menu.disclosures[0].expanded).toBe(false);
    expect(menu.disclosures[1].expanded).toBe(true);

    menu.disclosures[0].open();
    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(false);
  });

  test('The Disclosure closes when the Escape key is pressed', async () => {
    await user.keyboard('{Escape}');

    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(false);
  });

  test('The Disclosure remains open when Tabbing from the last child', async () => {
    menu.disclosures[0].expanded = true;

    const lastItem = document.querySelector('.sublist1-last-item');
    lastItem.focus();
    await user.keyboard('{Tab}');

    expect(menu.disclosures[0].expanded).toBe(true);
  });

  // Cover potential regressions.
  test('The Disclosure remains open when tabbing back from the last child', async () => {
    menu.disclosures[0].expanded = true;

    const lastItem = document.querySelector('.sublist1-last-item');
    lastItem.focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(menu.disclosures[0].expanded).toBe(true);
  });

  test('The Disclosure remains open when Tabbing from the last child', async () => {
    menu.disclosures[1].expanded = true;

    const lastLink = document.querySelector('.exclude');
    lastLink.focus();
    expect(menu.disclosures[1].expanded).toBe(true);

    await user.keyboard('{Tab}');
    expect(menu.disclosures[1].expanded).toBe(false);
  });

  test('Clicking a menu link re-sets aria-current', async () => {
    const menuLink = document.querySelector('.sublist2-first-item');
    const current = document.querySelector('[aria-current="page"]');

    await user.click(menuLink);

    expect(menuLink.getAttribute('aria-current')).toBe('page');
    expect(current.getAttribute('aria-current')).toBeNull();
  });

  test('All attributes are removed from elements managed by the Menu', () => {
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
