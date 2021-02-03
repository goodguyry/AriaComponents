/* eslint-disable max-len */
import toArray from './toArray';

// Set up our document body
document.body.innerHTML = `
  <div>
    <span class="span-1"></span>
    <span class="span-2"></span>
    <span class="span-3"></span>
  </div>
`;

const elements = document.querySelectorAll('span');
const div = document.querySelector('div');

it('Should convert an HTMLElement and NodeList to an Array', () => {
  expect(toArray(elements)).toEqual(expect.arrayContaining([elements[0], elements[1], elements[2]]));
  expect(toArray(elements[1])).toEqual(expect.arrayContaining([elements[1]]));
  expect(toArray(elements[1].classList)).toEqual(expect.arrayContaining([]));
  expect(toArray(div.children)).toEqual(expect.arrayContaining([elements[0], elements[1], elements[2]]));
});
