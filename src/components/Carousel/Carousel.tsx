import nikeShoes from "../../assets/images/nike_shoes.webp";
import styles from "./Carousel.module.scss";
import React, {
  Children,
  ReactElement,
  cloneElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCarousel, useCarousel2 } from "../../core/useCarousel";

export interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const itemsRef = useRef<HTMLElement[]>([]);

  const { ref, instance } = useCarousel({
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

const fetchImages = (amount = 3) => {
  return Promise.all(
    [...Array(amount)].map(() =>
      fetch("https://dog.ceo/api/breeds/image/random")
    )
  )
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((results) =>
      Promise.all(results.map(({ message }) => new Promise((r) => r(message))))
    );
};

export const FullCarousel = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchImages().then(setImages);
  }, []);

  console.log(images);

  return (
    <Carousel>
      {/* <CarouselItem>
        <p className={styles.text}>asdf</p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem>
      <CarouselItem>
        <p className={styles.text}></p>
      </CarouselItem> */}
      {images.map((url) => (
        <CarouselItem>
          <div className={styles.img}>
            <img src={url} />
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  );
};
// todo: allow generators on the carousel
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
