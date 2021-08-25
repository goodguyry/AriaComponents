/* eslint-disable max-len */
import { MenuBar, Popup } from '../..';
import { events } from '../lib/events';

const {
  keydownDown,
  keydownRight,
  keydownLeft,
  keydownEnd,
  keydownHome,
  keydownSpace,
  keydownReturn,
} = events;

const menubarMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menubar">
      <li>
        <button target="first-popup" class="first-item">Fruit</button>
        <ul id="first-popup" class="sublist1">
          <li><a class="sublist1-first-item" href="example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="example.com">Cake</a></li>
      <li>
        <svg><use href="my-icon"></use></svg>
        <a target="second-popup" class="third-item" href="example.com">Vegetables</a>
        <div id="second-popup" class="not-a-list">
          <ul class="sublist2">
            <li><a class="sublist2-first-item" href="example.com">Carrots</a></li>
            <li><a class="sublist2-second-item" href="example.com">Broccoli</a></li>
            <li><a class="sublist2-third-item" href="example.com">Brussel Sprouts</a></li>
            <li><a class="sublist2-last-item" href="example.com">Asparagus</a></li>
          </ul>
        </div>
      </li>
      <li><a class="fourth-item" href="example.com">Pie</a></li>
      <li><a class="last-item" href="example.com">Ice Cream</a></li>
      <li><a class="exclude" href="example.com">Something Gross</a></li>
    </ul>
  </nav>
`;

// Set up our document body
document.body.innerHTML = menubarMarkup;

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
const onBeforeStateChange = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();
const { list } = domElements;

list.addEventListener('init', onInit);
list.addEventListener('beforeStateChange', onBeforeStateChange);
list.addEventListener('stateChange', onStateChange);
list.addEventListener('destroy', onDestroy);

const menuBar = new MenuBar(list, { itemMatches: ':not(.exclude)' });

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menuBar).toBeInstanceOf(MenuBar);
    expect(menuBar.toString()).toEqual('[object MenuBar]');
    expect(domElements.list.menubar).toBeInstanceOf(MenuBar);
    expect(domElements.list.menubar.itemMatches).toEqual(':not(.exclude)');

    expect(domElements.listThirdItem.popup).toBeInstanceOf(Popup);

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(menuBar.subMenus[0]._stateDispatchesOnly).toBe(true);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(menuBar);
    });
  });

  it('Should add the correct DOM attributes and collect elements', () => {
    expect(domElements.list.getAttribute('role')).toEqual('menubar');

    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toEqual('5');
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toEqual('3');

    expect(menuBar.getState().menubarItem).toEqual(domElements.listFirstItem);

    expect(domElements.sublistTwoSecondItem.getAttribute('aria-setsize')).toEqual('4');
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toEqual('4');
    expect(domElements.sublistTwoFirstItem.getAttribute('role')).toEqual('menuitem');

    expect(domElements.listThirdItem.getAttribute('aria-haspopup')).toEqual('menu');
    // Popups should not override the item's role.
    expect(domElements.listThirdItem.getAttribute('role')).toEqual('menuitem');

    expect(domElements.sublistTwoFirstItem.parentElement.getAttribute('role')).toEqual('presentation');
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
      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onBeforeStateChange).toHaveBeenCalledTimes(1);

      return Promise.resolve().then(() => {
        const { detail: beforeDetails } = getEventDetails(onBeforeStateChange);

        expect(beforeDetails.props).toMatchObject(['menubarItem']);
        expect(beforeDetails.state).toStrictEqual({
          menubarItem: domElements.listFirstItem,
          popup: domElements.listFirstItem.popup,
        });
        expect(beforeDetails.instance).toStrictEqual(menuBar);

        const { target, detail } = getEventDetails(onStateChange);

        expect(detail.props).toStrictEqual(['menubarItem']);
        expect(detail.instance).toStrictEqual(menuBar);
        expect(detail.state).toStrictEqual({
          menubarItem: domElements.listSecondItem,
          popup: false,
        });

        expect(target).toStrictEqual(list);
      });
    });

  it('Should move to the previous sibling list item with left arrow key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
      expect(onStateChange).toHaveBeenCalledTimes(2);
    });

  it('Should move to the last list item with end key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownEnd);
      expect(document.activeElement).toEqual(domElements.listLastItem);
      expect(onStateChange).toHaveBeenCalledTimes(3);
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
    });

  it('Should move focus to the first popup child with spacebar from Menu bar',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownSpace);
      expect(document.activeElement).toEqual(domElements.listFirstItem.popup.firstInteractiveChild);
      expect(menuBar.getState().popup.getState().expanded).toBeTruthy();
    });

  it('Should move focus to the first popup child with return key from Menu bar',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownReturn);
      expect(document.activeElement).toEqual(domElements.listFirstItem.popup.firstInteractiveChild);
      expect(menuBar.getState().popup.getState().expanded).toBeTruthy();

      return Promise.resolve().then(() => {
        const { detail: beforeDetails } = getEventDetails(onBeforeStateChange);

        expect(beforeDetails.props).toMatchObject(['expanded']);
        expect(beforeDetails.state).toStrictEqual({ expanded: false });
        expect(beforeDetails.instance).toStrictEqual(domElements.listFirstItem.popup);

        const { target, detail } = getEventDetails(onStateChange);

        expect(detail.props).toStrictEqual(['expanded']);
        expect(detail.instance).toStrictEqual(domElements.listFirstItem.popup);
        expect(detail.state).toStrictEqual({ expanded: true });

        expect(target).toStrictEqual(domElements.listFirstItem);
      });
    });

  it('Should close the submenu on right arrow key on a menu item with no submenu', () => {
    menuBar.setState({
      menubarItem: domElements.listThirdItem,
    });
    domElements.sublistTwoThirdItem.focus();
    domElements.sublistTwoThirdItem.dispatchEvent(keydownRight);
    expect(document.activeElement).toEqual(domElements.listFourthItem);
    expect(menuBar.getState().popup).toBeFalsy();
    expect(domElements.listThirdItem.popup.getState().expanded).toBeFalsy();
  });

  it('Should close the submenu on left arrow key on a menu item with no parent menu', () => {
    menuBar.setState({
      menubarItem: domElements.listThirdItem,
    });
    domElements.sublistTwoThirdItem.focus();
    domElements.sublistTwoThirdItem.dispatchEvent(keydownLeft);
    expect(document.activeElement).toEqual(domElements.listSecondItem);
    expect(menuBar.getState().popup).toBeFalsy();
    expect(domElements.listThirdItem.popup.getState().expanded).toBeFalsy();
  });

  it('Should click the submenu item on spacebar or return key', () => {
    const onclick = jest.fn();
    domElements.sublistOneSecondItem.addEventListener('click', onclick);
    domElements.sublistOneSecondItem.focus();
    domElements.sublistOneSecondItem.dispatchEvent(keydownSpace);
    expect(onclick).toHaveBeenCalledTimes(1);
  });
});

describe('Menu should destroy properly', () => {
  it('Should remove all attributes and destroy popups', () => {
    menuBar.destroy();
    expect(domElements.list.getAttribute('role')).toBeNull();

    expect(domElements.listFirstItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.listFirstItem.getAttribute('tabindex')).toBeNull();
    expect(domElements.listThirdItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.listThirdItem.getAttribute('role')).toBeNull();

    expect(domElements.listThirdItem.parentElement.getAttribute('role')).toBeNull();

    expect(domElements.sublistTwoSecondItem.getAttribute('aria-setsize')).toBeNull();
    expect(domElements.sublistTwoLastItem.getAttribute('aria-posinset')).toBeNull();
    expect(domElements.sublistTwoLastItem.getAttribute('tabindex')).toBeNull();

    expect(domElements.list.menubar).toBeUndefined();
    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(menubarMarkup);

    expect(onDestroy).toHaveBeenCalledTimes(1);
    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onDestroy);

      expect(detail.element).toStrictEqual(list);
      expect(detail.instance).toStrictEqual(menuBar);
    });
  });
});
