import getClassnames from 'js/getClassnames';
import { Disclosure } from 'root';
import './disclosure.scss';

// Get the components hashed classnames.
const { button, info } = getClassnames(siteClassNames.disclosure);

// Get the elements.
const controller = document.querySelector(button);
const target = document.querySelector(info);

// Create the Disclosure.
const popup = new Disclosure({ controller, target }); // eslint-disable-line no-unused-vars
