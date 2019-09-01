import Popup from '../Popup';
import Menu from '../Menu';
import isInstanceOf from './isInstanceOf';
// Because we're instantiating Menu.
import ariaDescribedbyTestMarkup from '../Menu/Menu.test';

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

  ${ariaDescribedbyTestMarkup}
`;

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const list = document.querySelector('.menu');

const popup = new Popup({ controller, target }); // eslint-disable-line no-unused-vars
const menu = new Menu({ menu: list }); // eslint-disable-line no-unused-vars

describe('', () => {
  it('Should be a Popup instance',
    () => {
      expect(isInstanceOf(controller.popup, Popup)).toBeTruthy();
    });

  it('Should be a Menu instance',
    () => {
      expect(isInstanceOf(list.menu, Menu)).toBeTruthy();
    });

  it('Should return false for a non-existant element',
    () => {
      expect(isInstanceOf(target.unknown, Menu)).toBeFalsy();
    });
});
