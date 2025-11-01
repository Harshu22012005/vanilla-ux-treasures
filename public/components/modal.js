/**
 * Accessible Modal Dialog Component
 * Features: Focus trap, ESC to close, ARIA attributes, backdrop click to close
 */

class Modal {
  constructor(options = {}) {
    this.options = {
      id: options.id || 'modal-' + Date.now(),
      closeOnBackdrop: options.closeOnBackdrop !== false,
      closeOnEscape: options.closeOnEscape !== false,
      onOpen: options.onOpen || (() => {}),
      onClose: options.onClose || (() => {}),
      ...options
    };

    this.isOpen = false;
    this.previousActiveElement = null;
    this.focusableElements = [];
    this.modalElement = null;

    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = this.options.id;
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `${this.options.id}-title`);
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="modal-backdrop" aria-hidden="true"></div>
      <div class="modal-container">
        <div class="modal-content">
          <button class="modal-close" aria-label="Close dialog">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="modal-body"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalElement = modal;
  }

  attachEventListeners() {
    const closeBtn = this.modalElement.querySelector('.modal-close');
    const backdrop = this.modalElement.querySelector('.modal-backdrop');

    closeBtn.addEventListener('click', () => this.close());

    if (this.options.closeOnBackdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    this.modalElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  setContent(content) {
    const body = this.modalElement.querySelector('.modal-body');
    
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.innerHTML = '';
      body.appendChild(content);
    }

    this.updateFocusableElements();
    return this;
  }

  open() {
    if (this.isOpen) return;

    this.previousActiveElement = document.activeElement;
    this.isOpen = true;

    this.modalElement.style.display = 'flex';
    this.modalElement.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      this.modalElement.classList.add('modal-open');
      this.focusFirstElement();
      this.options.onOpen();
    }, 10);

    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.modalElement.classList.remove('modal-open');

    setTimeout(() => {
      this.modalElement.style.display = 'none';
      this.modalElement.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }

      this.options.onClose();
    }, 300);
  }

  updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.modalElement.querySelectorAll(focusableSelectors.join(','))
    );
  }

  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen || e.key !== 'Tab') return;

    if (this.focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  destroy() {
    if (this.modalElement) {
      this.modalElement.remove();
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Modal;
}
