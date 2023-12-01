import nikeShoes from "../../assets/images/nike_shoes.webp";
import styles from "./Carousel.module.scss";
import React, {
  Children,
  ReactElement,
  cloneElement,
  forwardRef,
  useRef,
} from "react";
import { useCarousel, useCarousel2 } from "../../core/useCarousel";

export interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const itemsRef = useRef<HTMLElement[]>([]);

  const { ref, instance } = useCarousel2({
    $slides: itemsRef.current,
  });

  return (
    <div className={styles.wrapper}>
      <div ref={ref} className={styles.carousel}>
        {Children.map(children, (c, i) =>
          cloneElement(c as ReactElement, {
            ref: (r: HTMLDivElement) => (itemsRef.current[i] = r),
          })
        )}
      </div>
      <button
        className={`${styles.arrowButton} ${styles.left}`}
        onClick={() => instance.prev()}
      >
        {"<"}
      </button>
      <button
        className={`${styles.arrowButton} ${styles.right}`}
        onClick={() => instance.next()}
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
