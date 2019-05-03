import Popup from '../Popup';
import MenuItem from '../MenuItem';
import instanceOf from './instanceOf';

// Set up our document body
document.body.innerHTML = `
  <button>Open</button>
  <div class="wrapper" id="dropdown">
    <ul class="menu">
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </div>
`;

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const list = document.querySelector('.menu');

const popup = new Popup({ controller, target }); // eslint-disable-line no-unused-vars
const menu = new MenuItem({ menu: list }); // eslint-disable-line no-unused-vars

describe('', () => {
  it('Should be a Popup instance',
    () => {
      expect(instanceOf(controller.popup, Popup)).toBeTruthy();
    });

  it('Should be a MenuItem instance',
    () => {
      expect(instanceOf(list.menuItem, MenuItem)).toBeTruthy();
    });

  it('Should return false for a non-existant element',
    () => {
      expect(instanceOf(target.unknown, MenuItem)).toBeFalsy();
    });
});
