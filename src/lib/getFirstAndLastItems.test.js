import getFirstAndLastItems from './getFirstAndLastItems';

// Set up our document body
document.body.innerHTML = `
  <div class="first"></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div class="last"></div>
`;

describe('Should get the first and last items', () => {
  it('From an Array',
    () => {
      const testArray = ['first', 'hello', 'world', 'last'];
      const firstLast = getFirstAndLastItems(testArray);

      expect(firstLast).toEqual(['first', 'last']);
    });

  it('From a NodeList',
    () => {
      const nodeList = document.querySelectorAll('div');
      const firstLast = getFirstAndLastItems(nodeList);
      // Expected.
      const domFirst = document.querySelector('.first');
      const domLast = document.querySelector('.last');

      expect(firstLast).toEqual([domFirst, domLast]);
    });

  it('From a single-item Array',
    () => {
      const testArray = ['only'];
      const firstLast = getFirstAndLastItems(testArray);

      expect(firstLast).toEqual(['only', 'only']);
    });

  it('From a single-item NodeList',
    () => {
      const nodeList = document.querySelectorAll('.first');
      const firstLast = getFirstAndLastItems(nodeList);

      const expected = nodeList[0];

      expect(firstLast).toEqual([expected, expected]);
    });
});
