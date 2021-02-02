/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import { Listbox } from 'root';
import './listbox.scss';

// Get the components hashed classnames.
const { button } = getClassnames(siteClassNames.listbox);

// Get the elements.
const controller = document.querySelector(button);

// Create the Listbox.
const listbox = new Listbox(controller);
