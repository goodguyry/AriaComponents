/* eslint-disable max-len */
import user from '@/.jest/user';
import Menu from '.';
import Tablist, {
  UseKeyboardSupport,
} from '.';

const menuMarkup = `
  <nav class="nav" aria-label="Menu Class Example">
    <ul class="menu">
      <li id="first">
        <button class="first-item">Fruit</button>
        <ul id="first-disclosure" class="sublist1">
          <li><a class="sublist1-first-item" href="#example.com">Apples</a></li>
          <li><a class="sublist1-second-item" href="#example.com">Bananas</a></li>
          <li><a class="sublist1-last-item" href="#example.com">Cantaloupe</a></li>
        </ul>
      </li>
      <li><a class="second-item" href="#example.com">Cake</a></li>
      <li id="third">
        <svg><use href="my-icon"></use></svg>
        <a aria-controls="second-disclosure" class="third-item" href="#example.com">Vegetables</a>
        <ul id="second-disclosure" class="sublist2">
          <li><a class="sublist2-first-item" href="#example.com">Carrots</a></li>
          <li><a class="sublist2-second-item" href="#example.com">Broccoli</a></li>
          <li><a class="sublist2-third-item" href="#example.com">Brussel Sprouts</a></li>
          <li><a class="sublist2-last-item" href="#example.com">Asparagus</a></li>
        </ul>
      </li>
      <li><a class="fourth-item" href="#example.com">Pie</a></li>
      <li><a class="last-item" href="#example.com" aria-current="page">Ice Cream</a></li>
    </ul>
  </nav>
`;

// Set up our document body
document.body.innerHTML = menuMarkup;

// Collect references to DOM elements.
const list = document.querySelector('.menu');

// Top-level items.
const firstController = document.querySelector('.first-item');
const topLevelSecondItem = document.querySelector('.second-item');
const secondController = document.querySelector('.third-item');
const topLevelFourthItem = document.querySelector('.fourth-item');
const topLevelLastItem = document.querySelector('.last-item');

const firstTarget = document.querySelector('.sublist1');
const firstTargetFirstItem = document.querySelector('.sublist1-first-item');
const firstTargetSecondItem = document.querySelector('.sublist1-second-item');
const firstTargetLastItem = document.querySelector('.sublist1-last-item');

const secondTarget = document.querySelector('.sublist2');
const secondTargetFirstItem = document.querySelector('.sublist2-first-item');
const secondTargetSecondItem = document.querySelector('.sublist2-second-item');
const secondTargetThirdItem = document.querySelector('.sublist2-third-item');
const secondTargetLastItem = document.querySelector('.sublist2-last-item');

// Mock functions.
const onInit = jest.fn();
const onStateChange = jest.fn();
const onDestroy = jest.fn();

// The `init` event is not trackable via on/off.
list.addEventListener('menu.init', onInit);

test('UseKeyboardSupport: Add support for arrow, Home, and End keys', async () => {
  const menu = new Menu(list, { modules: UseKeyboardSupport });

  // Down Arrow or
  // Right Arrow
  // If focus is on a button and its dropdown is collapsed, and it is not the last button, moves focus to the next button.

  firstController.focus();
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(topLevelSecondItem);

  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toEqual(secondController);

  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(topLevelFourthItem);

  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toEqual(topLevelLastItem);

  // No cycle.
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(topLevelLastItem);

  // Up Arrow or
  // Left Arrow
  // If focus is on a button, and it is not the first button, moves focus to the previous button.

  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toEqual(topLevelFourthItem);

  await user.keyboard('{ArrowLeft}');
  expect(document.activeElement).toEqual(secondController);

  await user.keyboard('{ArrowLeft}');
  expect(document.activeElement).toEqual(topLevelSecondItem);

  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toEqual(firstController);

  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(firstController);

  // End
  // If focus is on a button, and it is not the last button, moves focus to the last button.

  await user.keyboard('{End}');
  expect(document.activeElement).toEqual(topLevelLastItem);

  // Home
  // If focus is on a button, and it is not the first button, moves focus to the first button.

  // topLevelFourthItem.focus();
  await user.keyboard('{Home}');
  expect(document.activeElement).toEqual(firstController);

  // if focus is on a button and its dropdown is expanded, moves focus to the first link in the dropdown.
  menu.activeDisclosure = firstController.id;
  // firstController.focus();
  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toEqual(firstTargetFirstItem);

  // If focus is on a link, and it is not the last link, moves focus to the next link.
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(firstTargetSecondItem);

  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(firstTargetLastItem);

  // It is the last item, so nothing happens.
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toEqual(firstTargetLastItem);

  // If focus is on a link, and it is not the first link, moves focus to the previous link.

  menu.activeDisclosure = secondController.id;
  secondTargetThirdItem.focus();
  await user.keyboard('{ArrowLeft}');
  expect(document.activeElement).toEqual(secondTargetSecondItem);

  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toEqual(secondTargetFirstItem);

  // It is the first link, so nothing happens.
  await user.keyboard('{ArrowLeft}');
  expect(document.activeElement).toEqual(secondTargetFirstItem);

  // If focus is on a link, and it is not the first link, moves focus to the first link.

  // secondTargetThirdItem.focus();
  await user.keyboard('{Home}');
  expect(document.activeElement).toEqual(secondTargetFirstItem);

  // If focus is on a link, and it is not the last link, moves focus to the last link.

  // firstTargetFirstItem.focus();
  await user.keyboard('{End}');
  expect(document.activeElement).toEqual(secondTargetLastItem);
});
