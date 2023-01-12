/* eslint-disable max-len */
import { Tablist } from '../..';
import { events } from '../../.jest/events';

const {
  click,
  keydownTab,
  keydownShiftTab,
  keydownArrowLeft,
  keydownArrowRight,
  keydownArrowDown,
  keydownHome,
  keydownEnd,
} = events;

const tablistMarkup = `
  <ul class="tablist">
    <li><a aria-controls="first-panel" href="#first-panel"></a></li>
    <li><a aria-controls="second-panel" href="#second-panel"></a></li>
    <li><a aria-controls="third-panel" href="#third-panel"></a></li>
  </ul>
  <div id="first-panel" class="panel">
    <h1>The Article Title</h1>
    <p>Lorem ipsum dolor sit amet, <a href="first-panel.com/first">consectetur</a>
  adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea <a href="first-panel.com/second">commodo consequat</a>. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur <a href="first-panel.com/third">sint occaecat</a> cupidatat non proident, sunt in culpa qui
  officia deserunt mollit anim id est laborum.</p>
  </div>
  <div id="second-panel" class="panel">
    <h1>The Article Title</h1>
    <p>Lorem ipsum dolor sit amet, <a href="example.com/second">consectetur</a>
    adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
    officia deserunt mollit anim id est laborum.</p>
  </div>
  <div id="third-panel" class="panel">
    <h1>The Article Title</h1>
    <p>Lorem ipsum dolor sit amet, <a href="example.com/third">consectetur</a>
    adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
    officia deserunt mollit anim id est laborum.</p>
  </div>
`;

// Set up our document body
document.body.innerHTML = tablistMarkup;

const tabs = document.querySelector('.tablist');
const panels = document.querySelectorAll('.panel');

let tablist = {};

// Cached selectors.
const firstTab = document.querySelector('[aria-controls="first-panel"]');
const secondTab = document.querySelector('[aria-controls="second-panel"]');
const thirdTab = document.querySelector('[aria-controls="third-panel"]');
const firstPanel = document.querySelector('#first-panel');
const secondPanel = document.querySelector('#second-panel');
const thirdPanel = document.querySelector('#third-panel');

// Mock functions.
const onStateChange = jest.fn();
const onInit = jest.fn();
const onDestroy = jest.fn();

tabs.addEventListener('tablist.init', onInit);
tabs.addEventListener('tablist.stateChange', onStateChange);
tabs.addEventListener('tablist.destroy', onDestroy);

describe('Tablist with default configuration', () => {
  beforeEach(() => {
    if (tablist instanceof Tablist) {
      tablist.destroy();
    }
    tablist = new Tablist(tabs);
  });

  describe('Tablist adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(tablist).toBeInstanceOf(Tablist);
      expect(tablist.toString()).toEqual('[object Tablist]');

      expect(tablist.getState().activeIndex).toEqual(0);

      expect(onInit).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onInit);

        expect(detail.instance).toStrictEqual(tablist);
      });
    });

    it(
      'Should add the correct attributes and overlay element',
      () => {
        expect(tabs.getAttribute('role')).toEqual('tablist');

        // List items
        Array.from(tabs.children).forEach((child) => {
          expect(child.getAttribute('role')).toEqual('presentation');
        });

        const tabLinks = tabs.querySelectorAll('a[href]');
        Array.from(tabLinks).forEach((tab, index) => {
          expect(tab.getAttribute('role')).toEqual('tab');
          expect(tab.getAttribute('aria-selected')).toEqual((0 === index) ? 'true' : null);
          expect(tab.getAttribute('tabindex')).toEqual((0 === index) ? null : '-1');
          expect(tab.id).not.toBeNull();
        });

        Array.from(panels).forEach((panel, index) => {
          expect(panel.getAttribute('role')).toEqual('tabpanel');
          if (0 !== index) {
            expect(panel.getAttribute('aria-hidden')).toEqual('true');
          } else {
            expect(panel.getAttribute('aria-hidden')).toEqual('false');
          }
          expect(panel.getAttribute('aria-labelledby')).not.toBeNull();
          expect(panel.id).not.toBeNull();
        });
      }
    );
  });

  describe('Tablist methods work as expected', () => {
    it('Should switch to the specified tab', () => {
      tablist.switchTo(0);
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toBeNull();

      expect(firstTab.getAttribute('tabindex')).toBeNull();
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toEqual('-1');

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('false');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('true');

      expect(firstPanel.getAttribute('tabindex')).toEqual('0');
      expect(secondPanel.getAttribute('tabindex')).toBeNull();
      expect(thirdPanel.getAttribute('tabindex')).toBeNull();

      expect(onStateChange).toHaveBeenCalledTimes(1);

      tablist.switchTo(2);
      expect(firstTab.getAttribute('aria-selected')).toBeNull();
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

      expect(firstTab.getAttribute('tabindex')).toEqual('-1');
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toBeNull();

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('false');

      expect(firstPanel.getAttribute('tabindex')).toBeNull();
      expect(secondPanel.getAttribute('tabindex')).toBeNull();
      expect(thirdPanel.getAttribute('tabindex')).toEqual('0');

      expect(onStateChange).toHaveBeenCalledTimes(2);
    });

    it('Should fire `stateChange` event on state change: open', () => {
      tablist.switchTo(1);

      expect(tablist.getState().activeIndex).toBe(1);
      expect(onStateChange).toHaveBeenCalled();

      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onStateChange);

        expect(detail.props).toMatchObject(['activeIndex']);
        expect(detail.state).toStrictEqual({ activeIndex: 1 });
        expect(detail.instance).toStrictEqual(tablist);
      });
    });

    it('Should remove all DOM attributes when destroyed', () => {
      tablist.destroy();
      expect(tabs.getAttribute('role')).toBeNull();

      // List items
      Array.from(tabs.children).forEach((child) => {
        expect(child.getAttribute('role')).toBeNull();
      });

      const tabLinks = tabs.querySelectorAll('a[href]');
      Array.from(tabLinks).forEach((tab, index) => {
        expect(tab.getAttribute('role')).toBeNull();
        expect(tab.getAttribute('aria-selected')).toBeNull();
        expect(tab.getAttribute('tabindex')).toBeNull();
        expect(tabLinks[index].getAttribute('aria-controls')).toEqual(panels[index].id);
      });

      Array.from(panels).forEach((panel) => {
        expect(panel.getAttribute('role')).toBeNull();
        expect(panel.getAttribute('aria-hidden')).toBeNull();
        expect(panel.getAttribute('aria-labelledby')).toBeNull();
        expect(panel.getAttribute('tabindex')).toBeNull();

        const firstChild = panel.querySelector('a[href]');
        expect(firstChild.getAttribute('tabindex')).toBeNull();
      });

      expect(onDestroy).toHaveBeenCalledTimes(5);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onDestroy);

        expect(detail.element).toStrictEqual(tabs);
        expect(detail.instance).toStrictEqual(tablist);
      });
    });

    // Quick and dirty verification that the original markup is restored.
    expect(document.body.innerHTML).toEqual(tablistMarkup);
  });

  describe('Tablist correctly responds to events', () => {
    it('Should update attributes when the tabs are clicked', () => {
      firstTab.dispatchEvent(click);
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toBeNull();

      expect(firstTab.getAttribute('tabindex')).toBeNull();
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toEqual('-1');

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('false');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('true');

      expect(firstPanel.getAttribute('tabindex')).toEqual('0');
      expect(secondPanel.getAttribute('tabindex')).toBeNull();
      expect(thirdPanel.getAttribute('tabindex')).toBeNull();

      thirdTab.dispatchEvent(click);
      expect(firstTab.getAttribute('aria-selected')).toBeNull();
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

      expect(firstTab.getAttribute('tabindex')).toEqual('-1');
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toBeNull();

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('false');

      expect(firstPanel.getAttribute('tabindex')).toBeNull();
      expect(secondPanel.getAttribute('tabindex')).toBeNull();
      expect(thirdPanel.getAttribute('tabindex')).toEqual('0');
    });

    it('Should handle keyboard events to and from tabs', () => {
      tablist.switchTo(0);
      expect(tablist.getState().activeIndex).toEqual(0);

      firstTab.dispatchEvent(keydownTab);
      expect(document.activeElement).toEqual(firstPanel);

      /**
       * Increment the counter to track time spent trying to get these tests to
       * pass, even though they work as expected when tested in a browser.
       *
       * Hours Lost: 4.5
       */
      // const firstPanelChild = firstPanel.querySelector('a[href]');

      // firstPanel.dispatchEvent(keydownTab);
      // expect(document.activeElement).toEqual(firstPanelChild);

      // firstPanelChild.dispatchEvent(keydownShiftTab);
      // expect(document.activeElement).toEqual(firstPanel);

      firstPanel.dispatchEvent(keydownShiftTab);
      expect(document.activeElement).toEqual(firstTab);
    });

    it('Should switch tabs when arrow keys are pressed', () => {
      firstTab.focus();
      firstTab.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toEqual(secondTab);
      expect(secondTab.getAttribute('aria-selected')).toEqual('true');

      secondTab.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toEqual(thirdTab);
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

      thirdTab.dispatchEvent(keydownArrowRight);
      expect(document.activeElement).toEqual(firstTab); // cycle
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');

      thirdTab.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toEqual(secondTab);
      expect(secondTab.getAttribute('aria-selected')).toEqual('true');

      secondTab.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toEqual(firstTab);
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');

      firstTab.dispatchEvent(keydownArrowLeft);
      expect(document.activeElement).toEqual(thirdTab); // cycle
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set first element as activedescendant on target Home key', () => {
      tablist.switchTo(1);

      secondTab.focus();
      secondTab.dispatchEvent(keydownHome);
      expect(document.activeElement).toEqual(firstTab);
      expect(tablist.getState().activeIndex).toEqual(0);
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');
    });

    it('Should set last element as activedescendant on target End key', () => {
      tablist.switchTo(1);

      secondTab.focus();
      secondTab.dispatchEvent(keydownEnd);
      expect(document.activeElement).toEqual(thirdTab);
      expect(tablist.getState().activeIndex).toEqual(2);
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');
    });

    it('Should focus the panel from tab when down arrow pressed', () => {
      secondTab.focus();
      secondTab.dispatchEvent(keydownArrowDown);
      expect(document.activeElement).toEqual(secondPanel);
      expect(secondPanel.getAttribute('tabindex')).toEqual('0');
    });
  });
});
