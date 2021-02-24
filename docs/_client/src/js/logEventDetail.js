/* eslint-disable no-console */

/**
 * Log the event detail object from Custom Events.
 *
 * @param {Event} event The event object.
 */
const logEventDetail = (event) => console.info(event.detail, `${event.type}`);

export default logEventDetail;
