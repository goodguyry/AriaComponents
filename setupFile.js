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

const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  // Optionally add a trigger() method to manually trigger a change
  this.trigger = (mockedMutationsList) => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;
