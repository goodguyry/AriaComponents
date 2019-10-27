import getClassnames from 'js/getClassnames';
import { MenuButton } from 'root';
import './menubutton.scss';

// Get the components hashed classnames.
const {
  button,
  'menu-wrapper': menuWrapper,
  list,
} = getClassnames(siteClassNames.menubutton);

// Get the elements.
const controller = document.querySelector(button);
const target = document.querySelector(menuWrapper);
const menuList = document.querySelector(list);

// Create the Menu.
// eslint-disable-next-line no-unused-vars
const menu = new MenuButton({
  controller,
  target,
  menu: menuList,
});
