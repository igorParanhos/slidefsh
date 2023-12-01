import { CarouselState } from "./State";
import { addMouseDragListener, clamp } from "./utils";

export interface MoverSettings {
  $element: HTMLElement;
  $slides: HTMLElement[];
  onDrag?: () => void;
  onDragEnd?: () => void;
  onDragStart?: () => void;
}

// Virtual Scroller
export class Mover {
  settings: MoverSettings;
  _scrollWidth: number = null!;
  _scrollHeight: number = null!;
  _clipPoints: number[] = [];

  constructor(settings: MoverSettings) {
    this.settings = settings;
    this.calculateScroll();
  }
  calculateScroll = () => {
    this._scrollWidth = this.settings.$element.scrollWidth;
    this._scrollHeight = this.settings.$element.scrollHeight;
    this._clipPoints = this.settings.$slides.map((slide) => slide.offsetLeft);
  };
}

export interface CarouselConfig {
  onDrag?: () => void;
  onDragEnd?: () => void;
  onDragStart?: () => void;
  $slides: HTMLElement[];
}

export class Carousel {
  state = CarouselState();
  config: CarouselConfig;

  $element: HTMLElement = null!;
  $slides: HTMLElement[] = [];
  _observer: IntersectionObserver | undefined;
  _dragging = false;
  _interval: number | undefined;
  _cancelListeners: () => void = () => null;

  constructor(
    config: CarouselConfig = { $slides: [] },
    $element?: HTMLElement | undefined
  ) {
    this.config = config;
    this.$slides = config.$slides;
    if ($element) this.$element = $element;
  }
  init = ($element?: HTMLElement) => {
    this.$element = $element || this.$element;
    this.$element.addEventListener("scroll", this.resizeOnScroll);
    this.state.addListener("currentSlide", this.update);
    this.setObserver();

    const drag = (e: any) => {
      requestAnimationFrame(() => {
        this.$element.scrollLeft = this.$element.scrollLeft - e.movementX;
      });
    };
    const out = () => {
      this._dragging = false;
      this.update();
    };
    const dragStart = () => {
      this._dragging = true;
      if (this._interval) clearInterval(this._interval);
    };

    this._cancelListeners = addMouseDragListener(this.$element, {
      drag,
      out,
      down: dragStart,
    });
  };
  destroy = () => {
    this.clearScroll();
    this._cancelListeners();
    this._observer?.disconnect();
    this.state.removeListener("currentSlide", this.update);
    this.$element.removeEventListener("scroll", this.resizeOnScroll);
  };

  get currentSlide() {
    return this.state.state.currentSlide;
  }
  set currentSlide(value: number) {
    if (value < 0 || value > this.$slides.length - 1) return;
    this.state.state.currentSlide = value;
  }
  next = () => {
    this.currentSlide++;
  };
  prev = () => {
    this.currentSlide--;
  };

  update = () => {
    this.$slides.forEach(($slide, i) => {
      $slide.classList.toggle("active", i === this.currentSlide);
      $slide.classList.toggle("prev", i === this.currentSlide - 1);
      $slide.classList.toggle("next", i === this.currentSlide + 1);
    });
    !this._dragging && this.goToItem(this.currentSlide, this.$element);
  };
  clearScroll = () => {
    clearInterval(this._interval);
  };
  // TODO: move function outside of class
  goToItem = (index: number, $element: HTMLElement) => {
    clearInterval(this._interval);
    const width = $element.clientWidth;
    const scrollLeft = $element.scrollLeft;
    const scrollTarget = width * index;
    const scrollDiff = scrollTarget - scrollLeft;
    const scrollDirection = Math.sign(scrollDiff);
    const scrollDistance = Math.abs(scrollDiff);
    const scrollTime = 300;
    const scrollStep = (scrollDistance / scrollTime) * 10;
    this._interval = setInterval(() => {
      $element.scrollLeft += scrollStep * scrollDirection;
      if (
        (scrollDirection > 0 && $element.scrollLeft >= scrollTarget) ||
        (scrollDirection < 0 && $element.scrollLeft <= scrollTarget)
      ) {
        $element.scrollLeft = scrollTarget;
        clearInterval(this._interval);
      }
    }, 10) as unknown as number;
  };

  setObserver = () => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.3) {
          const index = this.$slides.findIndex((e) => e === entry.target);
          this.state.state.currentSlide = index;
        }
      });
    };

    this._observer = new IntersectionObserver(callback, {
      root: this.$element,
      rootMargin: "0px",
      threshold: 0.3,
    });

    this.$slides.forEach((item) => {
      this._observer?.observe(item);
    });
  };
  resizeOnScroll = () => {
    this.$slides.forEach((e, index) => {
      requestAnimationFrame(() => {
        const width = e.clientWidth;
        let sizex = width * index - this.$element.scrollLeft;
        sizex = clamp(-width, sizex, width);
        const size = 1 - Math.abs(sizex) / width;
        if (size <= 0.3) return;
        e.style.setProperty("--size", `${Math.max(size, 0.15)}`);
      });
    });
  };
}
