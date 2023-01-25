/* eslint-disable max-len */
import Disclosure from '..';
import { UseHiddenAttribute } from '.';

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
const target = document.querySelector('#answer');

// With `loadOpen` enabled.
const disclosure = new Disclosure(controller, { loadOpen: true, extensions: [UseHiddenAttribute] });

test('The hidden attribute is added and removed after state changes', () => {
  expect(disclosure.expanded).toBe(true);
  expect(target.getAttribute('hidden')).toBeNull();

  disclosure.expanded = false;
  expect(disclosure.expanded).toBe(false);
  expect(target.getAttribute('hidden')).toBe('');

  disclosure.expanded = true;
  expect(disclosure.expanded).toBe(true);
  expect(target.getAttribute('hidden')).toBeNull();

  disclosure.destroy();
  expect(target.getAttribute('hidden')).toBeNull();
  });
