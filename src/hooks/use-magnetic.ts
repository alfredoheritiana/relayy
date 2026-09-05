import { useCallback, useEffect, useRef, useState } from "react";

export interface MagneticOptions {
  /** Déplacement maximum en pixels. */
  strength?: number;
}

/**
 * Effet magnétique : l'élément se déplace légèrement vers le curseur.
 * Désactivé si l'utilisateur préfère les animations réduites.
 */
export function useMagnetic<T extends HTMLElement>({ strength = 10 }: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(!motionQuery.matches && pointerQuery.matches);
    update();
    motionQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
    };
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<T>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const clamp = (value: number, max: number) => Math.max(-strength, Math.min(strength, value));
      setOffset({ x: clamp(dx, rect.width), y: clamp(dy, rect.height) });
    },
    [enabled, strength],
  );

  const onMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return {
    ref,
    magneticProps: {
      ref,
      onMouseMove,
      onMouseLeave,
      style: {
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? "transform 260ms ease-out" : "none",
      } as React.CSSProperties,
    },
  };
}
