import {  useEffect, useState } from "react";
import { useLoading } from "./useLoading";

const fetchImages = (
  amount = 3,
  fetchOptions: RequestInit = {}
): Promise<string[]> => {
  return Promise.all(
    [...Array(amount)].map(() =>
      fetch("https://dog.ceo/api/breeds/image/random", fetchOptions)
    )
  )
    .then(
      (responses) => Promise.all(responses.map((res) => res.json())),
      (err) => {
        console.log("Failed to fetch", err);
      }
    )
    .then(
      (results) =>
        Promise.all(
          (results as any[]).map(
            ({ message }: any) => new Promise((r) => r(message))
          )
        ),
      (err) => {
        console.log("Failed to map responses", err);
      }
    ) as Promise<string[]>;
};

export const useDogImages = (amount = 3) => {
  const [images, setImages] = useState<string[]>([]);

  const { execute, status, message, error } = useLoading((...args) =>
    fetchImages(...args).then(setImages)
  );

  useEffect(() => {
    const abortController = new AbortController();

    execute(amount, { signal: abortController.signal });

    return () => {
      abortController.abort('React Rerender');
    };
  }, []);

  return {
    images,
    status,
    message,
    error,
  };
};
