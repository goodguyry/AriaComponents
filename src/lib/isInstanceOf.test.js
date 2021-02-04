/* eslint-disable max-len */
import Popup from 'root/src/Popup';
import Menu from 'root/src/Menu';
import isInstanceOf from './isInstanceOf';

// Set up our document body
document.body.innerHTML = `
  <button target="dropdown">Open</button>
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

const popup = new Popup(controller);
const menu = new Menu(list);

const helloWorld = { hello: 'world' };

describe('Should return whether a given object is an instance of a class', () => {
  it('Should be a Popup instance',
    () => {
      expect(isInstanceOf(popup, 'Popup')).toBeTruthy();
    });

  it('Should be case-insensitive',
    () => {
      expect(isInstanceOf(popup, 'pOpUp')).toBeTruthy();
    });

  it('Should be a Menu instance',
    () => {
      expect(isInstanceOf(menu, 'menu')).toBeTruthy();
    });

  it('Should return false for a non-existant element',
    () => {
      expect(isInstanceOf(target.unknown, 'Menu')).toBeFalsy();
    });

  it('Should return false for non-aria-component object',
    () => {
      expect(isInstanceOf(helloWorld, 'Dialog')).toBeFalsy();
    });
});
