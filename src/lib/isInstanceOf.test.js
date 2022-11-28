/* eslint-disable max-len */
import Popup from '../Popup';
import Menu from '../Menu';
import isInstanceOf from './isInstanceOf';

// Set up our document body
document.body.innerHTML = `
  <button aria-controls="dropdown">Open</button>
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
      expect(isInstanceOf('Popup', popup)).toBeTruthy();
    });

  it('Should be case-insensitive',
    () => {
      expect(isInstanceOf('pOpUp', popup)).toBeTruthy();
    });

  it('Should be a Menu instance',
    () => {
      expect(isInstanceOf('menu', menu)).toBeTruthy();
    });

  it('Should return false for a non-existant element',
    () => {
      expect(isInstanceOf('Menu', target.unknown)).toBeFalsy();
    });

  it('Should return false for non-aria-component object',
    () => {
      expect(isInstanceOf('Dialog', helloWorld)).toBeFalsy();
    });

  it('Should return false for nonsensical parameter values',
    () => {
      expect(isInstanceOf(4, 'whatever')).toBeFalsy();
    });
});
