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
menuList.addEventListener('stateChange', logEventDetail);
menuList.addEventListener('destroy', logEventDetail);

// Create the Menu.
const menu = new Menu(menuList);
