import Search from './Search';
import { typeCharacter } from './events';

// Set up our document body
document.body.innerHTML = `
  <ul>
    <li>Anchorage</li>
    <li>Baltimore</li>
    <li>Chicago</li>
    <li>Dallas</li>
    <li>El Paso</li>
    <li>Fort Lauderdale</li>
    <li>Grand Rapids</li>
    <li>Hartford</li>
    <li>Idaho Falls</li>
  </ul>
`;

const listItems = document.querySelectorAll('li');
const list = document.querySelector('ul');

jest.useFakeTimers();

describe('Find the search string', () => {
  test.each([
    ['NodeList', listItems],
    ['Array of list items', Array.from(listItems)],
    ['HTML UL Element', list],
  ])(
    'Search for typed string within: %s',
    (name, input) => {
      const search = new Search(input);
      let found = null;
      document.addEventListener('keydown', (event) => {
        found = search.getItem(event.keyCode);
      });

      // Typing 'El Paso'
      document.dispatchEvent(typeCharacter('e'));
      document.dispatchEvent(typeCharacter('l'));

      expect(found).toEqual(list.children[4]);

      // Advance the timer to clear the search string.
      jest.advanceTimersByTime(500);
      expect(search.clearSearch).toBeNull();
      expect(search.searchString).toEqual('');

      // Typing 'Hartford'
      document.dispatchEvent(typeCharacter('h'));
      document.dispatchEvent(typeCharacter('a'));

      expect(found).toEqual(list.children[7]);
    }
  );

  test.each([
    ['Single list item', list.children[4]],
    ['Null', document.querySelector('.fake-classname')],
  ])(
    'Should fail with bad input: %s',
    (name, input) => {
      const search = new Search(input);
      let found = null;
      document.addEventListener('keydown', (event) => {
        found = search.getItem(event.keyCode);
      });

      // Typing 'El Paso'
      document.dispatchEvent(typeCharacter('e'));
      document.dispatchEvent(typeCharacter('l'));

      expect(found).toBeNull();
    }
  );
});
