import getClassnames from 'js/getClassnames';
import { Disclosure } from 'root';
import './disclosure.scss';

// Get the components hashed classnames.
const { button, info } = getClassnames(siteClassNames.disclosure);

// Get the elements.
const controllers = document.querySelectorAll(button);
const targets = document.querySelectorAll(info);

// Create the Disclosures.
if (controllers.length === targets.length) {
  // eslint-disable-next-line no-unused-vars
  const maps = Array.prototype.map.call(controllers, (controller, index) => (
    new Disclosure({ controller, target: targets[index] })
  ));
}
