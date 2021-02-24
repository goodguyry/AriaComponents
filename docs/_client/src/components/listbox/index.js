/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { Listbox } from 'root';
import './listbox.scss';

// Get the components hashed classnames.
const { button } = getClassnames(siteClassNames.listbox);

// Get the elements.
const controller = document.querySelector(button);

// Report event details.
controller.addEventListener('init', logEventDetail);
controller.addEventListener('stateChange', logEventDetail);
controller.addEventListener('destroy', logEventDetail);

// Create the Listbox.
const listbox = new Listbox(controller);
