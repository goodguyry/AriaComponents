/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { Popup } from 'plugin'; // eslint-disable-line import/no-extraneous-dependencies
import './popup.scss';

// Get the components hashed classnames.
const { button } = getClassnames(siteClassNames.popup);

// Get the elements.
const controller = document.querySelector(button);

// Report event details.
controller.addEventListener('init', logEventDetail);
controller.addEventListener('beforeStateChange', logEventDetail);
controller.addEventListener('stateChange', logEventDetail);
controller.addEventListener('destroy', logEventDetail);

// Create the Popup.
const popup = new Popup(controller);
popup.init();
