import Disclosure from '.';
import events from '../../utils/events';

const { click } = events;

// Set up our document body
document.body.innerHTML = `
  <button>Open</button>
  <div class="wrapper" id="dropdown">
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </div>
`;

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

let disclosure;

describe('Disclosure with default configuration', () => {
  beforeEach(() => {
    disclosure = new Disclosure({ controller, target });
  });

  describe('Disclosure adds and manipulates DOM element attributes', () => {
    it('Should be instantiated as expected', () => {
      expect(disclosure).toBeInstanceOf(Disclosure);

      expect(disclosure.getState().expanded).toBeFalsy();

      expect(controller.disclosure).toBeInstanceOf(Disclosure);
      expect(target.disclosure).toBeInstanceOf(Disclosure);
    });

    it('Should add the correct attributes to the disclosure controller',
      () => {
        expect(controller.getAttribute('aria-expanded')).toEqual('false');
        expect(controller.getAttribute('aria-controls')).toEqual('dropdown');
        // The test markup isn't detatched, so this doesn't apply.
        expect(controller.getAttribute('aria-own')).toBeFalsy();
      });

    it('Should add the correct attributes to the disclosure target',
      () => {
        expect(target.getAttribute('aria-hidden')).toEqual('true');
      });
  });

  describe('Disclosure correctly responds to events', () => {
    it('Should update attributes when the controller is clicked', () => {
      // Click to open.
      controller.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');

      // Click again to close.
      controller.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeFalsy();
      expect(controller.getAttribute('aria-expanded')).toEqual('false');
      expect(target.getAttribute('aria-hidden')).toEqual('true');

      // Re-open the disclosure.
      disclosure.setState({ expanded: true });
      // Should close on outside click.
      document.body.dispatchEvent(click);
      expect(disclosure.getState().expanded).toBeTruthy();
      expect(controller.getAttribute('aria-expanded')).toEqual('true');
      expect(target.getAttribute('aria-hidden')).toEqual('false');
    });
  });
});

describe('Disclosure with non-default configuration', () => {
  const onOpen = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    disclosure = new Disclosure(
      {
        controller,
        target,
        loadOpen: true,
        allowOutsideClick: false,
        onOpen,
        onClose,
      }
    );
  });

  it('Should load open', () => {
    expect(disclosure.getState().expanded).toBeTruthy();
  });

  it('Should close the disclosure on outside click', () => {
    document.body.dispatchEvent(click);
    expect(disclosure.getState().expanded).toBeFalsy();
    expect(controller.getAttribute('aria-expanded')).toEqual('false');
    expect(target.getAttribute('aria-hidden')).toEqual('true');
  });

  it('Should run subscriber functions', () => {
    disclosure.setState({ expanded: true });
    expect(onOpen).toHaveBeenCalled();

    disclosure.setState({ expanded: false });
    expect(onClose).toHaveBeenCalled();
  });
});
