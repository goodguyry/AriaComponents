import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import { Dialog } from 'plugin'; // eslint-disable-line import/no-extraneous-dependencies
import './dialog.scss';

// Get the components hashed classnames.
const { link, closeButton } = getClassnames(siteClassNames.dialog);

window.addEventListener('load', () => {
  // Get the elements.
  const controller = document.querySelector(link);
  const close = document.querySelector(closeButton);

  // Report event details.
  controller.addEventListener('init', logEventDetail);
  controller.addEventListener('stateChange', logEventDetail);
  controller.addEventListener('destroy', logEventDetail);

  // Create the Dialog.
  const dialog = new Dialog(controller);
  close.addEventListener('click', dialog.hide);
});
