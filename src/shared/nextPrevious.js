function nextPrevious(key, activeDescendant, menuItems, keys) {
  const { next, previous } = keys;
  const activeIndex = menuItems.indexOf(activeDescendant);
  const menuLastIndex = menuItems.length - 1;

  // Determine the direction.
  let newIndex = (key === previous) ? activeIndex - 1 : activeIndex + 1;

  // Move to the end if we're moving to the previous child from the first child.
  if (previous === key && 0 > newIndex) {
    newIndex = menuLastIndex;
  }

  // Move to first child if we're at the end.
  if (next === key && menuLastIndex < newIndex) {
    newIndex = 0;
  }

  return menuItems[newIndex];
}

function nextPreviousFromUpDown(key, activeDescendant, menuItems) {
  return nextPrevious(
    key,
    activeDescendant,
    menuItems,
    { previous: 'ArrowUp', next: 'ArrowDown' }
  );
}

function nextPreviousFromLeftRight(key, activeDescendant, menuItems) {
  return nextPrevious(
    key,
    activeDescendant,
    menuItems,
    { previous: 'ArrowLeft', next: 'ArrowRight' }
  );
}

export {
  nextPrevious,
  nextPreviousFromUpDown,
  nextPreviousFromLeftRight,
};
