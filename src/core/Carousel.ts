import { CarouselState } from "./State";

const clamp = (min: number, v: number, max: number) => {
  return Math.min(Math.max(v, min), max);
};

export const addMouseDragListener = (
  $element: HTMLElement,
  {
    down,
    out,
    drag,
  }: { down?: EventListener; out?: EventListener; drag?: EventListener }
) => {
  const mouseDown: EventListener = (e) => {
    down?.(e);
    $element.addEventListener("mousemove", drag!);
  };
  const mouseUp: EventListener = (e) => {
    out?.(e);
    $element.removeEventListener("mousemove", drag!);
  };
  const mouseOut: EventListener = (e) => {
    out?.(e);
    $element.removeEventListener("mousemove", drag!);
  };
  $element.addEventListener("mouseup", mouseUp);
  $element.addEventListener("mousedown", mouseDown);
  $element.addEventListener("mouseleave", mouseOut);
  return () => {
    $element.removeEventListener("mouseup", mouseUp);
    $element.removeEventListener("mousedown", mouseDown);
    $element.removeEventListener("mouseleave", mouseOut);
  };
};

// export const setObserver = 

export interface CarouselConfig {
  onDrag?: () => void;
  onDragEnd?: () => void;
  onDragStart?: () => void;
  $slides: HTMLElement[];
}

export class Carousel {
  state = CarouselState();
  config: CarouselConfig;

  $element: HTMLElement;
  $slides: HTMLElement[] = [];
  _observer: IntersectionObserver | undefined;

  constructor($element: HTMLElement, config: CarouselConfig = { $slides: [] }) {
    this.config = config;
    this.$element = $element;
    this.$slides = config.$slides;


  }
  init = () => {
    this.$element.addEventListener("scroll", this.resizeOnScroll);
    this.setObserver();
  }

  get currentSlide() {
    return this.state.state.currentSlide;
  }
  set currentSlide(v: number) {
    this.state.state.currentSlide = clamp(0, v, this.$slides.length - 1);
  }
  next = () => {
    this.currentSlide++;
  }
  prev = () => {
    this.currentSlide--;
  }

  update = () => {
    this.$slides.forEach(($slide, i) => {
      $slide.classList.toggle("active", i === this.currentSlide);
      $slide.classList.toggle("prev", i === this.currentSlide - 1);
      $slide.classList.toggle("next", i === this.currentSlide + 1);
    });
  }

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
  }
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
  }
}