/**
 * Keyboard and mouse event abstraction to simplify testing events.
 * @type {Object}
 */
const events = {
  click: (new MouseEvent('click', {})),
  keydownTab: (new KeyboardEvent('keydown', { keyCode: 9 })),
  keydownShiftTab: (new KeyboardEvent('keydown', { keyCode: 9, shiftKey: true })), // eslint-disable-line max-len
  keydownReturn: (new KeyboardEvent('keydown', { keyCode: 13 })),
  keydownEsc: (new KeyboardEvent('keydown', { keyCode: 27 })),
  keydownSpace: (new KeyboardEvent('keydown', { keyCode: 32 })),
  keydownEnd: (new KeyboardEvent('keydown', { keyCode: 35 })),
  keydownHome: (new KeyboardEvent('keydown', { keyCode: 36 })),
  keydownLeft: (new KeyboardEvent('keydown', { keyCode: 37 })),
  keydownUp: (new KeyboardEvent('keydown', { keyCode: 38 })),
  keydownRight: (new KeyboardEvent('keydown', { keyCode: 39 })),
  keydownDown: (new KeyboardEvent('keydown', { keyCode: 40 })),
};

export default events;
