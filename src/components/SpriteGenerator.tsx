'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { FileUploader } from './FileUploader';
import IconGrid from './IconGrid';
import { CodeOutput } from './CodeOutput';
import { EmptyState } from './EmptyState';
import type { SvgIcon } from '@/types';
import { parseSvgFile, generateSpriteMarkup, generateUsageExample, replaceColorsWithCurrentColor } from '@/utils/svgParser';
import { loadState, saveState } from '@/utils/storage';

const STORAGE_KEYS = {
  icons: 'icons',
  symbolPrefix: 'symbolPrefix',
  useCurrentColor: 'useCurrentColor',
  minify: 'minify',
  iconClass: 'iconClass',
};

export default function SpriteGenerator() {
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

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const parsedIcons = await Promise.all(files.map(file => parseSvgFile(file)));
      setIcons(prev => {
        const existingIds = new Set(prev.map(icon => icon.id));
        const newIcons: SvgIcon[] = [];
        parsedIcons.forEach(icon => {
          let candidate = icon.id;
          let suffix = 2;
          while (existingIds.has(candidate)) {
            candidate = icon.id + '-' + suffix;
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
    setIcons(prev => prev.map(icon => icon.id === id ? { ...icon, enabled } : icon));
  }, []);

  const handleRenameId = useCallback((id: string, renamedId: string) => {
    setIcons(prev => prev.map(icon => icon.id === id ? { ...icon, renamedId } : icon));
  }, []);

  const handleSetAllEnabled = useCallback((enabled: boolean) => {
    setIcons(prev => prev.map(icon => ({ ...icon, enabled })));
  }, []);

  const displayIcons = useMemo(() => {
    if (!useCurrentColor) return icons;
    return icons.map(icon => ({
      ...icon,
      content: replaceColorsWithCurrentColor(icon.content),
      innerContent: replaceColorsWithCurrentColor(icon.innerContent),
    }));
  }, [icons, useCurrentColor]);

  const spriteMarkup = useMemo(
    () => generateSpriteMarkup(displayIcons, { symbolPrefix, minify }),
    [displayIcons, symbolPrefix, minify]
  );

  const usageExample = useMemo(
    () => generateUsageExample(displayIcons, { symbolPrefix, minify, iconClass }),
    [displayIcons, symbolPrefix, minify, iconClass]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-80 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sprit-Z</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG Sprite Generator</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <FileUploader onFilesSelected={handleFilesSelected} />
          {isProcessing && (
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 text-center animate-pulse">
              Processing files...
            </p>
          )}
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Symbol prefix</label>
              <input
                type="text"
                value={symbolPrefix}
                onChange={(e) => setSymbolPrefix(e.target.value)}
                placeholder="e.g. icon"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Icon class</label>
              <input
                type="text"
                value={iconClass}
                onChange={(e) => setIconClass(e.target.value)}
                placeholder="icon"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Replace colors with currentColor</label>
              <button
                onClick={() => setUseCurrentColor(!useCurrentColor)}
                className={'relative inline-flex h-5 w-9 items-center rounded-full transition-colors ' + (useCurrentColor ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600')}
              >
                <span
                  className={'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ' + (useCurrentColor ? 'translate-x-4' : 'translate-x-0.5')}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Minify output</label>
              <button
                onClick={() => setMinify(!minify)}
                className={'relative inline-flex h-5 w-9 items-center rounded-full transition-colors ' + (minify ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600')}
              >
                <span
                  className={'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ' + (minify ? 'translate-x-4' : 'translate-x-0.5')}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Support the project</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 leading-snug">
              A small <span className="font-semibold text-purple-600 dark:text-purple-400">USDT (TRC-20)</span> token would mean a lot. Thank you kindly!
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
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={(icons.length === 0 ? 'flex-1' : 'max-h-[26rem]') + ' overflow-y-auto p-6 pb-10'}>
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
  );
}
