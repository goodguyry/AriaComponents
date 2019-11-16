import getClassnames from 'js/getClassnames';
import { MenuButton } from 'root';
import './menubutton.scss';

// Get the components hashed classnames.
const {
  button,
  'menu-wrapper': menuWrapper,
  menu,
} = getClassnames(siteClassNames.menubutton);

// Get the elements.
const controller = document.querySelector(button);
const target = document.querySelector(menuWrapper);
const list = document.querySelector(menu);

// Create the MenuButton.
// eslint-disable-next-line no-unused-vars
const menuButton = new MenuButton({
  controller,
  target,
  list,
});
