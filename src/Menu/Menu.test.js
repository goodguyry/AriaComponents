/* eslint-disable max-len */
import Menu from '.';
import Popup from '../Popup';
import events from '../../utils/events';

const {
  keydownDown,
  keydownRight,
  keydownLeft,
} = events;

// Set up our document body
document.body.innerHTML = `
  <ul class="menu">
    <li><a class="first-item" href="example.com"></a>
      <ul class="sublist1">
        <li><a class="sublist1-first-item" href="example.com"></a></li>
        <li><a class="sublist1-second-item" href="example.com"></a></li>
        <li><a class="sublist1-last-item" href="example.com"></a></li>
      </ul>
    </li>
    <li><a class="second-item" href="example.com"></a></li>
    <li><a class="third-item" href="example.com"></a>
      <ul class="sublist2">
        <li><a class="sublist2-first-item" href="example.com"></a></li>
        <li><a class="sublist2-second-item" href="example.com"></a></li>
        <li><a class="sublist2-third-item" href="example.com"></a></li>
        <li><a class="sublist2-last-item" href="example.com"></a></li>
      </ul>
    </li>
    <li><a class="fourth-item" href="example.com"></a></li>
    <li><a class="last-item" href="example.com"></a></li>
  </ul>
`;

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
const onPopupStateChange = jest.fn();
const onPopupInit = jest.fn();
const onPopupDestroy = jest.fn();

const menu = new Menu({
  menu: domElements.list,
  onInit,
  onDestroy,
  onPopupStateChange,
  onPopupInit,
  onPopupDestroy,
});

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(onInit).toHaveBeenCalled();

    expect(domElements.listThirdItem.popup).toBeInstanceOf(Popup);
    expect(onPopupInit).toHaveBeenCalled();
  });

  it('Should add the correct DOM attributes and collect elements', () => {
    expect(domElements.list.getAttribute('role')).toEqual('menu');

    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toEqual('5');
    expect(domElements.listSecondItem.getAttribute('aria-describedby')).not.toBeNull();
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toEqual('3');

    expect(menu.getState().activeDescendant).toEqual(domElements.listFirstItem);

    expect(domElements.sublistTwoSecondItem.getAttribute('aria-setsize')).toEqual('4');
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toEqual('4');
  });
});

// Events:
//    down moves into the sublist
describe('Menu correctly responds to events', () => {
  it('Should move to the next sibling list item with right arrow key',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownRight);
      expect(document.activeElement).toEqual(domElements.listSecondItem);
    });

  it('Should move to the previous sibling list item with left arrow key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move to the last sibling list item with left arrow key from first item',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listLastItem);
    });

  it('Should move to the first sibling list item with right arrow key from last item',
    () => {
      domElements.listLastItem.focus();
      domElements.listLastItem.dispatchEvent(keydownRight);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move focus to the first popup child with down arrow from Menu bar',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownDown);
      expect(document.activeElement).toEqual(domElements.sublistOneFirstItem);
      expect(onPopupStateChange).toHaveBeenCalled();
    });
});

describe('Menu should destroy properly', () => {
  it('Should remove all attributes and destroy popups', () => {
    menu.destroy();
    expect(domElements.list.getAttribute('role')).toBeNull();

    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listSecondItem.getAttribute('aria-describedby')).toBeNull();
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toBeNull();

    // Sub-lists should be instantiated as MenuItems as well.
    expect(domElements.sublistTwoSecondItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toBeNull();

    expect(onDestroy).toHaveBeenCalled();
  });
});
