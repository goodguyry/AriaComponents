/* eslint-disable max-len */
import Disclosure from '..';
import { ManageTabIndex } from '.';

// Set up our document body
document.body.innerHTML = `
  <dl>
    <dt>
      <a href="#" aria-controls="answer">What is Lorem Ipsum?</a>
    </dt>
    <dd id="answer">
      <a class="first-child" href="example.com"></a>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <a class="last-child" href="example.com"></a>
    </dd>
  </dl>
`;

const controller = document.querySelector('[aria-controls="answer"]');

const disclosure = new Disclosure(controller, { modules: [ManageTabIndex] });

test('The Disclosure target\'s interactive children are out of tab index when hidden', () => {
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  disclosure.expanded = true;
  expect(disclosure.expanded).toBe(true);
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });

  disclosure.expanded = false;
  expect(disclosure.expanded).toBe(false);
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toEqual('-1');
  });

  disclosure.destroy();
  disclosure.interactiveChildElements.forEach((link) => {
    expect(link.getAttribute('tabindex')).toBeNull();
  });
});
