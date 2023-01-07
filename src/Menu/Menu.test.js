/* eslint-disable max-len */
import { Menu, Disclosure } from '../..';
// import { events } from '../lib/events';

// const { keydownTab } = events;

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
const domElements = {
  list: document.querySelector('.menu'),
  listFirstItem: document.querySelector('.first-item'),
  listSecondItem: document.querySelector('.second-item'),
  listThirdItem: document.querySelector('.third-item'),
  listFourthItem: document.querySelector('.fourth-item'),
  listLastItem: document.querySelector('.last-item'),
  excludedItem: document.querySelector('.exclude'),

  sublistOne: document.querySelector('.sublist1'),
  sublistOneFirstItem: document.querySelector('.sublist1-first-item'),
  sublistOneSecondItem: document.querySelector('.sublist1-second-item'),
  sublistOneLastItem: document.querySelector('.sublist1-last-item'),

  sublistTwo: document.querySelector('.sublist2'),
  sublistTwoFirstItem: document.querySelector('.sublist2-first-item'),
  sublistTwoSecondItem: document.querySelector('.sublist2-second-item'),
  sublistTwoThirdItem: document.querySelector('.sublist2-third-item'),
  sublistTwoLastItem: document.querySelector('.sublist2-last-item'),
};

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();
const { list } = domElements;

// The `init` event is not trackable via on/off.
list.addEventListener('init', onInit);

let menu = new Menu(
  list,
  {
    _stateDispatchesOnly: true,
    collapse: false,
  }
);
menu.on('stateChange', onStateChange);
menu.on('destroy', onDestroy);

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(menu.toString()).toEqual('[object Menu]');
    expect(domElements.list.menu).toBeInstanceOf(Menu);

    expect(domElements.listFirstItem.disclosure).not.toBeInstanceOf(Disclosure);
    expect(domElements.sublistOne.disclosure).not.toBeInstanceOf(Disclosure);

    expect(onInit).toHaveBeenCalledTimes(0);
  });
});

describe('Destroying the Menu removes attributes', () => {
  it('Should remove attributes on destroy', () => {
    menu.destroy();

    expect(domElements.list.list).toBeUndefined();
    expect(onDestroy).toHaveBeenCalledTimes(0);
  });
});

describe('Menu instatiates submenus as Disclosures', () => {
  const initwithDisclosures = jest.fn();

  beforeAll(() => {
    list.removeEventListener('init', onInit);
    list.addEventListener('init', initwithDisclosures);

    menu = new Menu(list, { autoClose: false });
  });

  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(domElements.list.menu).toBeInstanceOf(Menu);

    expect(domElements.listFirstItem.disclosure.getState().expanded).toBe(false);

    expect(domElements.listFirstItem.disclosure).toBeInstanceOf(Disclosure);
    expect(domElements.sublistOne.disclosure).toBeInstanceOf(Disclosure);

    expect(initwithDisclosures).toHaveBeenCalledTimes(1);
    expect(menu.disclosures[0]._stateDispatchesOnly).toBe(true);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(initwithDisclosures);

      expect(detail.instance).toStrictEqual(menu);
    });
  });

  it('Should remove all Menu Disclosure DOM attributes when destroyed', () => {
    menu.destroy();

    expect(list.getAttribute('role')).toBeNull();

    expect(domElements.listFirstItem.getAttribute('aria-expanded')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-controls')).toEqual(domElements.sublistOne.id);
    expect(domElements.listFirstItem.getAttribute('tabindex')).toBeNull();
    // The test markup isn't detatched, so this doesn't apply.
    expect(domElements.listFirstItem.getAttribute('aria-owns')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('role')).toBeNull();
    expect(domElements.listFirstItem.parentElement.getAttribute('role')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-posinset')).toBeNull();

    expect(domElements.sublistOne.getAttribute('aria-hidden')).toBeNull();

    expect(domElements.listFirstItem.disclosure).toBeUndefined();
    expect(domElements.sublistOne.disclosure).toBeUndefined();

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
