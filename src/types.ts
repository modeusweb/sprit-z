export interface SvgIcon {
  id: string;
  /** Optional user-defined identifier that overrides `id` in the sprite. */
  renamedId?: string;
  /** Whether the icon is included in the generated sprite (default true). */
  enabled?: boolean;
  name: string;
  content: string; // Full SVG for display
  innerContent: string; // Inner content for sprite
  viewBox?: string;
  width?: string;
  height?: string;
}

export interface SpriteOptions {
  symbolPrefix?: string;
  stripAttributes?: string[];
  keepAttributes?: string[];
}
