/** Names of the inline icons drawn by components/ui/Icon.astro. */
export type IconName =
  | 'folder-search'
  | 'briefcase'
  | 'person'
  | 'document-prompt'
  | 'mail'
  | 'github'
  | 'clock'
  | 'house';

/** Image reference shared by content entries and the ImageFrame component. */
export interface FrameImage {
  /** Path like "/assets/struct/dashboard.png", resolved against src/assets. */
  src: string;
  alt: string;
  caption?: string;
  treatment?: 'none' | 'gray' | 'dither' | 'halftone';
  /** CSS aspect-ratio value used to reserve space, e.g. "16 / 10". */
  aspect?: string;
}
