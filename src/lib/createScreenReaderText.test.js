import createScreenReaderText from './createScreenReaderText';

describe('Creates the expected HTMLElement', () => {
  it('Return an HTML element with the expected ID and innerText', () => {
    const element = createScreenReaderText(
      'testing-id',
      'Here is some text.'
    );

    expect(element instanceof HTMLElement).toBeTruthy();
    expect(element.id).toEqual('testing-id');
    expect(element.innerText).toEqual('Here is some text.');
  });
});
