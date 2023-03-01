import { interactiveChildren, hasInteractiveChildren } from './interactiveChildren';

describe('Collects interactive child elements', () => {
  // Set up our document body
  document.body.innerHTML = `
    <div class="wrapper">
      <a>Fake with no HREF</a>
      <input disabled>
      <select disabled>
        <opiton>You have one option</option>
      </select>
      <textarea disabled></textarea>
      <button type="submit" disabled>Click me</button>
      <div tabindex="-1">Nope</div>
    </div>
  `;

  const wrapper = document.querySelector('.wrapper');

  it('Should not match any elements', () => {
    const interactiveChildElements = interactiveChildren(wrapper);

    expect(interactiveChildElements).toEqual([]);
  });

  it('Should return false', () => {
    expect(hasInteractiveChildren(wrapper)).toBe(false);
    expect(hasInteractiveChildren(wrapper, 'button,textarea')).toBe(true);
  });
});
