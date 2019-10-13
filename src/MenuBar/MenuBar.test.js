/* eslint-disable max-len */
import { MenuBar, Popup, Menu } from 'root';
import { events, typeCharacter } from 'root/utils/events';

// Create the help text elements for both MenuBar and Menu.
const ariaDescribedbyTestMarkup = Array.from(new Set([
  ...MenuBar.getHelpIds(),
  ...Menu.getHelpIds(),
])).reduce((acc, id) => (
  `${acc}<div id="${id.replace('#', '')}"></div>`
), '');

const {
  keydownDown,
  keydownRight,
  keydownLeft,
  keydownEnd,
  keydownHome,
} = events;

// Set up our document body
document.body.innerHTML = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menubar">
      <li>
        <a class="first-item" href="example.com">Fruit</a>
        <ul class="sublist1">
          <li><a class="sublist1-first-item" href="example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="example.com">Cake</a></li>
      <li>
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

  ${ariaDescribedbyTestMarkup}
`;

// Collect references to DOM elements.
const domElements = {
  list: document.querySelector('.menubar'),
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
const onStateChange = jest.fn();
const onDestroy = jest.fn();
const onPopupStateChange = jest.fn();
const onPopupInit = jest.fn();
const onPopupDestroy = jest.fn();

const menuBar = new MenuBar({
  menu: domElements.list,
  onInit,
  onStateChange,
  onDestroy,
  onPopupStateChange,
  onPopupInit,
  onPopupDestroy,
});

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menuBar).toBeInstanceOf(MenuBar);
    expect(domElements.list.menuBar).toBeInstanceOf(MenuBar);
    expect(onInit).toHaveBeenCalled();

    expect(domElements.listThirdItem.popup).toBeInstanceOf(Popup);
    expect(onPopupInit).toHaveBeenCalled();
  });

  it('Should add the correct DOM attributes and collect elements', () => {
    expect(domElements.list.getAttribute('role')).toEqual('menubar');

    expect(domElements.listFirstItem.parentElement.getAttribute('aria-setsize')).toEqual('5');
    expect(domElements.listSecondItem.getAttribute('aria-describedby')).not.toBeNull();
    expect(domElements.listThirdItem.parentElement.getAttribute('aria-posinset')).toEqual('3');

    expect(menuBar.getState().menubarItem).toEqual(domElements.listFirstItem);

    expect(domElements.sublistTwoSecondItem.parentElement.getAttribute('aria-setsize')).toEqual('4');
    expect(domElements.sublistTwoLastItem.parentElement.getAttribute('aria-posinset')).toEqual('4');
    expect(domElements.sublistTwoFirstItem.parentElement.getAttribute('role')).toEqual('menuitem');

    expect(domElements.listThirdItem.getAttribute('aria-haspopup')).toEqual('menu');
    expect(domElements.sublistTwo.getAttribute('role')).toEqual('menu');
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
      expect(onStateChange).toHaveBeenCalled();
    });

  it('Should move to the previous sibling list item with left arrow key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    });

  it('Should move to the last list item with end key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownEnd);
      expect(document.activeElement).toEqual(domElements.listLastItem);
      expect(onStateChange).toHaveBeenCalled();
    });

  it('Should move to the first list item with home key',
    () => {
      domElements.listThirdItem.focus();
      domElements.listThirdItem.dispatchEvent(keydownHome);
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

  it('Should close the submenu on right arrow key on a menu item with no submenu', () => {
    menuBar.setState({
      menubarItem: domElements.listThirdItem,
    });
    domElements.sublistTwoThirdItem.focus();
    domElements.sublistTwoThirdItem.dispatchEvent(keydownRight);
    expect(document.activeElement).toEqual(domElements.listFourthItem);
    expect(domElements.listThirdItem.popup.getState().expanded).toBeFalsy();
  });

  it('Should select the correct option by keyword search', () => {
    menuBar.setState({
      menubarItem: domElements.listSecondItem,
    });

    // Typing 'Pie'
    domElements.listSecondItem.dispatchEvent(typeCharacter('p'));
    domElements.listSecondItem.dispatchEvent(typeCharacter('i'));

    expect(document.activeElement).toEqual(domElements.listFourthItem);

    // Make sure the search string it cleared as expected.
    setTimeout(() => {
      // Typing 'Fruit'
      domElements.listFourthItem.dispatchEvent(typeCharacter('f'));
      domElements.listFourthItem.dispatchEvent(typeCharacter('r'));

      expect(document.activeElement).toEqual(domElements.listFirstItem);
    }, 500);
  });
});

describe('Menu should destroy properly', () => {
  it('Should remove all attributes and destroy popups', () => {
    menuBar.destroy();
    expect(domElements.list.getAttribute('role')).toBeNull();

    expect(domElements.listFirstItem.parentElement.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listSecondItem.getAttribute('aria-describedby')).toBeNull();
    expect(domElements.listThirdItem.parentElement.getAttribute('aria-posinset')).toBeNull();

    // Sub-lists should be instantiated as MenuItems as well.
    expect(domElements.sublistTwoSecondItem.parentElement.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistTwoLastItem.parentElement.getAttribute('aria-posinset')).toBeNull();

    expect(domElements.list.menuBar).toBeUndefined();
    expect(onDestroy).toHaveBeenCalled();
  });
});
