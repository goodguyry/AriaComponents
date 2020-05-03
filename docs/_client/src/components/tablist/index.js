import getClassnames from 'js/getClassnames';
import { Tablist } from 'root';
import './tablist.scss';

// Get the components hashed classnames.
const { list, panel } = getClassnames(siteClassNames.tablist);

// Get the elements.
const tabs = document.querySelector(list);
const panels = document.querySelectorAll(panel);

// Create the Tablist.
const tablist = new Tablist({ // eslint-disable-line no-unused-vars
  tabs,
  panels,
});

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
