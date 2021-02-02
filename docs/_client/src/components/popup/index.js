/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import { Popup } from 'root';
import './popup.scss';

// Get the components hashed classnames.
const { button } = getClassnames(siteClassNames.popup);

// Get the elements.
const controller = document.querySelector(button);

// Create the Popup.
const popup = new Popup(controller);
