/* eslint-disable no-unused-vars */
import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { Disclosure } from 'plugin'; // eslint-disable-line import/no-extraneous-dependencies
import './disclosure.scss';

// Get the components hashed classnames.
const { button, info } = getClassnames(siteClassNames.disclosure);

// Get the elements.
const controllers = document.querySelectorAll(button);

// Create the Disclosures.
const disclosures = Array.from(controllers).map((controller) => {
  // Report event details.
  controller.addEventListener('init', logEventDetail);
  controller.addEventListener('stateChange', logEventDetail);
  controller.addEventListener('destroy', logEventDetail);

  return new Disclosure(controller);
});

window.addEventListener('load', disclosureHashCheck);
window.addEventListener('hashchange', disclosureHashCheck);

/**
 * Check for a hash in the URL and open the corresponding disclosure.
 */
function disclosureHashCheck() {
  const hash = window.location.hash.replace('#', '');
  const el = document.getElementById(hash);

  if (null !== el && el.disclosure instanceof Disclosure) {
    const { disclosure } = el;
    disclosure.open();
    disclosure.controller.scrollIntoView({ behavior: 'smooth' });
  }
}
