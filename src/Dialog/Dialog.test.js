import Dialog from '.';
import Popup from '../Popup';
import events from '../../utils/events';

const {
  click,
  keydownTab,
  keydownShiftTab,
  keydownEsc,
} = events;

// Set up our document body
document.body.innerHTML = `
  <main>
    <article>
      <h1>The Article Title</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.</p>
      <a class="link" href="#dialog">Open dialog</a>
    </article>
  </main>
  <div class="wrapper" id="dialog">
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a class="last-item" href="example.com"></a></li>
    </ul>
  </div>
`;

const controller = document.querySelector('.link');
const target = document.getElementById('dialog');
const close = target.querySelector('button');
const content = document.querySelector('main');

// Cached elements.
const lastItem = document.querySelector('.last-item');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

const modal = new Dialog({
  controller,
  target,
  close,
  content,
  onStateChange,
  onInit,
  onDestroy,
});

describe('Dialog with default configuration', () => {
  beforeEach(() => {
    modal.popup.hide();
  });

  describe('Dialog adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(modal).toBeInstanceOf(Dialog);

      expect(controller.dialog).toBeInstanceOf(Dialog);
      expect(target.dialog).toBeInstanceOf(Dialog);

      expect(modal.popup).toBeInstanceOf(Popup);
      expect(modal.popup.getState().expanded).toBeFalsy();

      expect(onInit).toHaveBeenCalled();
    });

    it('Should add the correct attributes',
      () => {
        expect(controller.getAttribute('aria-haspopup')).toEqual('dialog');
        expect(controller.getAttribute('aria-expanded')).toEqual('false');
        expect(target.getAttribute('aria-hidden')).toEqual('true');
      });
  });

  describe('Dialog class methods', () => {
    it('Should reflect the accurate state', () => {
      modal.show();
      expect(modal.popup.getState().expanded).toBeTruthy();
      expect(document.activeElement).toEqual(modal.close);
      expect(onStateChange).toHaveBeenCalled();

      modal.hide();
      expect(modal.popup.getState().expanded).toBeFalsy();
      expect(document.activeElement).toEqual(controller);
      expect(onStateChange).toHaveBeenCalled();
    });
  });

  describe('Dialog correctly responds to events', () => {
    beforeEach(() => {
      modal.popup.show();
    });

    it('Should update attributes when the controller is clicked', () => {
      // Click to close (it is opened by `beforeEach`)
      modal.close.dispatchEvent(click);
      expect(modal.popup.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(content.getAttribute('aria-hidden')).toBeNull();
      expect(target.getAttribute('aria-hidden')).toEqual('true');

      // Click to re-open.
      controller.dispatchEvent(click);
      expect(modal.popup.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(content.getAttribute('aria-hidden')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toBeNull();
    });

    it('Should trap keyboard tabs within the modal', () => {
      close.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(lastItem);

      lastItem.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(modal.close);
    });

    it('Should close when the ESC key is pressed', () => {
      lastItem.focus();
      lastItem.dispatchEvent(keydownEsc);
      expect(modal.popup.getState().expanded).toBeFalsy();
    });

    it('Should close on outside click', () => {
      document.body.dispatchEvent(click);
      expect(modal.popup.getState().expanded).toBeFalsy();
    });
  });

  describe('Destroying the Dialog removes attributes', () => {
    it('Should remove properties and attributes on destroy', () => {
      modal.destroy();

      expect(controller.dialog).toBeUndefined();
      expect(target.dialog).toBeUndefined();

      expect(controller.getAttribute('aria-haspopup')).toBeNull();
      expect(controller.getAttribute('aria-expanded')).toBeNull();
      expect(target.getAttribute('aria-hidden')).toBeNull();

      expect(onDestroy).toHaveBeenCalled();
    });
  });
});
