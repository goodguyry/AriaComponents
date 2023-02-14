/* eslint-disable max-len */
import user from '@/.jest/user';
import Tablist from '.';

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

let tablist = null;

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

beforeAll(() => {
  tablist = new Tablist(tabs);

  tablist.on('tablist.stateChange', onStateChange);
  tablist.on('tablist.destroy', onDestroy);
});

describe('The Tablist should initialize as expected', () => {
  test('The Tablist includes the expected property values', () => {
    expect(tablist).toBeInstanceOf(Tablist);
    expect(tablist.toString()).toEqual('[object Tablist]');

    expect(tabs.id).toEqual(tablist.id);

    expect(tablist.activeIndex).toEqual(0);
  });

  test('The `init` event fires once', () => {
    expect(onInit).toHaveBeenCalledTimes(1);

    return Promise.resolve().then(() => {
      const { detail } = getEventDetails(onInit);

      expect(detail.instance).toStrictEqual(tablist);
    });
  });

  test('The Tablist elements includes the expected attribute values and overlay element', () => {
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
  });

  describe('Tablist methods work as expected', () => {
    test('The specified tab is activated', () => {
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

      expect(onStateChange).toHaveBeenCalledTimes(2);
    });

    test('The `stateChange` event is dispatched when a tab is actiuvated', () => {
      tablist.switchTo(1);

      expect(tablist.activeIndex).toBe(1);
      expect(onStateChange).toHaveBeenCalled();

      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onStateChange);

        expect(detail.activeIndex).toBe(1);
        expect(detail.instance).toStrictEqual(tablist);
      });
    });
  });

  describe('Tablist correctly responds to events', () => {
    test('Attribute values are updated as expected after state changes', async () => {
      await user.click(firstTab);
      expect(firstTab.getAttribute('aria-selected')).toEqual('true');
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toBeNull();

      expect(firstTab.getAttribute('tabindex')).toBeNull();
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toEqual('-1');

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('false');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('true');

      await user.click(thirdTab);
      expect(firstTab.getAttribute('aria-selected')).toBeNull();
      expect(secondTab.getAttribute('aria-selected')).toBeNull();
      expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

      expect(firstTab.getAttribute('tabindex')).toEqual('-1');
      expect(secondTab.getAttribute('tabindex')).toEqual('-1');
      expect(thirdTab.getAttribute('tabindex')).toBeNull();

      expect(firstPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(secondPanel.getAttribute('aria-hidden')).toEqual('true');
      expect(thirdPanel.getAttribute('aria-hidden')).toEqual('false');
    });

    test('Arrow keys navigate and activate tabs', async () => {
      firstTab.focus();
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toEqual(secondTab);

      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toEqual(thirdTab);

      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toEqual(firstTab); // cycle

      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toEqual(thirdTab); // cycle

      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toEqual(secondTab);

      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toEqual(firstTab);
    });

    test('The Home key moves selection to the first tab', async () => {
      tablist.switchTo(1);

      secondTab.focus();
      await user.keyboard('{Home}');
      expect(document.activeElement).toEqual(firstTab);
    });

    test('The End key moves selection to the last tab', async () => {
      tablist.switchTo(1);

      secondTab.focus();
      await user.keyboard('{End}');
      expect(document.activeElement).toEqual(thirdTab);
    });

    test('All DOM attributes are removed from elements managed by this component', () => {
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

        const firstChild = panel.querySelector('a[href]');
        expect(firstChild.getAttribute('tabindex')).toBeNull();
      });

      // Quick and dirty verification that the original markup is restored.
      expect(document.body.innerHTML).toEqual(tablistMarkup);

      expect(onDestroy).toHaveBeenCalledTimes(1);
      return Promise.resolve().then(() => {
        const { detail } = getEventDetails(onDestroy);

        expect(detail.element).toStrictEqual(tabs);
        expect(detail.instance).toStrictEqual(tablist);
      });
    });
  });
});
