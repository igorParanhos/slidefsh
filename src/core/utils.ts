export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
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