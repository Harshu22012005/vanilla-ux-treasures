/**
 * Accessible Carousel/Slider Component
 * Features: Touch support, keyboard navigation, ARIA live region, auto-play option
 */

class Carousel {
  constructor(element, options = {}) {
    if (!element) {
      throw new Error('Carousel requires a container element');
    }

    this.container = element;
    this.options = {
      autoPlay: options.autoPlay || false,
      interval: options.interval || 5000,
      loop: options.loop !== false,
      slidesToShow: options.slidesToShow || 1,
      onChange: options.onChange || (() => {}),
      ...options
    };

    this.track = null;
    this.slides = [];
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.setupStructure();
    this.createControls();
    this.attachEventListeners();
    this.updateSlides();

    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }

  setupStructure() {
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-roledescription', 'carousel');
    this.container.setAttribute('aria-label', 'Image carousel');

    this.track = this.container.querySelector('.carousel-track');
    if (!this.track) {
      console.error('Carousel requires an element with class "carousel-track"');
      return;
    }

    this.slides = Array.from(this.track.children);
    this.slides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${index + 1} of ${this.slides.length}`);
    });

    // Create live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.className = 'carousel-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('class', 'sr-only');
    this.container.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    `;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    this.container.appendChild(controls);

    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;

    // Create indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    indicators.setAttribute('role', 'tablist');

    this.slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      indicators.appendChild(indicator);
    });

    this.container.appendChild(indicators);
    this.indicators = Array.from(indicators.children);
  }

  attachEventListeners() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Touch events
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.stopAutoPlay();
    });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Pause on hover
    if (this.options.autoPlay) {
      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
    }
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  prev() {
    let newIndex = this.currentIndex - 1;
    
    if (newIndex < 0) {
      newIndex = this.options.loop ? this.slides.length - 1 : 0;
    }

    this.goToSlide(newIndex);
  }

  next() {
    let newIndex = this.currentIndex + 1;

    if (newIndex >= this.slides.length) {
      newIndex = this.options.loop ? 0 : this.slides.length - 1;
    }

    this.goToSlide(newIndex);
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentIndex = index;
    this.updateSlides();
    this.options.onChange(index);
  }

  updateSlides() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    this.indicators.forEach((indicator, index) => {
      indicator.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update live region
    this.liveRegion.textContent = `Slide ${this.currentIndex + 1} of ${this.slides.length}`;

    // Update button states
    if (!this.options.loop) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, this.options.interval);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  destroy() {
    this.stopAutoPlay();
    this.prevBtn.remove();
    this.nextBtn.remove();
    this.indicators.forEach(ind => ind.remove());
    this.liveRegion.remove();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Carousel;
}
