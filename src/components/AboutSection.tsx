import ShareButtons from './ShareButtons';

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <div className="space-y-4">
          <h2 id="about-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
            What is an SVG sprite generator?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            An SVG sprite is a single file that stores many icons at once. Each
            icon lives inside its own &lt;symbol&gt; element with a unique id,
            and any part of your page can display it later with a small
            &lt;svg&gt;&lt;use href="#icon-id"&gt;&lt;/use&gt;&lt;/svg&gt; snippet. A sprite generator
            automates this tedious work: it merges a folder of separate .svg
            files into one optimized sprite, deduplicates symbol ids, and keeps
            the markup valid.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Sprites are one of the easiest performance wins for icon-heavy
            interfaces. Instead of downloading every icon separately, the
            browser fetches a single cached file and reuses it everywhere —
            fewer HTTP requests, faster first paint, and simpler asset
            management. Theming gets easier too: icons built on currentColor
            inherit the surrounding text color, so one CSS rule recolors an
            entire icon set for hover states, dark mode, or rebranding.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            How to combine SVG icons into a sprite
          </h2>
          <ol className="space-y-2 list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <li>
              Drop your .svg files into the upload area — add as many icons as
              you need, in any combination.
            </li>
            <li>
              Tune the output: set a symbol ID prefix to namespace your ids,
              replace colors with currentColor, or minify the markup.
            </li>
            <li>
              Copy the generated sprite to your clipboard or download it as
              sprite.svg with one click.
            </li>
            <li>
              Paste the sprite once into your HTML — right after the opening
              body tag — and reference any icon with a &lt;use&gt; snippet.
            </li>
          </ol>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Everything happens locally in your browser: your icons are never
            uploaded to a server. The generator preserves each icon's viewBox,
            resolves id conflicts automatically with numbered suffixes, and
            re-attaches inherited styling such as stroke="currentColor" so
            popular outline sets like Feather, Lucide, or Tabler render
            correctly out of the box.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Found the generator useful? Share Sprit-Z — it helps other
            developers discover a faster way to ship icons.
          </p>
          <ShareButtons />
        </div>
      </div>
    </section>
  );
}