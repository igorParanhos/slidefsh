import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Carousel, CarouselConfig } from "./Carousel";

export const useCarousel = (config: CarouselConfig) => {
  const carouselRef = useMemo(() => new Carousel(config), []);
  const elementRef = useRef<HTMLElement | React.ReactNode>(null);

  const setObserver = useCallback(($element: HTMLElement | React.ReactNode) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.1) {
            carouselRef.init(elementRef.current as HTMLElement);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe($element as HTMLElement);
  }, []);

  const ref = useCallback((node: React.ReactNode) => {
    if (node !== null) {
      elementRef.current = node as unknown as HTMLElement;
      setObserver(node);
    } else {
      elementRef.current = null;
      carouselRef.destroy();
    }
  }, []);

  console.count("rendering");

  useEffect(() => {
    () => {
      carouselRef.destroy();
    };
  }, []);

  return { ref: ref as React.Ref<any>, instance: carouselRef as Carousel };
};

export const useCarousel2 = ($element: HTMLElement, config: any) => {
  const carouselRef = useMemo(() => new Carousel(config, $element), []);
  const elementRef = useRef<HTMLElement | React.ReactNode>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.1) {
            carouselRef.init(elementRef.current as HTMLElement);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe($element);

    return () => {
      carouselRef.destroy();
    };
  }, []);

  return {
    ref: elementRef as React.Ref<any>,
    instance: carouselRef as Carousel,
  };
};
