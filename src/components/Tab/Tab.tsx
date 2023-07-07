import React, {
  Children,
  cloneElement,
  forwardRef,
  useRef,
  useState,
} from "react";
import styles from "./Tab.module.scss";

export interface TabProps {
  children: React.ReactNode;
  labels: string[];
}
export interface TabItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export const TabItem = forwardRef<HTMLDivElement, TabItemProps>(
  ({ children, onClick, active }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.tabItem} ${active ? styles.active : ""}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export const Tab = ({ labels, children }: TabProps) => {
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className={styles.tabBar}>
        {labels.map((label, i) => (
          <button
            key={i}
            className={styles.tabButton}
            onClick={() => setActiveIndex(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tab}>
        {Children.map(children, (c, i) =>
          cloneElement(c as React.ReactElement, {
            ref: (r: HTMLDivElement) => (itemsRef.current[i] = r),
            active: i === activeIndex,
          })
        )}
      </div>
    </div>
  );
};
