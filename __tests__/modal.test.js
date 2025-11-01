/**
 * @jest-environment jsdom
 */

const Modal = require('../public/components/modal.js');

describe('Modal Component', () => {
  let modal;

  beforeEach(() => {
    document.body.innerHTML = '';
    modal = new Modal({
      id: 'test-modal',
      closeOnBackdrop: true,
      closeOnEscape: true
    });
  });

  afterEach(() => {
    if (modal) {
      modal.destroy();
    }
  });

  test('should create modal element in DOM', () => {
    const modalElement = document.getElementById('test-modal');
    expect(modalElement).toBeTruthy();
    expect(modalElement.getAttribute('role')).toBe('dialog');
    expect(modalElement.getAttribute('aria-modal')).toBe('true');
  });

  test('should set content correctly', () => {
    const testContent = '<p>Test Content</p>';
    modal.setContent(testContent);
    
    const body = modal.modalElement.querySelector('.modal-body');
    expect(body.innerHTML).toBe(testContent);
  });

  test('should open and close modal', (done) => {
    modal.open();
    expect(modal.isOpen).toBe(true);
    expect(modal.modalElement.style.display).toBe('flex');
    expect(modal.modalElement.getAttribute('aria-hidden')).toBe('false');

    modal.close();
    expect(modal.isOpen).toBe(false);

    setTimeout(() => {
      expect(modal.modalElement.style.display).toBe('none');
      expect(modal.modalElement.getAttribute('aria-hidden')).toBe('true');
      done();
    }, 350);
  });

  test('should call onOpen and onClose callbacks', (done) => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const callbackModal = new Modal({
      id: 'callback-modal',
      onOpen,
      onClose
    });

    callbackModal.open();
    
    setTimeout(() => {
      expect(onOpen).toHaveBeenCalled();
      callbackModal.close();
      
      setTimeout(() => {
        expect(onClose).toHaveBeenCalled();
        callbackModal.destroy();
        done();
      }, 350);
    }, 50);
  });

  test('should restore focus to previous element on close', (done) => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    modal.setContent('<button id="modal-btn">Modal Button</button>');
    modal.open();

    setTimeout(() => {
      modal.close();
      
      setTimeout(() => {
        expect(document.activeElement).toBe(button);
        done();
      }, 350);
    }, 50);
  });

  test('should trap focus within modal', (done) => {
    modal.setContent(`
      <button id="btn1">Button 1</button>
      <button id="btn2">Button 2</button>
    `);
    modal.open();

    setTimeout(() => {
      const focusableElements = modal.focusableElements;
      expect(focusableElements.length).toBeGreaterThan(0);
      done();
    }, 50);
  });

  test('should prevent body scroll when open', () => {
    modal.open();
    expect(document.body.style.overflow).toBe('hidden');
    
    modal.close();
    setTimeout(() => {
      expect(document.body.style.overflow).toBe('');
    }, 350);
  });
});
