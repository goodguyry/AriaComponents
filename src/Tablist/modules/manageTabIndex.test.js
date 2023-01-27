/* eslint-disable max-len */
import Tablist from '..';
import { ManageTabIndex } from '.';
import { events } from '../../../.jest/events';

const {
  keydownTab,
  keydownArrowLeft,
  keydownArrowRight,
  keydownArrowDown,
  keydownHome,
  keydownEnd,
} = events;

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

const tablist = new Tablist(tabs, { modules: [ManageTabIndex] });


test('The Tablist target\'s interactive children are out of tab index when hidden', () => {
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

  Array.from(panels).forEach((panel, index) => {
    const firstChild = panel.querySelector('a[href]');
    expect(firstChild.getAttribute('tabindex')).toBeNull();
  });
});
