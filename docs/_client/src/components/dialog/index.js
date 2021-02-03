import getClassnames from 'js/getClassnames';
import { Dialog } from 'root';
import './dialog.scss';

// Get the components hashed classnames.
const { link, closeButton } = getClassnames(siteClassNames.dialog);

window.addEventListener('load', () => {
  // Get the elements.
  const controller = document.querySelector(link);
  const close = document.querySelector(closeButton);

  // Create the Dialog.
  const dialog = new Dialog(controller);
  close.addEventListener('click', dialog.hide);
});
