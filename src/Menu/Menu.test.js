/* eslint-disable max-len */
import { Menu, Disclosure } from 'root';
import { events, typeCharacter } from '../lib/events';

const {
  keydownDown,
  keydownUp,
  keydownRight,
  keydownLeft,
  keydownEnd,
  keydownHome,
} = events;

const menuMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menu">
      <li>
        <button class="first-item">Fruit</button>
        <ul class="sublist1">
          <li><a class="sublist1-first-item" href="example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="example.com">Cake</a></li>
      <li>
        <svg><use href="my-icon"></use></svg>
        <a class="third-item" href="example.com">Vegetables</a>
        <ul class="sublist2">
          <li><a class="sublist2-first-item" href="example.com">Carrots</a></li>
          <li><a class="sublist2-second-item" href="example.com">Broccoli</a></li>
          <li><a class="sublist2-third-item" href="example.com">Brussel Sprouts</a></li>
          <li><a class="sublist2-last-item" href="example.com">Asparagus</a></li>
        </ul>
      </li>
      <li><a class="fourth-item" href="example.com">Pie</a></li>
      <li><a class="last-item" href="example.com">Ice Cream</a></li>
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
const onDestroy = jest.fn();
const { list } = domElements;

let menu = new Menu({
  list,
  onInit,
  onDestroy,
});

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(domElements.list.menu).toBeInstanceOf(Menu);

    expect(menu.firstItem.className).toEqual('first-item');

    expect(domElements.sublistOne.menu).toBeInstanceOf(Menu);
    expect(domElements.sublistOne.menu.previousSibling).toEqual(domElements.listFirstItem);

    expect(onInit).toHaveBeenCalled();
  });

  it('Should set element attributes correctly', () => {
    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toEqual('5');
    expect(domElements.sublistOneFirstItem.getAttribute('aria-setsize')).toEqual('3');
    expect(domElements.sublistTwoFirstItem.getAttribute('aria-setsize')).toEqual('4');
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toEqual('3');
    expect(domElements.sublistOneSecondItem.getAttribute('aria-posinset')).toEqual('2');
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toEqual('4');

    expect(domElements.sublistTwoSecondItem.getAttribute('role')).toEqual('menuitem');
    expect(domElements.sublistTwoSecondItem.parentElement.getAttribute('role')).toEqual('presentation');
  });

  test('constructor.nextElementIsUl() correctly detects list siblings', () => {
    expect(Menu.nextElementIsUl(domElements.listThirdItem)).toBeTruthy();
    expect(Menu.nextElementIsUl(domElements.listSecondItem)).toBeFalsy();
  });
});

describe('MenuItem correctly responds to events', () => {
  it('Should move to the next sibling list item with down arrow key',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownDown);
      expect(document.activeElement).toEqual(domElements.listSecondItem);
    });

  it('Should move to the first sibling list item with up arrow key from last item',
    () => {
      domElements.listLastItem.focus();
      domElements.listLastItem.dispatchEvent(keydownDown);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move to the last list item with end key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownEnd);
      expect(document.activeElement).toEqual(domElements.listLastItem);
    });

  it('Should move to the first list item with home key',
    () => {
      domElements.listThirdItem.focus();
      domElements.listThirdItem.dispatchEvent(keydownHome);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move to the previous sibling list item with up arrow key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownUp);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move to the last sibling list item with up arrow key from first item',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownUp);
      expect(document.activeElement).toEqual(domElements.listLastItem);
    });

  it('Should move to the first sublist item with right arrow key',
    () => {
      domElements.listThirdItem.focus();
      domElements.listThirdItem.dispatchEvent(keydownRight);
      expect(document.activeElement).toEqual(domElements.sublistTwoFirstItem);
    });

  it('Should move to the parent list with left arrow key',
    () => {
      domElements.sublistTwoSecondItem.focus();
      domElements.sublistTwoSecondItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listThirdItem);
    });

  it('Should scope search to the current list', () => {
    domElements.sublistTwoLastItem.focus();

    // Should find 'Carrots' (not Cantaloupe or Cake)
    domElements.sublistTwoLastItem.dispatchEvent(typeCharacter('c'));
    domElements.sublistTwoLastItem.dispatchEvent(typeCharacter('a'));

    expect(document.activeElement).toEqual(domElements.sublistTwoFirstItem);
  });

  // Down: When focus is on a menuitem that does not have a submenu, activates the menuitem and closes the menu.
});

describe('Destroying the Menu removes attributes', () => {
  it('Should remove attributes on destroy', () => {
    menu.destroy();

    expect(domElements.list.list).toBeUndefined();
    expect(domElements.sublistOne.menu).toBeUndefined();

    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistOneFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistTwoFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.sublistOneSecondItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toBeNull();

    expect(domElements.list.getAttribute('role')).toBeNull();
    expect(domElements.sublistTwoSecondItem.parentElement.getAttribute('role')).toBeNull();
    expect(domElements.sublistOne.getAttribute('role')).toBeNull();
    expect(domElements.sublistTwoSecondItem.getAttribute('role')).toBeNull();

    expect(onDestroy).toHaveBeenCalled();
  });
});

describe('Menu instatiates submenus as Disclosures', () => {
  beforeAll(() => {
    menu = new Menu({
      list,
      collapse: true,
    });
  });

  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(domElements.list.menu).toBeInstanceOf(Menu);

    expect(menu.firstItem.className).toEqual('first-item');

    expect(domElements.sublistOne.menu).toBeInstanceOf(Menu);
    expect(domElements.sublistOne.menu.previousSibling).toEqual(domElements.listFirstItem);

    expect(domElements.listFirstItem.disclosure.getState().expanded).toBe(false);

    expect(domElements.listFirstItem.disclosure).toBeInstanceOf(Disclosure);
    expect(domElements.sublistOne.disclosure).toBeInstanceOf(Disclosure);
  });

  describe('MenuItem Disclosure correctly responds to events', () => {
    it('Should expand the Disclosure and move to the first sublist item with right arrow key',
      () => {
        domElements.listThirdItem.focus();
        domElements.listThirdItem.dispatchEvent(keydownRight);
        expect(domElements.listThirdItem.disclosure.getState().expanded).toBe(true);
        expect(document.activeElement).toEqual(domElements.sublistTwoFirstItem);
      });

    it('Should move to the next sibling list item with down arrow key',
      () => {
        domElements.sublistTwoFirstItem.dispatchEvent(keydownDown);
        expect(document.activeElement).toEqual(domElements.sublistTwoSecondItem);
      });

    it('Should collapse the Disclosure and move to the parent list with left arrow key',
      () => {
        domElements.sublistTwoSecondItem.dispatchEvent(keydownLeft);
        expect(domElements.listThirdItem.disclosure.getState().expanded).toBe(false);
        expect(document.activeElement).toEqual(domElements.listThirdItem);
      });

    it('Should move to the next sibling list item with down arrow key',
      () => {
        domElements.listThirdItem.dispatchEvent(keydownDown);
        expect(document.activeElement).toEqual(domElements.listFourthItem);
      });
  });

  it('Should remove all Menu Disclosure DOM attributes when destroyed', () => {
    menu.destroy();

    expect(list.getAttribute('role')).toBeNull();

    expect(domElements.listFirstItem.getAttribute('aria-expanded')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-controls')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('tabindex')).toBeNull();
    // The test markup isn't detatched, so this doesn't apply.
    expect(domElements.listFirstItem.getAttribute('aria-owns')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('role')).toBeNull();
    expect(domElements.listFirstItem.parentElement.getAttribute('role')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-posinset')).toBeNull();

    expect(domElements.sublistOne.getAttribute('aria-hidden')).toBeNull();
    expect(domElements.sublistOne.getAttribute('hidden')).toBeNull();

    expect(domElements.listFirstItem.disclosure).toBeUndefined();
    expect(domElements.sublistOne.disclosure).toBeUndefined();

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(menuMarkup);
  });
});
