import type { SvgIcon } from '@/types';

// DOMParser is state-less (each parseFromString produces a fresh document),
// so a single instance can be safely shared across all files being parsed.
// Using lazy initialization to avoid SSR issues (DOMParser is browser-only).
let domParser: DOMParser | null = null;

const getDomParser = (): DOMParser => {
  if (!domParser) {
    domParser = new DOMParser();
  }
  return domParser;
};

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

/**
 * Inherited paint-related presentation attributes that icon sets commonly
 * place on the root `<svg>`. Only inner content is copied into the sprite,
 * so these must be re-emitted on the `<symbol>` — otherwise stroke-based
 * icons (`fill="none" stroke="currentColor" stroke-width="2"…`, e.g.
 * Feather/Lucide/Tabler/Heroicons outline) lose their styling and render
 * as filled black shapes.
 */
const INHERITED_PAINT_ATTRS = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'stroke-opacity',
  'color',
] as const;

const escapeAttrValue = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Serializes inherited presentation attributes of a root `<svg>` element (undefined when there are none). */
export const extractPresentationAttrs = (svgElement: Element): string | undefined => {
  const attrs = INHERITED_PAINT_ATTRS
    .map(name => {
      const value = svgElement.getAttribute(name);
      return value === null ? null : `${name}="${escapeAttrValue(value.trim())}"`;
    })
    .filter((attr): attr is string => attr !== null);
  return attrs.length > 0 ? attrs.join(' ') : undefined;
};

export const parseSvgFile = (file: File): Promise<SvgIcon> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        const doc = getDomParser().parseFromString(fileContent, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) {
          reject(new Error('Invalid SVG file'));
          return;
        }

        const viewBox = svgElement.getAttribute('viewBox') || undefined;
        const width = svgElement.getAttribute('width') || undefined;
        const height = svgElement.getAttribute('height') || undefined;
        // Styling that lives on the root <svg> (fill="none", stroke="currentColor", …)
        // is lost when only inner content is copied, so capture it for the <symbol>.
        const presentationAttrs = extractPresentationAttrs(svgElement);

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
          presentationAttrs,
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

/**
 * Formats markup with consistent 2-space indentation based on tag nesting.
 * Uses DOM parsing to properly handle nested structure.
 */
export const formatMarkup = (markup: string, baseIndent: number = 0): string => {
  const indent = '  ';
  const baseIndentStr = indent.repeat(baseIndent);
  
  // Wrap in a container to parse
  const container = `<container>${markup}</container>`;
    const doc = getDomParser().parseFromString(container, 'image/svg+xml');
  const containerEl = doc.querySelector('container');
  
  if (!containerEl) {
    // Fallback to simple formatting if parsing fails
    return markup
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        return baseIndentStr + trimmed;
      })
      .filter(line => line !== '')
      .join('\n');
  }
  
  const formatNode = (node: Node, depth: number): string => {
    const currentIndent = baseIndentStr + indent.repeat(depth);
    
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? currentIndent + text : '';
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    
    // Self-closing tags (void elements in SVG/XML)
    const voidElements = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'use', 'image', 'stop']);
    
    if (voidElements.has(tagName) && element.children.length === 0) {
      const attrs = Array.from(element.attributes)
        .map(attr => `${attr.name}="${escapeAttrValue(attr.value)}"`)
        .join(' ');
      return currentIndent + `<${tagName}${attrs ? ' ' + attrs : ''} />`;
    }
    
    // Regular element with children
    const attrs = Array.from(element.attributes)
      .map(attr => `${attr.name}="${escapeAttrValue(attr.value)}"`)
      .join(' ');
    
    const childrenHtml = Array.from(element.children)
      .map(child => formatNode(child, depth + 1))
      .filter(html => html !== '')
      .join('\n');
    
    // Text content
    const textContent = Array.from(element.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .filter(text => text)
      .join(' ');
    
    if (childrenHtml) {
      return `${currentIndent}<${tagName}${attrs ? ' ' + attrs : ''}>
${childrenHtml}
${currentIndent}</${tagName}>`;
    } else if (textContent) {
      return `${currentIndent}<${tagName}${attrs ? ' ' + attrs : ''}>${textContent}</${tagName}>`;
    } else {
      return `${currentIndent}<${tagName}${attrs ? ' ' + attrs : ''}></${tagName}>`;
    }
  };
  
  return Array.from(containerEl.children)
    .map(child => formatNode(child, 0))
    .filter(html => html !== '')
    .join('\n');
};

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

  // Captures the root's own `fill="…"` attribute inside an attribute-list
  // string, e.g. `fill="none" stroke="currentColor" stroke-width="2"`.
  // `fill-rule`/`fill-opacity` don't match: the pattern requires `=` right
  // after `fill`, so only the bare attribute is lifted out.
  const FILL_ATTR_RE = /\s*\bfill\s*=\s*"([^"]*)"/i;

  const symbols = icons
    .filter(icon => icon.enabled !== false)
    .map(icon => {
      const symbolId = `${prefix}${resolveId(icon)}`;
      // Re-attach styling captured from the source root <svg> (fill="none",
      // stroke="currentColor", stroke-width, …) — it never makes it into
      // innerContent, but still applies to every shape inside the symbol.
      const presentationAttrs = icon.presentationAttrs ?? '';
      // The root's own fill is pulled out of presentationAttrs so that the
      // fill attribute is ALWAYS the last one on the opening <symbol> tag.
      // Its value is kept when the root declared one (solid sets use
      // `fill="currentColor"` — writing `fill="none"` over it would hide
      // the glyphs); otherwise it defaults to `fill="none"`, which is what
      // outline sets want anyway.
      const rootFill = presentationAttrs.match(FILL_ATTR_RE);
      const inheritedAttrs = presentationAttrs.replace(FILL_ATTR_RE, '').trim();
      const trailingFill = ` fill="${rootFill ? rootFill[1] : 'none'}"`;
      const formattedInnerContent = minify 
        ? stripXmlns(icon.innerContent)
        : formatMarkup(stripXmlns(icon.innerContent), 2);
      return `  <symbol id="${symbolId}"${icon.viewBox ? ` viewBox="${icon.viewBox}"` : ''}${inheritedAttrs ? ` ${inheritedAttrs}` : ''}${trailingFill}>
${formattedInnerContent}
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

// `(^|\s)` so the very first attribute of a bare `attr="value" …` list
// (e.g. presentation attrs re-emitted on `<symbol>`) is matched as well.
const COLOR_ATTR_RE = /(^|\s)(fill|stroke|stop-color|flood-color|lighting-color)="([^"]*)"/gi;
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
  let result = markup.replace(COLOR_ATTR_RE, (match, _prefix: string, _attr: string, rawValue: string) => {
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