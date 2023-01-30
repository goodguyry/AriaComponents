/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import Tablist, { AutomaticActivation } from 'plugin/src/Tablist'; // eslint-disable-line import/no-extraneous-dependencies
import './tablist.scss';

// Get the components hashed classnames.
const { list } = getClassnames(siteClassNames.tablist);

// Get the elements.
const tabs = document.querySelector(list);

// Create the Tablist.
const tablist = new Tablist(tabs, { modules: AutomaticActivation });

// Report event details.
tabs.addEventListener('init', logEventDetail);
tabs.addEventListener('stateChange', logEventDetail);
tabs.addEventListener('destroy', logEventDetail);

window.addEventListener('load', tablistHashCheck);
window.addEventListener('hashchange', tablistHashCheck);

/**
 * Check for a hash in the URL and activate the corresponding tab.
 */
function tablistHashCheck() {
  const hash = window.location.hash.replace('#', '');
  const el = document.getElementById(hash);

  if (null !== el && el.tablist instanceof Tablist) {
    const index = tablist.panels.indexOf(el);

    if (-1 < index) {
      tablist.switchTo(index);
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
