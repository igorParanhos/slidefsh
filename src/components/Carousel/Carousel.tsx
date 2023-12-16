import nikeShoes from "../../assets/images/nike_shoes.webp";
import styles from "./Carousel.module.scss";
import React, {
  Children,
  ReactElement,
  cloneElement,
  forwardRef,
  useRef,
} from "react";
import { useCarousel } from "../../core/useCarousel";
import { useDogImages } from "../../hooks/useDogImages";

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

export type CarouselItemProps = JSX.IntrinsicAttributes & {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children, className, ...args }, ref) => {
    return (
      <div ref={ref} className={`${styles.carouselItem} ${className}`} {...args} >
        {children}
      </div>
    );
  }
);

// const fetchImages = (amount = 3, { signal }: {signal?: AbortSignal} = {}): Promise<string[]> => {
//   return Promise.all(
//     [...Array(amount)].map(() =>
//       fetch("https://dog.ceo/api/breeds/image/random", {
//         signal
//       })
//     )
//   )
//     .then((responses) => Promise.all(responses.map((res) => res.json())), (err) => {
//       console.log('Failed to fetch');
//     })
//     .then((results) =>
//       Promise.all(results.map(({ message }) => new Promise((r) => r(message)))), () => {console.log('Failed to map responses')}
//     );
// };

export const FullCarousel = () => {
  const {images, status} = useDogImages();

  // const [images, setImages] = useState<string[]>([]);

  // useEffect(() => {
  //   if (images.length) return;

  //   console.count('fetching images')

  //   const abortController = new AbortController();
  //   fetchImages(3, {signal: abortController.signal}).then(setImages);

  //   return () => {
  //     abortController.abort();
  //     console.count('aborting fetch request')
  //   } 
  // }, []);

  // console.log(images);
  console.log(status)

  return (
    <>
    <p>Status: {status}</p>
    <Carousel>
      {images.map((url) => (
        <CarouselItem key={url}>
          <div className={styles.img}>
            <img src={url} />
          </div>
        </CarouselItem>
      ))}
    </Carousel></>
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
