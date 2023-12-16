import { useCallback, useReducer } from "react";

let timeout: number;

export const useLoading = (asyncFn: (...args: any) => Promise<any>, timeUntilIdle = 2000) => {
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "idle":
        return { ...state, status: "idle", message: null, error: null };
      case "loading":
        console.log('status:::loading')
        return { ...state, status: "loading", message: null, error: null };
      case "success":
        return {
          ...state,
          status: "success",
          message: action.message,
          error: null,
        };
      case "error":
        console.log('status:::: error')
        return {
          ...state,
          status: "error",
          message: null,
          error: action.message,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    error: null,
    message: null,
  });

  const execute = useCallback((...args: any) => {
    clearTimeout(timeout);
    dispatch({ type: "loading" });
    return asyncFn(...args)
      .then((result) => {
        dispatch({ type: "success", message: result });
      })
      .catch((error) => {
        dispatch({ type: "error", message: error });
      })
      .finally(() => {
        timeout = setTimeout(() => {
          dispatch({ type: "idle" });
        }, timeUntilIdle) as unknown as number;
      });
  }, []);

  return { execute, ...state };
};
