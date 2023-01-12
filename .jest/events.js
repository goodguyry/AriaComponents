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
      { key: 'Tab', bubbles: true }
    )
  ),
  keydownShiftTab: (
    new KeyboardEvent(
      'keydown',
      { key: 'Tab', shiftKey: true, bubbles: true }
    )
  ),
  keydownEnter: (
    new KeyboardEvent(
      'keydown',
      { key: 'Enter', bubbles: true }
    )
  ),
  keydownEscape: (
    new KeyboardEvent(
      'keydown',
      { key: 'Escape', bubbles: true }
    )
  ),
  keydownSpace: (
    new KeyboardEvent(
      'keydown',
      { key: ' ', bubbles: true }
    )
  ),
  keydownEnd: (
    new KeyboardEvent(
      'keydown',
      { key: 'End', bubbles: true }
    )
  ),
  keydownHome: (
    new KeyboardEvent(
      'keydown',
      { key: 'Home', bubbles: true }
    )
  ),
  keydownArrowLeft: (
    new KeyboardEvent(
      'keydown',
      { key: 'ArrowLeft', bubbles: true }
    )
  ),
  keydownArrowUp: (
    new KeyboardEvent(
      'keydown',
      { key: 'ArrowUp', bubbles: true }
    )
  ),
  keyupArrowUp: (
    new KeyboardEvent(
      'keyup',
      { key: 'ArrowUp', bubbles: true }
    )
  ),
  keydownArrowRight: (
    new KeyboardEvent(
      'keydown',
      { key: 'ArrowRight', bubbles: true }
    )
  ),
  keydownArrowDown: (
    new KeyboardEvent(
      'keydown',
      { key: 'ArrowDown', bubbles: true }
    )
  ),
  keyupArrowDown: (
    new KeyboardEvent(
      'keyup',
      { key: 'ArrowDown', bubbles: true }
    )
  ),
};

/**
 * Create a KeyboardEvent for typing a character.
 *
 * @param  {string} character The character to type.
 * @return {KeyboardEvent}
 */
function typeCharacter(character) {
  return new KeyboardEvent(
    'keydown',
    { key: character.charCodeAt(), bubbles: true }
  );
}

export {
  events,
  typeCharacter,
};
