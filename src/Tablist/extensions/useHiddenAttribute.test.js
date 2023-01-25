/* eslint-disable max-len */
import Tablist from '..';
import { UseHiddenAttribute } from '.';
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

const tablist = new Tablist(tabs, { extensions: [UseHiddenAttribute] });

test('Panels initialize with expected tabindex', () => {
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
