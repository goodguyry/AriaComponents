/* eslint-disable max-len */
import { Menu, Disclosure } from '../..';

const menuMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menu">
      <li>
        <button aria-controls="first-disclosure" class="first-item">Fruit</button>
        <ul id="first-disclosure" class="sublist1">
          <li><a class="sublist1-first-item" href="example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="example.com">Cake</a></li>
      <li>
        <svg><use href="my-icon"></use></svg>
        <a aria-controls="second-disclosure" class="third-item" href="example.com">Vegetables</a>
        <ul id="second-disclosure" class="sublist2">
          <li><a class="sublist2-first-item" href="example.com">Carrots</a></li>
          <li><a class="sublist2-second-item" href="example.com">Broccoli</a></li>
          <li><a class="sublist2-third-item" href="example.com">Brussel Sprouts</a></li>
          <li><a class="sublist2-last-item" href="example.com">Asparagus</a></li>
        </ul>
      </li>
      <li><a class="fourth-item" href="example.com">Pie</a></li>
      <li><a class="last-item" href="example.com">Ice Cream</a></li>
      <li><a class="exclude" href="example.com">Something Gross</a></li>
    </ul>
  </nav>
`;

// Set up our document body
document.body.innerHTML = menuMarkup;

// Collect references to DOM elements.
const list = document.querySelector('.menu');
const sublistOne = document.querySelector('.sublist1');

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

  test('Submenu Disclosures stay open when another opens', () => {
    menu.disclosures[0].open();
    menu.disclosures[1].open();

    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(true);

    menu.disclosures[0].open();
    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(true);
  });

  test('With `autoClose` enabled, submenu Disclosures close when another opens', () => {
    menu.autoClose = true;

    menu.disclosures[0].open();
    menu.disclosures[1].open();

    expect(menu.disclosures[0].expanded).toBe(false);
    expect(menu.disclosures[1].expanded).toBe(true);

    menu.disclosures[0].open();
    expect(menu.disclosures[0].expanded).toBe(true);
    expect(menu.disclosures[1].expanded).toBe(false);
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
