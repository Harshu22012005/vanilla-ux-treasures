/**
 * @jest-environment jsdom
 */

const Carousel = require('../public/components/carousel.js');

describe('Carousel Component', () => {
  let container;
  let carousel;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="carousel-container">
        <div class="carousel-track">
          <div class="carousel-slide">Slide 1</div>
          <div class="carousel-slide">Slide 2</div>
          <div class="carousel-slide">Slide 3</div>
        </div>
      </div>
    `;
    
    container = document.getElementById('carousel-container');
    carousel = new Carousel(container, {
      autoPlay: false,
      loop: true
    });
  });

  afterEach(() => {
    if (carousel) {
      carousel.destroy();
    }
  });

  test('should create carousel controls and indicators', () => {
    expect(container.querySelector('.carousel-prev')).toBeTruthy();
    expect(container.querySelector('.carousel-next')).toBeTruthy();
    
    const indicators = container.querySelectorAll('.carousel-indicator');
    expect(indicators.length).toBe(3);
  });

  test('should set correct ARIA attributes', () => {
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('aria-roledescription')).toBe('carousel');
    
    const slides = container.querySelectorAll('.carousel-slide');
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
  });

  test('should navigate to next slide', () => {
    expect(carousel.currentIndex).toBe(0);
    
    carousel.next();
    expect(carousel.currentIndex).toBe(1);
    
    carousel.next();
    expect(carousel.currentIndex).toBe(2);
  });

  test('should navigate to previous slide', () => {
    carousel.goToSlide(2);
    expect(carousel.currentIndex).toBe(2);
    
    carousel.prev();
    expect(carousel.currentIndex).toBe(1);
    
    carousel.prev();
    expect(carousel.currentIndex).toBe(0);
  });

  test('should loop when enabled', () => {
    carousel.goToSlide(2);
    carousel.next();
    
    expect(carousel.currentIndex).toBe(0); // Should loop back
    
    carousel.prev();
    expect(carousel.currentIndex).toBe(2); // Should loop to end
  });

  test('should not loop when disabled', () => {
    const noLoopCarousel = new Carousel(container, {
      loop: false
    });

    noLoopCarousel.goToSlide(2);
    noLoopCarousel.next();
    
    expect(noLoopCarousel.currentIndex).toBe(2); // Should stay at end
    
    noLoopCarousel.goToSlide(0);
    noLoopCarousel.prev();
    
    expect(noLoopCarousel.currentIndex).toBe(0); // Should stay at start
    
    noLoopCarousel.destroy();
  });

  test('should update indicators when slide changes', () => {
    const indicators = container.querySelectorAll('.carousel-indicator');
    
    expect(indicators[0].classList.contains('active')).toBe(true);
    expect(indicators[0].getAttribute('aria-selected')).toBe('true');
    
    carousel.next();
    
    expect(indicators[0].classList.contains('active')).toBe(false);
    expect(indicators[1].classList.contains('active')).toBe(true);
    expect(indicators[1].getAttribute('aria-selected')).toBe('true');
  });

  test('should navigate on indicator click', () => {
    const indicators = container.querySelectorAll('.carousel-indicator');
    
    indicators[2].click();
    expect(carousel.currentIndex).toBe(2);
  });

  test('should handle keyboard navigation', () => {
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    container.dispatchEvent(rightEvent);
    
    expect(carousel.currentIndex).toBe(1);
    
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    container.dispatchEvent(leftEvent);
    
    expect(carousel.currentIndex).toBe(0);
  });

  test('should handle Home and End keys', () => {
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    container.dispatchEvent(endEvent);
    
    expect(carousel.currentIndex).toBe(2);
    
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    container.dispatchEvent(homeEvent);
    
    expect(carousel.currentIndex).toBe(0);
  });

  test('should call onChange callback', () => {
    const onChange = jest.fn();
    const callbackCarousel = new Carousel(container, {
      onChange
    });

    callbackCarousel.next();
    expect(onChange).toHaveBeenCalledWith(1);
    
    callbackCarousel.destroy();
  });

  test('should start and stop autoplay', (done) => {
    const autoCarousel = new Carousel(container, {
      autoPlay: true,
      interval: 100
    });

    expect(autoCarousel.currentIndex).toBe(0);
    
    setTimeout(() => {
      expect(autoCarousel.currentIndex).toBe(1);
      autoCarousel.stopAutoPlay();
      
      setTimeout(() => {
        expect(autoCarousel.currentIndex).toBe(1); // Should not advance
        autoCarousel.destroy();
        done();
      }, 150);
    }, 150);
  });
});
