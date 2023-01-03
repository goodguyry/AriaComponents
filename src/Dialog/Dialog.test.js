import { Dialog } from '../..';
import { events } from '../lib/events';

const {
  click,
  keydownTab,
  keydownShiftTab,
  keydownEsc,
} = events;

const dialogMarkup = `
  <main>
    <article>
      <h1>The Article Title</h1>
      <a href="#" class="outside-link">Link</a>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.</p>
      <a aria-controls="dialog" class="link" href="#dialog">Open dialog</a>
    </article>
  </main>
  <footer class="site-footer">Site footer</footer>
  <div class="wrapper" id="dialog" tabindex="0">
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-item" href="example.com"></a></li>
    </ul>
  </div>
`;

// Set up our document body
document.body.innerHTML = dialogMarkup;

const controller = document.querySelector('.link');
const target = document.getElementById('dialog');
const content = document.querySelector('main');
const footer = document.querySelector('footer');
const outsideLink = document.querySelector('.outside-link');

// Cached elements.
const firstItem = target.querySelector('button');
const lastItem = document.querySelector('.last-item');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

// The `init` event is not trackable via on/off.
target.addEventListener('init', onInit);

const modal = new Dialog(target);
modal.on('stateChange', onStateChange);
modal.on('destroy', onDestroy);

describe('Dialog with default configuration', () => {
  beforeEach(() => {
    modal.hide();
  });

  describe('Dialog adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(modal).toBeInstanceOf(Dialog);
      expect(modal.toString()).toEqual('[object Dialog]');

      expect(controller.dialog).toBeInstanceOf(Dialog);
      expect(target.dialog).toBeInstanceOf(Dialog);

      expect(controller.dialog).toBeInstanceOf(Dialog);
      expect(target.dialog).toBeInstanceOf(Dialog);
      expect(modal.getState().expanded).toBeFalsy();

      expect(onInit).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onInit);

        expect(detail.instance).toStrictEqual(modal);
      });
    });

    it('Should add the correct attributes', () => {
      expect(target.getAttribute('tabindex')).toEqual('0');

      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');

      expect(target.getAttribute('role')).toEqual('dialog');
      expect(target.getAttribute('aria-modal')).toEqual('true');
    });
  });

  describe('Dialog class methods', () => {
    it('Should reflect the accurate state', () => {
      modal.show();
      expect(modal.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(target);
      // beforeEach * 3 + 1 from modal.show().
      expect(onStateChange).toHaveBeenCalledTimes(4);

      modal.hide();
      expect(modal.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
      expect(onStateChange).toHaveBeenCalledTimes(5);
    });
  });

  describe('Dialog correctly responds to events', () => {
    beforeEach(() => {
      modal.show();
    });

    it('Should update attributes when the controller is clicked', () => {
      modal.hide();
      expect(modal.getState().expanded).toBeFalsy();
      expect(footer.getAttribute('aria-hidden')).toBeNull();
      expect(content.getAttribute('aria-hidden')).toBeNull();
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');

      // Click to re-open.
      controller.dispatchEvent(click);
      expect(modal.getState().expanded).toBeTruthy();
      expect(footer.getAttribute('aria-hidden')).toEqual('true');
      expect(content.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
      expect(target.getAttribute('hidden')).toBeNull();
    });

    it('Should set the close button', () => {
      modal.setCloseButton(firstItem);
      firstItem.dispatchEvent(click);

      expect(modal.getState().expanded).toBeFalsy();
      expect(footer.getAttribute('aria-hidden')).toBeNull();
      expect(content.getAttribute('aria-hidden')).toBeNull();
      expect(target.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('hidden')).toEqual('');
    });

    it('Should trap keyboard tabs within the modal', () => {
      firstItem.focus();
      firstItem.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(lastItem);

      lastItem.focus();
      lastItem.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(firstItem);
    });

    it('Should close when the ESC key is pressed', () => {
      lastItem.focus();
      lastItem.dispatchEvent(keydownEsc);
      expect(modal.getState().expanded).toBeFalsy();
    });

    it('Should move focus back from outside', () => {
      outsideLink.focus();
      outsideLink.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(firstItem);
    });

    it('Should not close on outside click', () => {
      document.body.dispatchEvent(click);
      expect(modal.getState().expanded).toBeTruthy();
    });
  });

  it('Should fire `stateChange` event on state change: open', () => {
    modal.show();
    expect(modal.getState().expanded).toBe(true);
    expect(onStateChange).toHaveBeenCalled();

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onStateChange);

      expect(detail.props).toMatchObject(['expanded']);
      expect(detail.state).toStrictEqual({ expanded: true });
      expect(detail.instance).toStrictEqual(modal);
    });
  });

  describe('Destroying the Dialog removes attributes', () => {
    it('Should remove properties and attributes on destroy', () => {
      modal.destroy();

      expect(controller.dialog).toBeUndefined();
      expect(target.dialog).toBeUndefined();

      expect(target.getAttribute('aria-hidden')).toBeNull();
      expect(target.getAttribute('hidden')).toBeNull();

      // Quick and dirty verification that the original markup is restored.
      expect(document.body.innerHTML).toEqual(dialogMarkup);

      expect(onDestroy).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onDestroy);

        expect(detail.element).toStrictEqual(target);
        expect(detail.instance).toStrictEqual(modal);
      });
    });
  });
});
