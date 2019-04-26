/**
 * Keyboard and mouse event abstraction to simplify testing events.
 * @type {Object}
 */
const events = {
  click: (
    new MouseEvent(
      'click',
      { bubbles: true }
    )
  ),
  keydownTab: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 9, bubbles: true }
    )
  ),
  keydownShiftTab: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 9, shiftKey: true, bubbles: true }
    )
  ),
  keydownReturn: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 13, bubbles: true }
    )
  ),
  keydownEsc: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 27, bubbles: true }
    )
  ),
  keydownSpace: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 32, bubbles: true }
    )
  ),
  keydownEnd: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 35, bubbles: true }
    )
  ),
  keydownHome: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 36, bubbles: true }
    )
  ),
  keydownLeft: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 37, bubbles: true }
    )
  ),
  keydownUp: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 38, bubbles: true }
    )
  ),
  keydownRight: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 39, bubbles: true }
    )
  ),
  keydownDown: (
    new KeyboardEvent(
      'keydown',
      { keyCode: 40, bubbles: true }
    )
  ),
};

export default events;
