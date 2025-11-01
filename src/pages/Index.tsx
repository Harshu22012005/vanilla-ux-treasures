import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Accessibility, Keyboard, MousePointer } from "lucide-react";

const Index = () => {
  const modalDemoRef = useRef<HTMLDivElement>(null);
  const tabsDemoRef = useRef<HTMLDivElement>(null);
  const carouselDemoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load components
    const loadComponents = async () => {
      // Load styles
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/components/styles.css';
      document.head.appendChild(link);

      // Load scripts
      const modalScript = document.createElement('script');
      modalScript.src = '/components/modal.js';
      document.body.appendChild(modalScript);

      const tabsScript = document.createElement('script');
      tabsScript.src = '/components/tabs.js';
      document.body.appendChild(tabsScript);

      const carouselScript = document.createElement('script');
      carouselScript.src = '/components/carousel.js';
      document.body.appendChild(carouselScript);

      // Wait for scripts to load then initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Initialize Modal Demo
      if (window.Modal && modalDemoRef.current) {
        const modalBtn = modalDemoRef.current.querySelector('#open-modal-btn');
        const modal = new window.Modal({
          id: 'demo-modal',
          onOpen: () => console.log('Modal opened'),
          onClose: () => console.log('Modal closed')
        });

        modal.setContent(`
          <div>
            <h2 id="demo-modal-title" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
              Accessible Modal Dialog
            </h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">
              This modal features focus trap, ESC to close, and proper ARIA attributes.
            </p>
            <p style="color: #6b7280; margin-bottom: 1rem;">
              Try pressing <kbd style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">Tab</kbd> to cycle through focusable elements.
            </p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
              <button style="padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Action 1
              </button>
              <button style="padding: 0.5rem 1rem; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer;">
                Action 2
              </button>
            </div>
          </div>
        `);

        modalBtn?.addEventListener('click', () => modal.open());
      }

      // Initialize Tabs Demo
      if (window.Tabs && tabsDemoRef.current) {
        new window.Tabs(tabsDemoRef.current, {
          defaultTab: 0,
          onChange: (index: number) => console.log('Tab changed to:', index)
        });
      }

      // Initialize Carousel Demo
      if (window.Carousel && carouselDemoRef.current) {
        new window.Carousel(carouselDemoRef.current, {
          autoPlay: false,
          loop: true,
          onChange: (index: number) => console.log('Slide changed to:', index)
        });
      }
    };

    loadComponents();

    return () => {
      const links = document.querySelectorAll('link[href="/components/styles.css"]');
      links.forEach(link => link.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            Vanilla JavaScript Components
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Accessible UI Components
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Three production-ready vanilla JavaScript components with full accessibility support,
            keyboard navigation, and comprehensive test coverage.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Accessibility className="w-5 h-5 text-primary" />
              <span>WCAG 2.1 AA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Keyboard className="w-5 h-5 text-primary" />
              <span>Full Keyboard Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MousePointer className="w-5 h-5 text-primary" />
              <span>Touch Enabled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Components Demo Section */}
      <main className="container mx-auto px-4 pb-16 space-y-12">
        {/* Modal Component */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Dialog</CardTitle>
            <CardDescription>
              Accessible modal with focus trap, ESC to close, and backdrop click handling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" ref={modalDemoRef}>
              <Button id="open-modal-btn" className="w-full sm:w-auto">
                Open Modal Dialog
              </Button>
              <div className="bg-code-bg p-4 rounded-lg">
                <pre className="text-sm text-code-foreground overflow-x-auto">
{`const modal = new Modal({
  closeOnBackdrop: true,
  closeOnEscape: true,
  onOpen: () => console.log('opened'),
  onClose: () => console.log('closed')
});

modal.setContent('<h2>Hello World</h2>');
modal.open();`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Component */}
        <Card>
          <CardHeader>
            <CardTitle>Tabbed Content</CardTitle>
            <CardDescription>
              Keyboard navigable tabs with arrow key support and ARIA attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="tabs-container" ref={tabsDemoRef}>
              <div role="tablist" className="tabs-list" aria-label="Code examples">
                <button role="tab" id="tab-1" className="tab" aria-controls="panel-1">
                  JavaScript
                </button>
                <button role="tab" id="tab-2" className="tab" aria-controls="panel-2">
                  HTML
                </button>
                <button role="tab" id="tab-3" className="tab" aria-controls="panel-3">
                  Accessibility
                </button>
              </div>
              <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" className="tab-panel">
                <div className="bg-code-bg p-4 rounded-lg">
                  <pre className="text-sm text-code-foreground overflow-x-auto">
{`const tabs = new Tabs(element, {
  defaultTab: 0,
  orientation: 'horizontal',
  activation: 'automatic',
  onChange: (index) => console.log(index)
});`}
                  </pre>
                </div>
              </div>
              <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" className="tab-panel" hidden>
                <div className="bg-code-bg p-4 rounded-lg">
                  <pre className="text-sm text-code-foreground overflow-x-auto">
{`<div class="tabs-container">
  <div role="tablist" aria-label="Examples">
    <button role="tab">Tab 1</button>
    <button role="tab">Tab 2</button>
  </div>
  <div role="tabpanel">Panel 1</div>
  <div role="tabpanel">Panel 2</div>
</div>`}
                  </pre>
                </div>
              </div>
              <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" className="tab-panel" hidden>
                <div className="bg-code-bg p-4 rounded-lg">
                  <ul className="text-sm space-y-2 text-foreground">
                    <li>✓ Arrow key navigation (Left/Right or Up/Down)</li>
                    <li>✓ Home/End key support</li>
                    <li>✓ Automatic or manual activation modes</li>
                    <li>✓ ARIA attributes for screen readers</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carousel Component */}
        <Card>
          <CardHeader>
            <CardTitle>Carousel/Slider</CardTitle>
            <CardDescription>
              Touch and keyboard enabled carousel with auto-play and loop options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="carousel-container" ref={carouselDemoRef}>
                <div className="carousel-track">
                  <div className="carousel-slide" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Slide 1</h3>
                      <p>Swipe or use arrow keys to navigate</p>
                    </div>
                  </div>
                  <div className="carousel-slide" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Slide 2</h3>
                      <p>Touch gestures fully supported</p>
                    </div>
                  </div>
                  <div className="carousel-slide" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Slide 3</h3>
                      <p>ARIA live region for screen readers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-code-bg p-4 rounded-lg">
                <pre className="text-sm text-code-foreground overflow-x-auto">
{`const carousel = new Carousel(element, {
  autoPlay: true,
  interval: 5000,
  loop: true,
  onChange: (index) => console.log(index)
});`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accessibility First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with proper ARIA attributes, focus management, and screen reader support.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Framework Agnostic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pure vanilla JavaScript with no dependencies. Works with any framework or plain HTML.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fully Tested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive unit tests with Jest ensuring reliability and maintainability.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

declare global {
  interface Window {
    Modal: any;
    Tabs: any;
    Carousel: any;
  }
}

export default Index;
