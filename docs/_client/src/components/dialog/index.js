import getClassnames from 'js/getClassnames';
import logEventDetail from 'js/logEventDetail';
import Dialog from 'plugin/src/Dialog'; // eslint-disable-line import/no-extraneous-dependencies
import './dialog.scss';

// Get the components hashed classnames.
const { closeButton } = getClassnames(siteClassNames.dialog);

window.addEventListener('load', () => {
  // Get the elements.
  const target = document.getElementById('dialog');
  const close = document.querySelector(closeButton);

  // Report event details.
  target.addEventListener('init', logEventDetail);
  target.addEventListener('stateChange', logEventDetail);
  target.addEventListener('destroy', logEventDetail);

  // Create the Dialog.
  const dialog = new Dialog(target);
  dialog.closeButton = close;
});
