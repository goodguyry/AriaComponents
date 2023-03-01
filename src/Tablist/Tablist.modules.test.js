/* eslint-disable max-len */
import user from '@/.jest/user';
import Tablist, {
  AutomaticActivation,
  ManageTabIndex,
  UseHiddenAttribute,
} from '.';

// Set up our document body
document.body.innerHTML = `
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

const tabs = document.querySelector('.tablist');
const panels = document.querySelectorAll('.panel');

// Cached selectors.
const firstTab = document.querySelector('[aria-controls="first-panel"]');
const secondTab = document.querySelector('[aria-controls="second-panel"]');
const thirdTab = document.querySelector('[aria-controls="third-panel"]');

const firstPanel = document.querySelector('#first-panel');
const secondPanel = document.querySelector('#second-panel');
const thirdPanel = document.querySelector('#third-panel');

let tablist;
beforeEach(() => {
  tablist = new Tablist(
    tabs,
    {
      modules: [
        AutomaticActivation,
        ManageTabIndex,
        UseHiddenAttribute,
      ],
    }
  );
});

describe('AutomaticActivation', () => {
  test('Panels initialize with expected tabindex', () => {
    expect(firstPanel.getAttribute('tabindex')).toEqual('0');
    expect(secondPanel.getAttribute('tabindex')).toBeNull();
    expect(thirdPanel.getAttribute('tabindex')).toBeNull();
  });

  test('Arrow keys activate tabs', async () => {
    firstTab.focus();

    await user.keyboard('{ArrowRight}');
    expect(firstTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('aria-selected')).toEqual('true');
    expect(thirdTab.getAttribute('aria-selected')).toBe('false');

    await user.keyboard('{ArrowRight}');
    expect(firstTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

    await user.keyboard('{ArrowRight}');
    expect(firstTab.getAttribute('aria-selected')).toEqual('true');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toBe('false');

    await user.keyboard('{ArrowLeft}');
    expect(firstTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toEqual('true');

    await user.keyboard('{ArrowLeft}');
    expect(firstTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('aria-selected')).toEqual('true');
    expect(thirdTab.getAttribute('aria-selected')).toBe('false');

    await user.keyboard('{ArrowLeft}');
    expect(firstTab.getAttribute('aria-selected')).toEqual('true');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toBe('false');
  });

  test('The Home key moves activates the first tab', async () => {
    tablist.switchTo(1);

    secondTab.focus();
    await user.keyboard('{Home}');

    expect(firstTab.getAttribute('aria-selected')).toEqual('true');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toBe('false');
  });

  test('The End key moves activates the last tab', async () => {
    tablist.switchTo(1);

    secondTab.focus();
    await user.keyboard('{End}');

    expect(firstTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(thirdTab.getAttribute('aria-selected')).toEqual('true');
  });

  test('The Tab key moves focus to the active tab panel', async () => {
    tablist.switchTo(2);
    await user.keyboard('{Tab}');
    expect(document.activeElement).toEqual(thirdPanel);
  });

  test('The active tab panel is added to the tab index', () => {
    tablist.switchTo(0);
    expect(firstPanel.getAttribute('tabindex')).toEqual('0');
    expect(secondPanel.getAttribute('tabindex')).toBeNull();
    expect(thirdPanel.getAttribute('tabindex')).toBeNull();

    tablist.switchTo(2);
    expect(firstPanel.getAttribute('tabindex')).toBeNull();
    expect(secondPanel.getAttribute('tabindex')).toBeNull();
    expect(thirdPanel.getAttribute('tabindex')).toEqual('0');
  });

  test('All DOM attributes are removed from elements managed by this component', () => {
    tablist.destroy();

    Array.from(panels).forEach((panel) => expect(panel.getAttribute('tabindex')).toBeNull());
  });
});

test('ManageTabIndex: Manage target element tabindex', () => {
  expect(tablist.previousIndex).toBeNull();
  expect(tablist.activeIndex).toBe(0);

  Array.from(panels).forEach((panel, index) => {
    const firstChild = panel.querySelector('a[href]');

    if (tablist.activeIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBeNull();
    }

    if (tablist.previousIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBe('-1');
    }
  });

  tablist.activeIndex = 1;
  tablist.switchTo(2);
  expect(tablist.previousIndex).toBe(1);

  Array.from(panels).forEach((panel, index) => {
    const firstChild = panel.querySelector('a[href]');

    if (tablist.activeIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBeNull();
    }

    if (tablist.previousIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBe('-1');
    }
  });

  tablist.switchTo(0);
  expect(tablist.previousIndex).toBe(2);

  Array.from(panels).forEach((panel, index) => {
    const firstChild = panel.querySelector('a[href]');

    if (tablist.activeIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBeNull();
    }

    if (tablist.previousIndex === index) {
      expect(firstChild.getAttribute('tabindex')).toBe('-1');
    }
  });

  tablist.destroy();
  Array.from(panels).forEach((panel) => {
    const firstChild = panel.querySelector('a[href]');
    expect(firstChild.getAttribute('tabindex')).toBeNull();
  });
});

test('UseHiddenAttribute: Uses hidden attribute when tabpanel not selected', () => {
  expect(firstPanel.getAttribute('hidden')).toBeNull();
  expect(secondPanel.getAttribute('hidden')).toEqual('');
  expect(thirdPanel.getAttribute('hidden')).toEqual('');

  tablist.switchTo(2);
  expect(firstPanel.getAttribute('hidden')).toEqual('');
  expect(secondPanel.getAttribute('hidden')).toEqual('');
  expect(thirdPanel.getAttribute('hidden')).toBeNull();

  tablist.switchTo(1);
  expect(firstPanel.getAttribute('hidden')).toEqual('');
  expect(secondPanel.getAttribute('hidden')).toBeNull();
  expect(thirdPanel.getAttribute('hidden')).toEqual('');

  tablist.destroy();
  expect(firstPanel.getAttribute('hidden')).toBeNull();
  expect(secondPanel.getAttribute('hidden')).toBeNull();
  expect(thirdPanel.getAttribute('hidden')).toBeNull();
});
