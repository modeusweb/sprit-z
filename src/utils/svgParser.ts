import type { SvgIcon } from '../types';

// DOMParser is state-free (each parseFromString produces a fresh document),
// so a single instance can be safely shared across all files being parsed.
const domParser = new DOMParser();

/**
 * Keeps only characters that are safe in an SVG `id` / `href` fragment:
 * letters, digits, `-` and `_` (also URL-safe for `url(#…)` references).
 */
export const sanitizeId = (value: string): string => {
  const cleaned = value
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-');
  return cleaned.replace(/^-+|-+$/g, '');
};

export const parseSvgFile = (file: File): Promise<SvgIcon> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        const doc = domParser.parseFromString(fileContent, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) {
          reject(new Error('Invalid SVG file'));
          return;
        }

        const viewBox = svgElement.getAttribute('viewBox') || undefined;
        const width = svgElement.getAttribute('width') || undefined;
        const height = svgElement.getAttribute('height') || undefined;

        // Full SVG for display in grid
        const displaySvg = svgElement.cloneNode(true) as SVGElement;
        displaySvg.removeAttribute('xmlns');
        displaySvg.removeAttribute('width');
        displaySvg.removeAttribute('height');
        const content = displaySvg.outerHTML;

        // Extract only the inner content of SVG (without the svg tag itself) for sprite
        // xmlns on nested elements is redundant (the sprite wrapper declares it).
        const innerContent = Array.from(svgElement.children)
          .map(child => stripXmlns(child.outerHTML))
          .join('');

        // Generate ID from filename (without prefix)
        const baseName = file.name.replace(/\.svg$/i, '');
        const id = sanitizeId(baseName);

        resolve({
          id,
          name: file.name,
          content,
          innerContent,
          viewBox,
          width,
          height,
          enabled: true,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/** Resolves the effective symbol id for an icon (renamedId wins, else id). */
const resolveId = (icon: SvgIcon): string => icon.renamedId ?? icon.id;

/** Removes whitespace between tags and inside tags to shrink the markup. */
export const minifyMarkup = (markup: string): string =>
  markup
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/^\s+|\s+$/g, '');

// Matches xmlns and xmlns:prefix attributes on any element.
const XMLNS_RE = /\sxmlns(:[a-zA-Z0-9_-]+)?="[^"]*"/g;

/**
 * Removes redundant `xmlns`/`xmlns:…` attributes from nested elements.
 * The root `<svg xmlns="…">` wrapper is added separately by the generators,
 * so per-element declarations are unnecessary noise.
 */
export const stripXmlns = (markup: string): string => markup.replace(XMLNS_RE, '');

export const generateSpriteMarkup = (
  icons: SvgIcon[],
  options: { symbolPrefix?: string; minify?: boolean } = {}
): string => {
  const { symbolPrefix = '', minify = false } = options;
  const prefix = symbolPrefix ? `${symbolPrefix}-` : '';

  const symbols = icons
    .filter(icon => icon.enabled !== false)
    .map(icon => {
      const symbolId = `${prefix}${resolveId(icon)}`;
      return `  <symbol id="${symbolId}"${icon.viewBox ? ` viewBox="${icon.viewBox}"` : ''}>
    ${stripXmlns(icon.innerContent)}
  </symbol>`;
    })
    .join('\n');

  const markup = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="0" height="0">
${symbols}
</svg>`;
  return minify ? minifyMarkup(markup) : markup;
};

export const generateUsageExample = (
  icons: SvgIcon[],
  options: { symbolPrefix?: string; minify?: boolean; iconClass?: string } = {}
): string => {
  const { symbolPrefix = '', minify = false, iconClass = 'icon' } = options;
  const prefix = symbolPrefix ? `${symbolPrefix}-` : '';
  // Keep only characters that are safe inside an HTML class attribute.
  const safeClass = iconClass.replace(/["'<>&`]/g, '').trim() || 'icon';

  const examples = icons
    .filter(icon => icon.enabled !== false)
    .map(icon => {
      const symbolId = `${prefix}${resolveId(icon)}`;
      return `<svg class="${safeClass}" width="${icon.width || '24'}" height="${icon.height || '24'}">
  <use href="#${symbolId}" />
</svg>`;
    })
    .join('\n\n');

  return minify ? minifyMarkup(examples) : examples;
};

const COLOR_ATTR_RE = /\s(fill|stroke|stop-color|flood-color|lighting-color)="([^"]*)"/gi;
const STYLE_DECL_RE = /(?:fill|stroke|stop-color|flood-color|lighting-color)\s*:\s*([^;]+)/gi;
const STYLE_ATTR_RE = /(\sstyle=")([^"]*)(")/gi;

const SKIP_COLOR_VALUES = new Set(['none', 'transparent', 'currentcolor', 'inherit']);

const isPlainColorValue = (value: string): boolean => {
  const v = value.trim();
  return (
    /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v) ||
    /^(rgb|rgba|hsl|hsla)\(/i.test(v) ||
    /^[a-zA-Z]+$/.test(v)
  );
};

const shouldReplaceColor = (value: string): boolean => {
  const v = value.trim();
  if (SKIP_COLOR_VALUES.has(v.toLowerCase())) return false;
  if (/^(url|var)\(/i.test(v)) return false;
  return isPlainColorValue(v);
};

/**
 * Replaces the key color values of an SVG document with `currentColor`:
 * `fill`, `stroke`, `stop-color`, `flood-color` and `lighting-color`
 * (both as presentation attributes and inside inline `style`).
 * Values like `none`, `transparent`, `currentColor`, gradient references
 * (`url(#…)`) and CSS variables (`var(…)`) are kept as-is so icons
 * still render correctly.
 */
export const replaceColorsWithCurrentColor = (markup: string): string => {
  // Replace colors in presentation attributes
  let result = markup.replace(COLOR_ATTR_RE, (match, _attr: string, rawValue: string) => {
    if (!shouldReplaceColor(rawValue)) return match;
    return match.replace(rawValue, 'currentColor');
  });

  // Replace colors inside inline style attributes
  result = result.replace(STYLE_ATTR_RE, (_match, prefix: string, styleContent: string, suffix: string) => {
    const newStyle = styleContent.replace(STYLE_DECL_RE, (decl: string, rawValue: string) => {
      if (!shouldReplaceColor(rawValue)) return decl;
      return decl.replace(rawValue, 'currentColor');
    });
    return `${prefix}${newStyle}${suffix}`;
  });

  return result;
};