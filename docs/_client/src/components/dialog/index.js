import getClassnames from 'js/getClassnames';
import { Dialog } from 'root';
import './dialog.scss';

// Get the components hashed classnames.
const { link, closeButton } = getClassnames(siteClassNames.dialog);

window.addEventListener('load', () => {
  // Get the elements.
  const controller = document.querySelector(link);
  const target = document.getElementById('dialog');
  const close = document.querySelector(closeButton);
  const content = document.querySelector('.site');

  // Create the Dialog.
  const dialog = new Dialog({ // eslint-disable-line no-unused-vars
    controller,
    target,
    close,
    content,
  });
});
