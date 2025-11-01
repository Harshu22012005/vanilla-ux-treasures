/**
 * Accessible Tabbed Content Component
 * Features: Keyboard arrow navigation, ARIA attributes, automatic/manual activation
 */

class Tabs {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error('Tabs requires a container element');
    }

    this.container = element;
    this.options = {
      defaultTab: options.defaultTab || 0,
      orientation: options.orientation || 'horizontal',
      activation: options.activation || 'automatic', // 'automatic' or 'manual'
      onChange: options.onChange || (() => {}),
      ...options
    };

    this.tabList = null;
    this.tabs = [];
    this.panels = [];
    this.currentIndex = this.options.defaultTab;

    this.init();
  }

  init() {
    this.setupStructure();
    this.attachEventListeners();
    this.activateTab(this.currentIndex);
  }

  setupStructure() {
    this.tabList = this.container.querySelector('[role="tablist"]');
    
    if (!this.tabList) {
      console.error('Tabs requires an element with role="tablist"');
      return;
    }

    this.tabList.setAttribute('aria-orientation', this.options.orientation);

    this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(
      this.container.querySelectorAll('[role="tabpanel"]')
    );

    this.tabs.forEach((tab, index) => {
      const panelId = this.panels[index]?.id || `panel-${index}`;
      this.panels[index].id = panelId;

      tab.setAttribute('aria-controls', panelId);
      tab.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
      tab.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');

      this.panels[index].setAttribute('aria-labelledby', tab.id || `tab-${index}`);
      this.panels[index].setAttribute('tabindex', '0');
    });
  }

  attachEventListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.activateTab(index);
      });

      tab.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
    });
  }

  handleKeyDown(e, currentIndex) {
    const isHorizontal = this.options.orientation === 'horizontal';
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'ArrowUp':
        if (!isHorizontal) {
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        }
        break;
      case 'ArrowDown':
        if (!isHorizontal) {
          e.preventDefault();
          newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    this.tabs[newIndex].focus();

    if (this.options.activation === 'automatic') {
      this.activateTab(newIndex);
    }
  }

  activateTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Deactivate all tabs
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      tab.classList.remove('active');
    });

    this.panels.forEach((panel) => {
      panel.hidden = true;
    });

    // Activate selected tab
    this.tabs[index].setAttribute('aria-selected', 'true');
    this.tabs[index].setAttribute('tabindex', '0');
    this.tabs[index].classList.add('active');
    this.panels[index].hidden = false;

    this.currentIndex = index;
    this.options.onChange(index);
  }

  getActiveTab() {
    return this.currentIndex;
  }

  destroy() {
    this.tabs.forEach((tab) => {
      tab.replaceWith(tab.cloneNode(true));
    });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Tabs;
}
