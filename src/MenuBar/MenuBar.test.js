/* eslint-disable max-len */
import { MenuBar, Menu } from '../..';

document.body.innerHTML = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menubar">
      <li>
        <button aria-controls="first-popup" class="first-item">Fruit</button>
        <ul id="first-popup" class="sublist1">
          <li><a class="sublist1-first-item" href="example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="example.com">Cake</a></li>
      <li>
        <svg><use href="my-icon"></use></svg>
        <a aria-controls="second-popup" class="third-item" href="example.com">Vegetables</a>
        <div id="second-popup" class="not-a-list">
          <ul class="sublist2">
            <li><a class="sublist2-first-item" href="example.com">Carrots</a></li>
            <li><a class="sublist2-second-item" href="example.com">Broccoli</a></li>
            <li><a class="sublist2-third-item" href="example.com">Brussel Sprouts</a></li>
            <li><a class="sublist2-last-item" href="example.com">Asparagus</a></li>
          </ul>
        </div>
      </li>
      <li><a class="fourth-item" href="example.com">Pie</a></li>
      <li><a class="last-item" href="example.com">Ice Cream</a></li>
      <li><a class="exclude" href="example.com">Something Gross</a></li>
    </ul>
  </nav>
`;

const list = document.querySelector('.menubar');
const menuBar = new MenuBar(list, { quiet: true });

it('Do not use MenuBar; use Menu.', () => {
  expect(menuBar).toBeInstanceOf(Menu);
  expect(menuBar.toString()).toEqual('[object Menu]');
});
