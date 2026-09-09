import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { FileUploader } from './components/FileUploader';
import { IconGrid } from './components/IconGrid';
import { CodeOutput } from './components/CodeOutput';
import { EmptyState } from './components/EmptyState';
import type { SvgIcon } from './types';
import { parseSvgFile, generateSpriteMarkup, generateUsageExample, replaceColorsWithCurrentColor } from './utils/svgParser';
import { loadState, saveState } from './utils/storage';

const STORAGE_KEYS = {
  icons: 'icons',
  symbolPrefix: 'symbolPrefix',
  useCurrentColor: 'useCurrentColor',
  minify: 'minify',
  iconClass: 'iconClass',
};

function App() {
  const [icons, setIcons] = useState<SvgIcon[]>(() => loadState(STORAGE_KEYS.icons, []));
  const [symbolPrefix, setSymbolPrefix] = useState(() => loadState(STORAGE_KEYS.symbolPrefix, ''));
  const [useCurrentColor, setUseCurrentColor] = useState(() => loadState(STORAGE_KEYS.useCurrentColor, false));
  const [minify, setMinify] = useState(() => loadState(STORAGE_KEYS.minify, false));
  const [iconClass, setIconClass] = useState(() => loadState(STORAGE_KEYS.iconClass, 'icon'));
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const walletTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const WALLET_ADDRESS = 'TQZxZ2Ygh6RvkZDi5qswq8uF9KbDbDw9bo';

  const handleCopyWallet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setWalletCopied(true);
      if (walletTimer.current) clearTimeout(walletTimer.current);
      walletTimer.current = setTimeout(() => setWalletCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy wallet address:', error);
    }
  }, []);

  // Persist session so a page reload doesn't lose the work.
  useEffect(() => {
    saveState(STORAGE_KEYS.icons, icons);
  }, [icons]);

  useEffect(() => {
    saveState(STORAGE_KEYS.symbolPrefix, symbolPrefix);
  }, [symbolPrefix]);

  useEffect(() => {
    saveState(STORAGE_KEYS.useCurrentColor, useCurrentColor);
  }, [useCurrentColor]);

  useEffect(() => {
    saveState(STORAGE_KEYS.minify, minify);
  }, [minify]);

  useEffect(() => {
    saveState(STORAGE_KEYS.iconClass, iconClass);
  }, [iconClass]);

  // Suggested by the app: when loading new icons that collide with existing
  // ids, append `-2`, `-3`, … instead of silently dropping them.
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const parsedIcons = await Promise.all(
        files.map(file => parseSvgFile(file))
      );

      setIcons(prev => {
        const existingIds = new Set(prev.map(icon => icon.id));
        const newIcons: SvgIcon[] = [];

        parsedIcons.forEach(icon => {
          let candidate = icon.id;
          let suffix = 2;
          while (existingIds.has(candidate)) {
            candidate = `${icon.id}-${suffix}`;
            suffix += 1;
          }
          existingIds.add(candidate);
          newIcons.push({ ...icon, id: candidate });
        });

        return [...prev, ...newIcons];
      });
    } catch (error) {
      console.error('Error parsing SVG files:', error);
      alert('Error processing SVG files. Please ensure files have correct format.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleRemoveIcon = useCallback((id: string) => {
    setIcons(prev => prev.filter(icon => icon.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setIcons([]);
  }, []);

  const handleToggleEnabled = useCallback((id: string, enabled: boolean) => {
    setIcons(prev => prev.map(icon => (icon.id === id ? { ...icon, enabled } : icon)));
  }, []);

  const handleRenameId = useCallback((id: string, renamedId: string) => {
    setIcons(prev => prev.map(icon => (icon.id === id ? { ...icon, renamedId } : icon)));
  }, []);

  const handleSetAllEnabled = useCallback((enabled: boolean) => {
    setIcons(prev => prev.map(icon => ({ ...icon, enabled })));
  }, []);

  // When "Use currentColor" is on, replace key colors in both the preview
  // content and the sprite inner content (originals stay untouched in `icons`).
  const displayIcons = useMemo(() => {
    if (!useCurrentColor) return icons;
    return icons.map(icon => ({
      ...icon,
      content: replaceColorsWithCurrentColor(icon.content),
      innerContent: replaceColorsWithCurrentColor(icon.innerContent),
    }));
  }, [icons, useCurrentColor]);

  const spriteMarkup = useMemo(
    () => displayIcons.length > 0
      ? generateSpriteMarkup(displayIcons, { symbolPrefix, minify })
      : '',
    [displayIcons, symbolPrefix, minify]
  );

  const usageExample = useMemo(
    () => displayIcons.length > 0
      ? generateUsageExample(displayIcons, { symbolPrefix, minify, iconClass })
      : '',
    [displayIcons, symbolPrefix, minify, iconClass]
  );

  const handleDownloadSprite = useCallback(() => {
    if (!spriteMarkup) return;
    const blob = new Blob([spriteMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprite.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [spriteMarkup]);

  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Sprit-Z
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Combine your SVG icons into a single reusable sprite
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {icons.length} {icons.length === 1 ? 'icon' : 'icons'}
            </span>
            {icons.length > 0 && (
              <button
                onClick={handleDownloadSprite}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg shadow-sm hover:shadow transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download sprite
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white dark:bg-gray-800 border-b lg:border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 overflow-y-auto flex-1">
            {/* Upload Files — kept on top so users can start adding icons right away */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Upload Files
              </h2>
              <FileUploader onFilesSelected={handleFilesSelected} />
            </div>

            {/* Settings */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Settings
              </h2>
              <div>
                <label htmlFor="symbolPrefix" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol ID prefix
                </label>
                <input
                  type="text"
                  id="symbolPrefix"
                  value={symbolPrefix}
                  onChange={(e) => setSymbolPrefix(e.target.value)}
                  placeholder="e.g. icon"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="iconClass" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon class (Usage Examples)
                </label>
                <input
                  type="text"
                  id="iconClass"
                  value={iconClass}
                  onChange={(e) => setIconClass(e.target.value)}
                  placeholder="e.g. icon"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  Class applied to each &lt;svg&gt; in the usage examples. Defaults to "icon".
                </p>
              </div>

              {/* Color toggle */}
              <label htmlFor="currentColorToggle" className="flex items-center justify-between gap-3 mt-4 cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Use currentColor
                  </span>
                  <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Replaces icon colors (fill, stroke, gradient stops) so icons inherit your text color
                  </span>
                </span>
                <input
                  type="checkbox"
                  id="currentColorToggle"
                  checked={useCurrentColor}
                  onChange={(e) => setUseCurrentColor(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${useCurrentColor ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'} peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-1`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${useCurrentColor ? 'translate-x-4' : ''}`} />
                </span>
              </label>

              {/* Minify toggle */}
              <label htmlFor="minifyToggle" className="flex items-center justify-between gap-3 mt-4 cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Minify output
                  </span>
                  <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Removes whitespace to produce a compact single-line sprite &amp; examples
                  </span>
                </span>
                <input
                  type="checkbox"
                  id="minifyToggle"
                  checked={minify}
                  onChange={(e) => setMinify(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${minify ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'} peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-1`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${minify ? 'translate-x-4' : ''}`} />
                </span>
              </label>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing files...</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Built with React, TypeScript, Tailwind CSS
              </p>
              <a
                href="https://github.com/modeusweb/sprit-z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="View on GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Support */}
            <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/60 dark:border-purple-900/40 p-3 text-center">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Enjoying the app? <span className="text-pink-500 not-italic">♥</span>
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                A small token would mean a lot. Thank you kindly!
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <code className="flex-1 min-w-0 text-[10px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 truncate block">
                  TQZxZ2Ygh6RvkZDi5qswq8uF9KbDbDw9bo
                </code>
                <button
                  onClick={handleCopyWallet}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 text-white"
                  title="Copy wallet address"
                >
                  {walletCopied ? (
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Icon Grid — capped so the markup output below gets the rest of the space */}
          <div className={`${icons.length === 0 ? 'flex-1' : 'max-h-[26rem]'} overflow-y-auto p-6 pb-10`}>
            {icons.length === 0 ? (
              <EmptyState />
            ) : (
              <IconGrid 
                icons={displayIcons} 
                onRemove={handleRemoveIcon}
                onClearAll={handleClearAll}
                onToggleEnabled={handleToggleEnabled}
                onRenameId={handleRenameId}
                onSetAllEnabled={handleSetAllEnabled}
              />
            )}
          </div>

          {/* Output — takes all remaining vertical space */}
          {icons.length > 0 && (
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
              <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CodeOutput 
                  label="SVG Sprite" 
                  code={spriteMarkup}
                  downloadName="sprite"
                  hint="Save as sprite.svg and include it once in your page, then reference icons with <use>."
                />
                <CodeOutput 
                  label="Usage Examples"
                  code={usageExample}
                  hint="Each example uses the symbol id generated from the file name."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
