/* eslint-disable max-len */
import { Popup } from '../..';
import { events } from '../lib/events';

const {
  click,
  keydownEsc,
  keydownTab,
  keydownShiftTab,
  keydownSpace,
  keydownReturn,
} = events;

const popupMarkup = `
  <a aria-controls="dropdown" href="#dropdown" class="link">Open</a>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a class="first-child" href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-child" href="example.com"></a></li>
    </ul>
  </div>
`;

// Set up our document body
document.body.innerHTML = popupMarkup;

const domFirstChild = document.querySelector('.first-child');
const domLastChild = document.querySelector('.last-child');

// Test uses link as controller, which is handled a bit differently than a button.
const controller = document.querySelector('.link');
const target = document.querySelector('.wrapper');

// Mock functions.
const onStateChange = jest.fn();

const popup = new Popup(controller);
popup.on('stateChange', onStateChange);

// Popup has to be instanitated.
popup.init();

describe('Popup adds and manipulates DOM element attributes', () => {
  it('Should be instantiated as expected', () => {
    expect(popup).toBeInstanceOf(Popup);
    expect(popup.toString()).toEqual('[object Popup]');

    expect(popup.firstInteractiveChild).toEqual(domFirstChild);
    expect(popup.lastInteractiveChild).toEqual(domLastChild);

    expect(popup.getState().expanded).toBeFalsy();

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });
  });

  it('Should add the correct attributes to the popup controller', () => {
    expect(controller.getAttribute('aria-haspopup')).toEqual('true');
    expect(controller.getAttribute('aria-expanded')).toEqual('false');

    // Link controller should get button role.
    expect(controller.getAttribute('role')).toEqual('button');
    expect(controller.getAttribute('tabindex')).toEqual('0');

    // The test markup isn't detatched, so this doesn't apply.
    expect(controller.getAttribute('aria-own')).toBeFalsy();
  });

  it('Should add the correct attributes to the popup target', () => {
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  it('Should fire `stateChange` event on state change: open', () => {
    popup.show();
    expect(popup.getState().expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: true });
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  it('Should fire `stateChange` event on state change: hidden', () => {
    popup.hide();
    expect(popup.getState().expanded).toBe(false);
    expect(onStateChange).toHaveBeenCalledTimes(2);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: false });
      expect(detail.instance).toStrictEqual(popup);
    });
  });

  it('Should update attributes when the controller is clicked', () => {
    // Click to open.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeTruthy();
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(controller.getAttribute('aria-expanded')).toEqual('true');
    expect(target.getAttribute('aria-hidden')).toEqual('false');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toBeNull();
    });

    // Click again to close.
    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();
    expect(onStateChange).toHaveBeenCalledTimes(4);
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');

    // All interactive children should initially have a negative tabindex.
    popup.interactiveChildElements.forEach((link) => {
      expect(link.getAttribute('tabindex')).toEqual('-1');
    });
  });

  it('Should run class methods and subscriber functions', () => {
    popup.show();
    expect(onStateChange).toHaveBeenCalledTimes(5);

    popup.hide();
    expect(onStateChange).toHaveBeenCalledTimes(6);
  });
});

describe('Popup correctly responds to events', () => {
  // Ensure the popup is open before all tests.
  beforeEach(() => {
    popup.show();
  });

  it(
    'Should close the popup when the ESC key is pressed',
    () => {
      controller.focus();
      controller.dispatchEvent(keydownEsc);
      expect(popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    }
  );

  it(
    'Should move focus to the first popup child on TAB from controller',
    () => {
      controller.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(domFirstChild);
    }
  );

  it('Should update Popup state with keyboard', () => {
    // Toggle popup
    controller.dispatchEvent(keydownSpace);
    expect(popup.getState().expanded).toBeFalsy();

    // Toggle popup
    controller.dispatchEvent(keydownReturn);
    expect(popup.getState().expanded).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it(
    'Should close the popup and focus the controller when the ESC key is pressed',
    () => {
      target.dispatchEvent(keydownEsc);
      expect(popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
    }
  );

  it(
    'Should close the popup when tabbing from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownTab);
      expect(popup.getState().expanded).toBeFalsy();
    }
  );

  it(
    'Should not close the popup when tabbing back from the last child',
    () => {
      domLastChild.focus();
      target.dispatchEvent(keydownShiftTab);
      expect(popup.getState().expanded).toBeTruthy();
    }
  );

  it(
    'Should focus the controller when tabbing back from the first child',
    () => {
      domFirstChild.focus();
      target.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(controller);
    }
  );

  it(
    'Should close the popup when an outside element it clicked',
    () => {
      document.body.dispatchEvent(click);
      expect(popup.getState().expanded).toBeFalsy();
    }
  );
});

describe('Popup destroy', () => {
  it('Should destroy the popup as expected', () => {
    popup.destroy();

    if ('BUTTON' !== controller.nodeName && null === controller.getAttribute('role')) {
      expect(controller.getAttribute('role')).toBeNull();
      expect(controller.getAttribute('tabindex')).toBeNull();
    }
    expect(controller.getAttribute('aria-haspopup')).toBeNull();
    expect(controller.getAttribute('aria-expanded')).toBeNull();
    expect(controller.getAttribute('aria-controls')).toEqual('dropdown');
    expect(controller.getAttribute('aria-owns')).toBeNull();
    expect(target.getAttribute('aria-hidden')).toBeNull();

    expect(controller.popup).toBeUndefined();
    expect(target.popup).toBeUndefined();

    controller.dispatchEvent(click);
    expect(popup.getState().expanded).toBeFalsy();

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(popupMarkup);
  });
});
