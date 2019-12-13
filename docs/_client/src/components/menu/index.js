import getClassnames from 'js/getClassnames';
import { Menu } from 'root';
import './menu.scss';

// Get the components hashed classnames.
const { list } = getClassnames(siteClassNames.menu);

// Get the elements.
const menuList = document.querySelector(list);

// Create the Menu.
const menu = new Menu({ list: menuList }); // eslint-disable-line no-unused-vars
