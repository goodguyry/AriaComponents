/**
 * Dialog module to use `aria-hidden` to hide outside content rather than using
 * the `aria-model` attribute.
 *
 * @param {Dialog} arg.component The Dialog component instance.
 * @param {object} arg.options   The options passed to the component instance.
 * @return {function} The cleanup function.
 */
export default function UseLegacyDialog({ component, options }) {
  let { content } = {
    /**
     * The element or elements containing a portion of the inert layer. When the
     * Dialog opens, `aria-hidden` is set to true on each element
     *
     * @type {HTMLElement|NodeList}
     */
    content: [],

    ...options,
  };

  // Get the content items if none are provided.
  if (null == content || 0 === content.length) {
    content = Array.from(document.body.children)
      .filter((child) => ! child.contains(component.target));
  } else {
    content = Array.from(content);
  }

  const contentLength = content.length;

  /**
   * Hide and unhide the inert layer when the Dialog changes state.
   */
  const handleStateChange = () => {
    for (let i = 0; i < contentLength; i += 1) {
      component.updateAttribute(content[i], 'aria-hidden', (component.expanded || null));
    }
  };

  if (0 < contentLength) {
    // Remove the `aria-modal` attribute.
    component.addAttribute(component.target, 'aria-modal', null);
    // Manage the inert layer.
    component.on('dialog.stateChange', handleStateChange);

    // Set initial attributes.
    for (let i = 0; i < contentLength; i += 1) {
      component.addAttribute(content[i], component.constructor.getUniqueId());
    }
  }

  // Clean up.
  return () => {
    for (let i = 0; i < contentLength; i += 1) {
      component.removeAttributes(content[i]);
    }
  };
}
