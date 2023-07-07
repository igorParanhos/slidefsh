import nikeShoes from "../../assets/images/nike_shoes.webp";
import styles from "./Carousel.module.scss";
import React, {
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { addMouseDragListener } from "../../core/Carousel";

const clamp = (min: number, v: number, max: number) => {
  return Math.min(Math.max(v, min), max);
};

export interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const currentItem = useRef(0);
  const itemsRef = useRef<HTMLElement[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null!);
  const observer = useRef<IntersectionObserver>(null!);

  const goToItem = (index: number) => {
    itemsRef.current[index] &&
      itemsRef.current[index].scrollIntoView({ behavior: "smooth" });
  };

  const back = () => {
    if (currentItem.current <= 0) return;
    goToItem(currentItem.current - 1);
    currentItem.current = currentItem.current - 1;
  };

  const next = () => {
    if (currentItem.current >= itemsRef.current.length - 1) return;
    goToItem(currentItem.current + 1);
    currentItem.current = currentItem.current + 1;
  };

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.3) {
          const index = itemsRef.current.findIndex((e) => e === entry.target);
          currentItem.current = index;
        }
      });
    };
    observer.current = new IntersectionObserver(callback, {
      root: carouselRef.current,
      rootMargin: "0px",
      threshold: 0.3,
    });
    itemsRef.current.forEach((item) => {
      observer.current.observe(item);
    });

    const drag = (e: any) => {
      requestAnimationFrame(() => {
        carouselRef.current.scrollLeft =
          carouselRef.current.scrollLeft - e.movementX;
      });
    };
    const out = () => {
      requestAnimationFrame(() => {
        goToItem(currentItem.current);
      });
    };
    const cancelListeners = addMouseDragListener(carouselRef.current, {
      drag,
      out,
    });

    const resizeOnScroll = () => {
      itemsRef.current.forEach((e, index) => {
        requestAnimationFrame(() => {
          const width = e.clientWidth;
          let sizex = width * index - carouselRef.current.scrollLeft;
          sizex = clamp(-width, sizex, width);
          const size = 1 - Math.abs(sizex) / width;
          if (size <= 0.3) return;
          e.style.setProperty("--size", `${Math.max(size, 0.15)}`);
        });
      });
    };
    carouselRef.current.addEventListener("scroll", resizeOnScroll);

    return () => {
      cancelListeners();
      carouselRef.current.removeEventListener("scroll", resizeOnScroll);
      itemsRef.current.forEach((item) => {
        observer.current.unobserve(item);
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={carouselRef} className={styles.carousel}>
        {Children.map(children, (c: React.ReactNode, i) =>
          cloneElement(c, {
            ref: (r: HTMLDivElement) => (itemsRef.current[i] = r),
          })
        )}
      </div>
      <button className={`${styles.arrowButton} ${styles.left}`} onClick={back}>
        {"<"}
      </button>
      <button
        className={`${styles.arrowButton} ${styles.right}`}
        onClick={next}
      >
        {">"}
      </button>
    </div>
  );
};

export interface CarouselItemProps {
  children: React.ReactNode;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children }, ref) => {
    return (
      <div ref={ref} className={styles.carouselItem}>
        {children}
      </div>
    );
  }
);

export const FullCarousel = () => {
  return (
    <Carousel>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
    </Carousel>
  );
};

export const FullCarousel2 = () => {
  return (
    <Carousel>
      <CarouselItem>
        <div className={styles.img}>
          <img src={nikeShoes} />
        </div>
      </CarouselItem>
      <CarouselItem>
        <div className={styles.img}>
          <img src={nikeShoes} />
        </div>
      </CarouselItem>
      <CarouselItem>
        <div className={styles.img}>
          <img src={nikeShoes} />
        </div>
      </CarouselItem>
      <CarouselItem>
        <div className={styles.img}>
          <img src={nikeShoes} />
        </div>
      </CarouselItem>
    </Carousel>
  );
};
