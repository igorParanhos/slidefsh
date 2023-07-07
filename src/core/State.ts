export interface State {
  currentSlide: number;
  $slides: HTMLElement[];
}
export type Listener = () => void;

const State = () => {
  return {
    currentSlide: 0,
    $slides: [],
  };
}

export const CarouselState = () => {
  const state = State();
  const _listeners: { [key: string]: Listener[] } = {};

  const addListener = (key: string, listener: Listener) => {
    if (!_listeners[key]) {
      _listeners[key] = [];
    }
    _listeners[key].push(listener);
  };
  const removeListener = (key: string, listener: Listener) => {
    if (_listeners[key]) {
      _listeners[key] = _listeners[key].filter((l) => l !== listener);
    }
  };
  const _setter = (target: State, key: keyof State, value: any) => {
    target[key] = value;
    if (_listeners[key as string]) {
      _listeners[key as string].forEach((l) => l());
    }
    return true;
  };
  const _getter = (target: State, key: keyof State) => {
    return target[key];
  };

  return {
    state: new Proxy(state, {
      set: _setter,
      get: _getter,
    }),
    addListener,
    removeListener,
  };
}