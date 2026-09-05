import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/hooks/use-magnetic";

export type MagneticButtonProps = ComponentProps<typeof Button> & { strength?: number };

/**
 * Bouton principal avec micro-interaction magnétique (max 10px vers le curseur).
 */
export function MagneticButton({ strength = 10, ...props }: MagneticButtonProps) {
  const { magneticProps } = useMagnetic<HTMLButtonElement>({ strength });
  return <Button {...props} {...magneticProps} />;
}
