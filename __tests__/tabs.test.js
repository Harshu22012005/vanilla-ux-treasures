/**
 * @jest-environment jsdom
 */

const Tabs = require('../public/components/tabs.js');

describe('Tabs Component', () => {
  let container;
  let tabs;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tabs-container">
        <div role="tablist">
          <button role="tab" id="tab-1">Tab 1</button>
          <button role="tab" id="tab-2">Tab 2</button>
          <button role="tab" id="tab-3">Tab 3</button>
        </div>
        <div role="tabpanel" id="panel-1">Content 1</div>
        <div role="tabpanel" id="panel-2">Content 2</div>
        <div role="tabpanel" id="panel-3">Content 3</div>
      </div>
    `;
    
    container = document.getElementById('tabs-container');
    tabs = new Tabs(container, {
      defaultTab: 0
    });
  });

  afterEach(() => {
    if (tabs) {
      tabs.destroy();
    }
  });

  test('should initialize with correct ARIA attributes', () => {
    const tabElements = container.querySelectorAll('[role="tab"]');
    
    expect(tabElements[0].getAttribute('aria-selected')).toBe('true');
    expect(tabElements[0].getAttribute('tabindex')).toBe('0');
    
    expect(tabElements[1].getAttribute('aria-selected')).toBe('false');
    expect(tabElements[1].getAttribute('tabindex')).toBe('-1');
  });

  test('should activate correct tab on initialization', () => {
    expect(tabs.currentIndex).toBe(0);
    
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(true);
  });

  test('should switch tabs on click', () => {
    const tabElements = container.querySelectorAll('[role="tab"]');
    
    tabElements[1].click();
    
    expect(tabs.currentIndex).toBe(1);
    expect(tabElements[1].getAttribute('aria-selected')).toBe('true');
    
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
  });

  test('should navigate with arrow keys (horizontal)', () => {
    const tabElements = container.querySelectorAll('[role="tab"]');
    
    // Right arrow
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    tabElements[0].dispatchEvent(rightEvent);
    
    expect(tabs.currentIndex).toBe(1);
    
    // Left arrow
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    tabElements[1].dispatchEvent(leftEvent);
    
    expect(tabs.currentIndex).toBe(0);
  });

  test('should wrap around with arrow keys', () => {
    const tabElements = container.querySelectorAll('[role="tab"]');
    
    // Left from first tab should go to last
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    tabElements[0].dispatchEvent(leftEvent);
    
    expect(tabs.currentIndex).toBe(2);
    
    // Right from last tab should go to first
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    tabElements[2].dispatchEvent(rightEvent);
    
    expect(tabs.currentIndex).toBe(0);
  });

  test('should handle Home and End keys', () => {
    const tabElements = container.querySelectorAll('[role="tab"]');
    
    // End key
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    tabElements[0].dispatchEvent(endEvent);
    
    expect(tabs.currentIndex).toBe(2);
    
    // Home key
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    tabElements[2].dispatchEvent(homeEvent);
    
    expect(tabs.currentIndex).toBe(0);
  });

  test('should call onChange callback', () => {
    const onChange = jest.fn();
    const callbackTabs = new Tabs(container, {
      defaultTab: 0,
      onChange
    });

    const tabElements = container.querySelectorAll('[role="tab"]');
    tabElements[1].click();

    expect(onChange).toHaveBeenCalledWith(1);
    
    callbackTabs.destroy();
  });

  test('should return active tab index', () => {
    expect(tabs.getActiveTab()).toBe(0);
    
    tabs.activateTab(2);
    expect(tabs.getActiveTab()).toBe(2);
  });
});
