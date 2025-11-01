# Vanilla JavaScript UI Components

Three production-ready, accessible UI components built with vanilla JavaScript. No frameworks, no dependencies, just clean, reusable code.

## 🎯 Components

### 1. Modal Dialog
Accessible modal with focus trap, keyboard controls, and backdrop handling.

**Features:**
- Focus trap (Tab cycles through focusable elements)
- ESC key to close
- Click backdrop to close
- Proper ARIA attributes
- Restore focus on close

**Usage:**
```javascript
const modal = new Modal({
  id: 'my-modal',
  closeOnBackdrop: true,
  closeOnEscape: true,
  onOpen: () => console.log('Modal opened'),
  onClose: () => console.log('Modal closed')
});

modal.setContent('<h2>Hello World</h2><p>Modal content here</p>');
modal.open();
```

**Init Options:**
- `id` (string): Unique modal ID
- `closeOnBackdrop` (boolean): Close when clicking backdrop (default: true)
- `closeOnEscape` (boolean): Close on ESC key (default: true)
- `onOpen` (function): Callback when modal opens
- `onClose` (function): Callback when modal closes

### 2. Tabbed Content
Keyboard-navigable tabs with arrow key support and automatic/manual activation.

**Features:**
- Arrow key navigation (Left/Right or Up/Down)
- Home/End key support
- Automatic or manual activation modes
- Proper ARIA attributes for screen readers

**Usage:**
```javascript
const tabs = new Tabs(element, {
  defaultTab: 0,
  orientation: 'horizontal',
  activation: 'automatic',
  onChange: (index) => console.log('Tab changed to:', index)
});
```

**HTML Structure:**
```html
<div id="tabs-container">
  <div role="tablist" aria-label="Content tabs">
    <button role="tab" id="tab-1">Tab 1</button>
    <button role="tab" id="tab-2">Tab 2</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Content 1</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2">Content 2</div>
</div>
```

**Init Options:**
- `defaultTab` (number): Index of initially active tab (default: 0)
- `orientation` (string): 'horizontal' or 'vertical' (default: 'horizontal')
- `activation` (string): 'automatic' or 'manual' (default: 'automatic')
- `onChange` (function): Callback when tab changes

### 3. Carousel/Slider
Touch and keyboard enabled carousel with auto-play and loop options.

**Features:**
- Touch/swipe gestures
- Keyboard navigation (Arrow keys, Home, End)
- Auto-play with pause on hover
- Loop mode
- ARIA live region for screen readers
- Visual indicators

**Usage:**
```javascript
const carousel = new Carousel(element, {
  autoPlay: true,
  interval: 5000,
  loop: true,
  onChange: (index) => console.log('Slide changed to:', index)
});
```

**HTML Structure:**
```html
<div id="carousel-container">
  <div class="carousel-track">
    <div class="carousel-slide">Slide 1</div>
    <div class="carousel-slide">Slide 2</div>
    <div class="carousel-slide">Slide 3</div>
  </div>
</div>
```

**Init Options:**
- `autoPlay` (boolean): Enable auto-play (default: false)
- `interval` (number): Auto-play interval in ms (default: 5000)
- `loop` (boolean): Enable infinite loop (default: true)
- `slidesToShow` (number): Number of slides visible (default: 1)
- `onChange` (function): Callback when slide changes

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Attributes**: Proper semantic markup
- **Focus Management**: Logical focus flow
- **Screen Reader Support**: ARIA live regions and labels
- **Color Contrast**: Meets AA standards

## 🧪 Testing

Tests are written with Jest and include:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

**Test Coverage:**
- Modal: Focus trap, callbacks, keyboard controls
- Tabs: Keyboard navigation, ARIA attributes, activation modes
- Carousel: Touch gestures, auto-play, keyboard controls

## 📦 Installation

1. Copy component files to your project:
```
public/components/
├── modal.js
├── tabs.js
├── carousel.js
└── styles.css
```

2. Include in your HTML:
```html
<link rel="stylesheet" href="/components/styles.css">
<script src="/components/modal.js"></script>
<script src="/components/tabs.js"></script>
<script src="/components/carousel.js"></script>
```

## 🚀 Deployment

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Redirects are handled via `netlify.toml`

### CI/CD

GitHub Actions workflow runs tests on all PRs:
- Runs Jest tests
- Generates coverage reports
- Uploads to Codecov

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure:
- All tests pass
- Accessibility guidelines are followed
- Code is well documented
- Init options are clearly defined
