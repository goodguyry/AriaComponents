/**
 * Get the event detail object from the latest call.
 *
 * @param  {function} handler The event callback.
 * @return {object}
 */
global.getEventDetails = (handler) => {
  const callIndex = (handler.mock.calls.length - 1);

  if (0 > callIndex) {
    return {};
  }

  return handler.mock.calls[callIndex][0];
};
