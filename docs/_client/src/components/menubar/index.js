/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { MenuBar } from 'root';
import './menubar.scss';

// Get the components hashed classnames.
const { list } = getClassnames(siteClassNames.menubar);

// Get the elements.
const menuBarList = document.querySelector(list);

// Report event details.
menuBarList.addEventListener('init', logEventDetail);
menuBarList.addEventListener('stateChange', logEventDetail);
menuBarList.addEventListener('destroy', logEventDetail);

// Create the MenuBar.
const menuBar = new MenuBar(menuBarList);
