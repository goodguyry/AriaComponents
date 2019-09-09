import getClassnames from 'js/getClassnames';
import { Tablist } from 'root';
import './tablist.scss';

// Get the components hashed classnames.
const { list, panel } = getClassnames(siteClassNames.tablist);

// Get the elements.
const tabs = document.querySelector(list);
const panels = document.querySelectorAll(panel);

const tablist = new Tablist({ // eslint-disable-line no-unused-vars
  tablist: tabs,
  panels,
});
