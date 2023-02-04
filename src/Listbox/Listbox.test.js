/* eslint-disable max-len, prefer-destructuring */
import Listbox from '.';
import { events } from '@/.jest/events';

const {
  click,
  keydownArrowDown,
  keydownArrowUp,
  keydownEnd,
  keydownEnter,
  keydownEscape,
  keydownHome,
  keydownShiftTab,
  keydownSpace,
  keydownTab,
  keyupArrowDown,
  keyupArrowUp,
} = events;

const listboxMarkup = `
  <button aria-controls="options">Choose</button>
  <ul id="options">
    <li>Anchorage</li>
    <li>Baltimore</li>
    <li>Chicago</li>
    <li>Dallas</li>
    <li>El Paso</li>
    <li>Fort Lauderdale</li>
    <li>Grand Rapids</li>
    <li>Hartford</li>
    <li>Idaho Falls</li>
  </ul>
`;

// Set up our document body
document.body.innerHTML = listboxMarkup;

const controller = document.querySelector('button');
const target = document.querySelector('ul');
const listItems = Array.from(target.children);

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

controller.addEventListener('listbox.stateChange', onStateChange);
controller.addEventListener('listbox.init', onInit);
controller.addEventListener('listbox.destroy', onDestroy);

const listbox = new Listbox(controller);

describe('The Listbox should initialize as expected', () => {
  test('The Listbox includes the expected property values', () => {
    expect(listbox).toBeInstanceOf(Listbox);
    expect(listbox.toString()).toEqual('[object Listbox]');

    expect(controller.id).toEqual(listbox.id);

    expect(listbox.expanded).toBe(false);
    const [firstListItem] = listItems;
    expect(listbox.activeDescendant).toEqual(firstListItem);
  });

  test('The Listbox controller includes the expected attribute values', () => {
    // expect(controller.getAttribute('aria-haspopup')).toEqual('listbox');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    // expect(controller.getAttribute('aria-labelledby')).toEqual('location-label location-listbox-button');
    expect(controller.getAttribute('aria-activedescendant')).toBeNull();
  });

  test('The Listbox target includes the expected attribute values', () => {
    expect(target.getAttribute('role')).toEqual('listbox');
    expect(target.getAttribute('aria-hidden')).toEqual('true');
    // expect(target.getAttribute('aria-labelledby')).toEqual('label');
    expect(target.getAttribute('tabindex')).toEqual('-1');

    listItems.forEach((listItem) => {
      expect(listItem.id).not.toBeNull();
      expect(listItem.getAttribute('role')).toEqual('option');
    });
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(listbox);
    });
  });
});

describe('The Listbox controller should respond to state changes', () => {
  test('State change update atttributes as expected', () => {
    listbox.expanded = true;
    expect(listbox.expanded).toBe(true);

    expect(controller.getAttribute('aria-expanded')).toEqual('true');

    expect(target.getAttribute('aria-hidden')).toEqual('false');
    expect(target.getAttribute('aria-activedescendant')).toEqual(target.children[0].id);
    expect(document.activeElement).toEqual(target);
  });

  test('The `stateChange` event fires only once', () => {
    expect(onStateChange).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.expanded).toBe(true);
      expect(detail.instance).toStrictEqual(listbox);
    });
  });
});

describe('Listbox correctly responds to events', () => {
  // Ensure the Listbox is open before all tests.
  beforeEach(() => {
    listbox.expanded = true;
  });

  test('The Listbox closes when the Escape key is pressed', () => {
    controller.focus();
    controller.dispatchEvent(keydownEscape);
    expect(listbox.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
  });

  test(
    'The Listbox closes and focus is moved to the controller when the Escape key is pressed',
    () => {
      target.dispatchEvent(keydownEscape);
      expect(listbox.expanded).toBe(false);
      expect(document.activeElement).toEqual(controller);
    }
  );

  test('The Listbox closes when Tabbing from the last child', () => {
    target.focus();
    target.dispatchEvent(keydownTab);
    expect(listbox.expanded).toBe(false);
  });

  // test('The Listbox remains open when tabbing back from the last child', () => {
  //   domLastChild.focus();
  //   target.dispatchEvent(keydownShiftTab);
  //   expect(listbox.expanded).toBe(true);
  // });

  test('The Listbox closes when an external element is clicked', () => {
    document.body.dispatchEvent(click);

    expect(listbox.expanded).toBe(false);
  });
});

describe('The Listbox target responds to events as expected', () => {
  beforeEach(() => {
    listbox.expanded = true;
  });

  test('Should open the popup on controller arrow down key', () => {
    controller.dispatchEvent(keyupArrowDown);
    expect(document.activeElement).toEqual(target);
    expect(listbox.expanded).toBe(true);
  });

  test('The Listbox closes and focus moves to the controller on Enter key', () => {
    target.dispatchEvent(keydownEnter);
    expect(listbox.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
  });

  test('The Listbox closes on controller arrow up key', () => {
    controller.dispatchEvent(keyupArrowUp);
    expect(document.activeElement).toEqual(target);
    expect(listbox.expanded).toBe(true);
  });

  test('The Listbox closes and focus moes to the controller on Escape key', () => {
    target.dispatchEvent(keydownEscape);
    expect(listbox.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
  });

  test('The Listbox closes and focus moves to the controller on Space key', () => {
    target.dispatchEvent(keydownSpace);
    expect(listbox.expanded).toBe(false);
    expect(document.activeElement).toEqual(controller);
  });

  test('The previous element is set as activedescendant on arrow up key', () => {
    listbox.activeDescendant = target.children[3];
    expect(target.children[3].getAttribute('aria-selected')).toEqual('true');

    target.dispatchEvent(keydownArrowUp);

    expect(document.activeElement).toEqual(target);
    expect(target.children[3].getAttribute('aria-selected')).toBeNull();
    expect(listbox.activeDescendant).toEqual(target.children[2]);
    expect(target.children[2].getAttribute('aria-selected')).toEqual('true');
  });

  test('The next element is set as activedescendant on target arrow down key', () => {
    listbox.activeDescendant = target.children[4];
    expect(target.children[4].getAttribute('aria-selected')).toEqual('true');

    target.dispatchEvent(keydownArrowDown);

    expect(document.activeElement).toEqual(target);
    expect(target.children[4].getAttribute('aria-selected')).toBeNull();
    expect(listbox.activeDescendant).toEqual(target.children[5]);
    expect(target.children[5].getAttribute('aria-selected')).toEqual('true');
  });

  test('The first element is set as activedescendant on target Home key', () => {
    target.dispatchEvent(keydownHome);

    expect(document.activeElement).toEqual(target);
    expect(listbox.activeDescendant).toEqual(target.children[0]);
    expect(target.children[0].getAttribute('aria-selected')).toEqual('true');
  });

  test('The last element is set as activedescendant on target End key', () => {
    const lastChild = target.children[target.children.length - 1];

    target.dispatchEvent(keydownEnd);

    expect(document.activeElement).toEqual(target);
    expect(listbox.activeDescendant).toEqual(lastChild);
    expect(lastChild.getAttribute('aria-selected')).toEqual('true');
  });

  test('When an option is clicked it is selected and the Listbox closes', () => {
    target.children[3].dispatchEvent(click);

    expect(listbox.expanded).toBe(false);
    expect(listbox.activeDescendant).toEqual(target.children[3]);
    expect(document.activeElement).toEqual(controller);

    expect(controller.getAttribute('aria-activedescendant')).toBeNull();
    expect(controller.textContent).toEqual(target.children[3].textContent);
    expect(controller.textContent).toEqual(listbox.activeDescendant.textContent);
  });

  test('The Listbox closes when an external element is clicked', () => {
    listbox.activeDescendant = target.children[5];

    document.body.dispatchEvent(click);

    expect(listbox.expanded).toBe(false);
    expect(listbox.activeDescendant).toEqual(target.children[5]);
    expect(document.activeElement).not.toEqual(target);

    expect(controller.getAttribute('aria-activedescendant')).toBeNull();
    // expect(controller.textContent).toEqual(target.children[5].textContent);
  });
});

describe('Listbox destroy', () => {
    test('All attributes are removed from elements managed by the Listbox', () => {
    listbox.destroy();

    expect(controller.getAttribute('role')).toBeNull();
    // expect(controller.getAttribute('aria-haspopup')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    // expect(controller.getAttribute('aria-controls')).toEqual('options');
    expect(target.getAttribute('aria-hidden')).toBeNull();

    // expect(controller.popup).toBeUndefined();
    // expect(target.popup).toBeUndefined();

    controller.dispatchEvent(click);
    expect(listbox.expanded).toBe(false);

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(listboxMarkup);

    // expect(controller.getAttribute('aria-haspopup')).toBeNull();
    // expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual(target.id);
    expect(target.getAttribute('aria-activedescendant')).toBeNull();
    // expect(target.getAttribute('aria-hidden')).toBeNull();

    listItems.forEach((item) => {
      expect(item.getAttribute('role')).toBeNull();
      expect(item.getAttribute('aria-selected')).toBeNull();
    });

    // controller.dispatchEvent(click);
    // expect(listbox.expanded).toBe(false);

    // Quick and dirty verification that the original markup is restored.
    // But first, restore the button's original text label.
    // controller.textContent = 'Choose';
    // expect(document.body.innerHTML).toEqual(listboxMarkup);

    expect(onDestroy).toHaveBeenCalledTimes(1); // Listbox
    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onDestroy);

      expect(detail.element).toStrictEqual(controller);
      expect(detail.instance).toStrictEqual(listbox);
    });
  });

  // test.skip('All attributes are removed from elements managed by the Listbox', () => {
  //   listbox.destroy();

  //   // expect(controller.getAttribute('aria-haspopup')).toBeNull();
  //   expect(controller.getAttribute('aria-expanded')).toBeNull();
  //   expect(controller.getAttribute('aria-controls')).toEqual(target.id);
  //   expect(target.getAttribute('aria-activedescendant')).toBeNull();
  //   expect(target.getAttribute('aria-hidden')).toBeNull();

  //   listItems.forEach((item) => {
  //     expect(item.getAttribute('role')).toBeNull();
  //     expect(item.getAttribute('aria-selected')).toBeNull();
  //   });

  //   controller.dispatchEvent(click);
  //   expect(listbox.expanded).toBe(false);

  //   // Quick and dirty verification that the original markup is restored.
  //   // But first, restore the button's original text label.
  //   controller.textContent = 'Choose';
  //   expect(document.body.innerHTML).toEqual(listboxMarkup);

  //   expect(onDestroy).toHaveBeenCalledTimes(2); // Listbox
  //   return Promise.resolve().then(() => {
  //     const { detail } = getEventDetails(onDestroy);

  //     expect(detail.element).toStrictEqual(controller);
  //     expect(detail.instance).toStrictEqual(listbox);
  //   });
  // });
});
