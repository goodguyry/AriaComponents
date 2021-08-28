/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { Menu } from 'plugin'; // eslint-disable-line import/no-extraneous-dependencies
import './menu.scss';

// Get the components hashed classnames.
const { list } = getClassnames(siteClassNames.menu);

// Get the elements.
const menuList = document.querySelector(list);

// Report event details.
menuList.addEventListener('init', logEventDetail);
menuList.addEventListener('beforeStateChange', logEventDetail);
menuList.addEventListener('stateChange', logEventDetail);
menuList.addEventListener('destroy', logEventDetail);

// Create the Menu.
// Alteratively pass `{ collapse: true }` to collapse submenus as Disclosures.
const menu = new Menu(menuList, /* { collapse: true } */);
