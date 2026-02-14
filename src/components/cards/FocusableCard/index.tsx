import { FocusableCardRoot } from "./FocusableCardRoot";
import { FocusableCardImage } from "./FocusableCardImage";
import { FocusableCardProgressBar } from "./FocusableCardProgressBar";
import type { FocusableCardComponent } from "./FocusableCard.types";

const FocusableCard = FocusableCardRoot as FocusableCardComponent;
FocusableCard.Image = FocusableCardImage;
FocusableCard.ProgressBar = FocusableCardProgressBar;

export { FocusableCard };
export type {
  FocusableCardProps,
  FocusableCardImageProps,
  FocusableCardProgressBarProps,
} from "./FocusableCard.types";
