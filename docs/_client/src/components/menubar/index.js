import getClassnames from 'js/getClassnames';
import { MenuBar } from 'root';
import './menubar.scss';

// Get the components hashed classnames.
const { list } = getClassnames(siteClassNames.menubar);

// Get the elements.
const menuBarList = document.querySelector(list);

// Create the MenuBar.
const menuBar = new MenuBar({ list: menuBarList }); // eslint-disable-line no-unused-vars
