/* eslint-disable max-len */
import Menu from '.';
import events from '../../utils/events';

const {
  keydownDown,
  keydownUp,
  keydownRight,
  keydownLeft,
} = events;

// Set up our document body
document.body.innerHTML = `
  <ul class="menu">
    <li><a class="first-child" href="example.com"></a>
      <ul class="sublist1">
        <li><a class="sublist1-first-child" href="example.com"></a></li>
        <li><a class="sublist1-second-child" href="example.com"></a></li>
        <li><a class="sublist1-last-child" href="example.com"></a></li>
      </ul>
    </li>
    <li><a class="second-child" href="example.com"></a></li>
    <li><a class="third-child" href="example.com"></a>
      <ul class="sublist2">
        <li><a class="sublist2-first-child" href="example.com"></a></li>
        <li><a class="sublist2-second-child" href="example.com"></a></li>
        <li><a class="sublist2-third-child" href="example.com"></a></li>
        <li><a class="sublist2-last-child" href="example.com"></a></li>
      </ul>
    </li>
    <li><a class="fourth-child" href="example.com"></a></li>
    <li><a class="last-child" href="example.com"></a></li>
  </ul>
`;

// Collect references to DOM elements.
const domElements = {
  list: document.querySelector('.menu'),
  listFirstItem: document.querySelector('.first-child'),
  listSecondItem: document.querySelector('.second-child'),
  listThirdItem: document.querySelector('.third-child'),
  listFourthItem: document.querySelector('.fourth-child'),
  listLastItem: document.querySelector('.last-child'),

  sublistOne: document.querySelector('.sublist1'),
  sublistOneFirstItem: document.querySelector('.sublist1-first-child'),
  sublistOneSecondItem: document.querySelector('.sublist1-second-child'),
  sublistOneLastItem: document.querySelector('.sublist1-last-child'),

  sublistTwo: document.querySelector('.sublist2'),
  sublistTwoFirstItem: document.querySelector('.sublist2-first-child'),
  sublistTwoSecondItem: document.querySelector('.sublist2-second-child'),
  sublistTwoThirdItem: document.querySelector('.sublist2-third-child'),
  sublistTwoLastItem: document.querySelector('.sublist2-last-child'),
};

// Mock functions.
const onInit = jest.fn();
const onDestroy = jest.fn();

const menu = new Menu({
  menu: domElements.list,
  onInit,
  onDestroy,
});

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(domElements.list.menuItem).toBeInstanceOf(Menu);

    expect(menu.firstItem.className).toEqual('first-child');

    expect(domElements.sublistOne.menuItem).toBeInstanceOf(Menu);
    expect(domElements.sublistOne.menuItem.previousSibling).toEqual(domElements.listFirstItem);

    expect(onInit).toHaveBeenCalled();
  });

  it('Should set element attributes correctly', () => {
    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toEqual('5');
    expect(domElements.sublistOneFirstItem.getAttribute('aria-setsize')).toEqual('3');
    expect(domElements.sublistTwoFirstItem.getAttribute('aria-setsize')).toEqual('4');
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toEqual('3');
    expect(domElements.sublistOneSecondItem.getAttribute('aria-posinset')).toEqual('2');
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toEqual('4');
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

  // Down: When focus is on a menuitem that does not have a submenu, activates the menuitem and closes the menu.
});

describe('Destroying the Menu removes attributes', () => {
  it('Should remove attributes on destroy', () => {
    menu.destroy();

    expect(domElements.list.menuItem).not.toBeInstanceOf(Menu);
    expect(domElements.sublistOne.menuItem).not.toBeInstanceOf(Menu);

    expect(domElements.listFirstItem.getAttribute('aria-describedby')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistOneFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistTwoFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.sublistOneSecondItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toBeNull();

    expect(onDestroy).toHaveBeenCalled();
  });
});
