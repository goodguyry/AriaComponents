import keyCodes from './keyCodes';

function nextPrevious(keyCode, activeDescendant, menuItems, keys) {
  const { next, previous } = keys;
  const activeIndex = menuItems.indexOf(activeDescendant);
  const menuLastIndex = menuItems.length - 1;

  // Determine the direction.
  let newIndex = (keyCode === previous) ? activeIndex - 1 : activeIndex + 1;

  // Move to the end if we're moving to the previous child from the first child.
  if (previous === keyCode && 0 > newIndex) {
    newIndex = menuLastIndex;
  }

  // Move to first child if we're at the end.
  if (next === keyCode && menuLastIndex < newIndex) {
    newIndex = 0;
  }

  return menuItems[newIndex];
}

function nextPreviousFromUpDown(keyCode, activeDescendant, menuItems) {
  const { UP, DOWN } = keyCodes;
  return nextPrevious(
    keyCode,
    activeDescendant,
    menuItems,
    { previous: UP, next: DOWN }
  );
}

function nextPreviousFromLeftRight(keyCode, activeDescendant, menuItems) {
  const { LEFT, RIGHT } = keyCodes;
  return nextPrevious(
    keyCode,
    activeDescendant,
    menuItems,
    { previous: LEFT, next: RIGHT }
  );
}

export {
  nextPrevious,
  nextPreviousFromUpDown,
  nextPreviousFromLeftRight,
};
