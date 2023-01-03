/* eslint-disable max-len */
import { Menu, Disclosure } from '../..';
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
    itemMatches: ':not(.exclude)',
    _stateDispatchesOnly: true,
    __is_application_menu: true,
  }
);
menu.on('stateChange', onStateChange);
menu.on('destroy', onDestroy);

describe('Menu collects DOM elements and adds attributes', () => {
  it('Should instantiate the Menu class with correct instance values', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(menu.toString()).toEqual('[object Menu]');
    expect(domElements.list.menu).toBeInstanceOf(Menu);

    expect(domElements.list.menu.itemMatches).toEqual(':not(.exclude)');

    expect(menu.firstItem.className).toEqual('first-item');
    expect(menu.lastItem.className).not.toEqual('exclude');

    expect(domElements.sublistOne.menu).toBeInstanceOf(Menu);
    expect(domElements.sublistOne.menu.previousSibling).toEqual(domElements.listFirstItem);

    expect(onInit).toHaveBeenCalledTimes(0);
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
  it(
    'Should move to the next sibling list item with down arrow key',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownDown);
      expect(document.activeElement).toEqual(domElements.listSecondItem);
    }
  );

  it(
    'Should move to the first sibling list item with up arrow key from last item',
    () => {
      domElements.listLastItem.focus();
      domElements.listLastItem.dispatchEvent(keydownDown);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    }
  );

  it(
    'Should move to the last list item with end key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownEnd);
      expect(document.activeElement).toEqual(domElements.listLastItem);
    }
  );

  it(
    'Should move to the first list item with home key',
    () => {
      domElements.listThirdItem.focus();
      domElements.listThirdItem.dispatchEvent(keydownHome);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    }
  );

  it(
    'Should move to the previous sibling list item with up arrow key',
    () => {
      domElements.listSecondItem.focus();
      domElements.listSecondItem.dispatchEvent(keydownUp);
      expect(document.activeElement).toEqual(domElements.listFirstItem);
    }
  );

  it(
    'Should move to the last sibling list item with up arrow key from first item',
    () => {
      domElements.listFirstItem.focus();
      domElements.listFirstItem.dispatchEvent(keydownUp);
      expect(document.activeElement).toEqual(domElements.listLastItem);
    }
  );

  it(
    'Should move to the first sublist item with right arrow key',
    () => {
      domElements.listThirdItem.focus();
      domElements.listThirdItem.dispatchEvent(keydownRight);
      expect(document.activeElement).toEqual(domElements.sublistTwoFirstItem);
    }
  );

  it(
    'Should move to the parent list with left arrow key',
    () => {
      domElements.sublistTwoSecondItem.focus();
      domElements.sublistTwoSecondItem.dispatchEvent(keydownLeft);
      expect(document.activeElement).toEqual(domElements.listThirdItem);
    }
  );

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

    expect(onDestroy).toHaveBeenCalledTimes(0);
  });
});

describe('Menu instatiates submenus as Disclosures', () => {
  const initwithDisclosures = jest.fn();

  beforeAll(() => {
    list.removeEventListener('init', onInit);
    list.addEventListener('init', initwithDisclosures);

    menu = new Menu(
      list,
      {
        itemMatches: ':not(.exclude)',
        collapse: true,
        __is_application_menu: true,
      }
    );
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

    expect(initwithDisclosures).toHaveBeenCalledTimes(1);
    expect(menu.disclosures[0]._stateDispatchesOnly).toBe(true);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(initwithDisclosures);

      expect(detail.instance).toStrictEqual(menu);
    });
  });

  describe('MenuItem Disclosure correctly responds to events', () => {
    it(
      'Should expand the Disclosure and move to the first sublist item with right arrow key',
      () => {
        domElements.listThirdItem.focus();
        domElements.listThirdItem.dispatchEvent(keydownRight);
        expect(domElements.listThirdItem.disclosure.getState().expanded).toBe(true);
        expect(document.activeElement).toEqual(domElements.sublistTwoFirstItem);

        return Promise.resolve().then(() => {
          const { target, detail } = getEventDetails(onStateChange);

          expect(detail.props).toMatchObject(['expanded']);
          expect(detail.state).toStrictEqual({ expanded: true });
          expect(detail.instance).toStrictEqual(domElements.listThirdItem.disclosure);
          expect(target).toStrictEqual(domElements.listThirdItem);
        });
      }
    );

    it(
      'Should move to the next sibling list item with down arrow key',
      () => {
        domElements.sublistTwoFirstItem.dispatchEvent(keydownDown);
        expect(document.activeElement).toEqual(domElements.sublistTwoSecondItem);
      }
    );

    it(
      'Should collapse the Disclosure and move to the parent list with left arrow key',
      () => {
        domElements.sublistTwoSecondItem.dispatchEvent(keydownLeft);
        expect(domElements.listThirdItem.disclosure.getState().expanded).toBe(false);
        expect(document.activeElement).toEqual(domElements.listThirdItem);

        return Promise.resolve().then(() => {
          const { target, detail } = getEventDetails(onStateChange);

          expect(detail.props).toMatchObject(['expanded']);
          expect(detail.state).toStrictEqual({ expanded: false });
          expect(detail.instance).toStrictEqual(domElements.listThirdItem.disclosure);
          expect(target).toStrictEqual(domElements.listThirdItem);
        });
      }
    );

    it(
      'Should move to the next sibling list item with down arrow key',
      () => {
        domElements.listThirdItem.dispatchEvent(keydownDown);
        expect(document.activeElement).toEqual(domElements.listFourthItem);
      }
    );
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
