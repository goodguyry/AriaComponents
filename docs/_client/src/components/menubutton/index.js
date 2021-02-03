/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import { MenuButton } from 'root';
import './menubutton.scss';

// Get the components hashed classnames.
const { button } = getClassnames(siteClassNames.menubutton);

// Get the elements.
const controller = document.querySelector(button);

// Create the MenuButton.
const menuButton = new MenuButton(controller);
