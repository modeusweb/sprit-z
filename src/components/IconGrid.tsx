'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import type { SvgIcon } from '@/types';
import { sanitizeId } from '@/utils/svgParser';

interface IconGridProps {
  icons: SvgIcon[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onRenameId: (id: string, renamedId: string) => void;
  onSetAllEnabled: (enabled: boolean) => void;
}

interface IconCardProps {
  icon: SvgIcon;
  onRemove: (id: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onRenameId: (id: string, renamedId: string) => void;
}

const IconCard = memo(function IconCard({
  icon,
  onRemove,
  onToggleEnabled,
  onRenameId,
}: IconCardProps) {
  const enabled = icon.enabled !== false;

  const handleRename = (value: string) => {
    onRenameId(icon.id, sanitizeId(value));
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border p-4 flex flex-col items-center transition-all duration-200 ${
        enabled
          ? 'border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600'
          : 'border-dashed border-gray-300 dark:border-gray-600 opacity-50'
      }`}
    >
      <button
        type="button"
        onClick={() => onRemove(icon.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center shadow-md z-10"
        title="Remove icon"
        aria-label={`Remove ${icon.name}`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <label
        className="absolute -top-2 -left-2 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer flex items-center justify-center shadow-sm z-10"
        title={enabled ? 'Included in sprite' : 'Excluded from sprite'}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) =>
            onToggleEnabled(icon.id, e.target.checked)
          }
          className="w-4 h-4 accent-purple-600 cursor-pointer"
          aria-label={`${enabled ? 'Exclude' : 'Include'} ${icon.name}`}
        />
      </label>

      <div className="aspect-square w-full flex items-center justify-center mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 transition-transform duration-200 group-hover:scale-110"
          dangerouslySetInnerHTML={{ __html: icon.content }}
        />
      </div>

      <div className="flex items-center gap-1 w-full min-w-0 mb-1">
        <span className="text-[10px] text-gray-400 font-mono shrink-0">
          #
        </span>

        <input
          type="text"
          value={icon.renamedId ?? icon.id}
          onChange={(e) => handleRename(e.target.value)}
          placeholder="icon-id"
          aria-label={`Symbol ID for ${icon.name}`}
          className="w-full min-w-0 px-1 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded bg-gray-50 dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors truncate"
          title="Click to rename the symbol ID"
        />

        {icon.renamedId && (
          <button
            type="button"
            onClick={() => onRenameId(icon.id, '')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm px-1 shrink-0"
            title="Reset to filename id"
            aria-label={`Reset ID for ${icon.name}`}
          >
            ↺
          </button>
        )}
      </div>

      <p
        className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center"
        title={`${icon.name} · ${icon.width || '?'}×${icon.height || '?'}`}
      >
        {icon.name}
      </p>
    </div>
  );
});

export default function IconGrid({
  icons,
  onRemove,
  onClearAll,
  onToggleEnabled,
  onRenameId,
  onSetAllEnabled,
}: IconGridProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allEnabled =
    icons.length > 0 &&
    icons.every((icon) => icon.enabled !== false);

  const noneEnabled =
    icons.length > 0 &&
    icons.every((icon) => icon.enabled === false);

  const enabledCount = icons.filter(
    (icon) => icon.enabled !== false
  ).length;

  const filteredIcons = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return icons;
    }

    return icons.filter((icon) => {
      const id = icon.renamedId ?? icon.id;

      return (
        icon.name.toLowerCase().includes(normalized) ||
        id.toLowerCase().includes(normalized)
      );
    });
  }, [icons, query]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Icons{' '}
            <span className="text-gray-400 dark:text-gray-500 font-normal">
              {mounted ? `(${icons.length})` : '(0)'}
            </span>
          </h2>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {mounted ? `${enabledCount} in sprite` : 'Loading…'}
          </span>

          {query.trim() && (
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {mounted ? `${filteredIcons.length} found` : ''}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSetAllEnabled(true)}
            disabled={allEnabled}
            className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 disabled:opacity-40 rounded-lg transition-colors"
            title="Include all icons in the sprite"
          >
            Select all
          </button>

          <button
            type="button"
            onClick={() => onSetAllEnabled(false)}
            disabled={noneEnabled}
            className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 disabled:opacity-40 rounded-lg transition-colors"
            title="Exclude all icons from the sprite"
          >
            Select none
          </button>

          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              aria-label="Search icons"
              className="w-40 px-3 py-1.5 pl-8 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {icons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <svg
            className="w-10 h-10 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <p className="text-sm">
            {query.trim()
              ? `No icons match “${query}”`
              : 'No icons yet'}
          </p>

          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : filteredIcons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <p className="text-sm">
            No icons match “{query}”
          </p>

          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 pb-5">
          {filteredIcons.map((icon) => (
            <IconCard
              key={icon.id}
              icon={icon}
              onRemove={onRemove}
              onToggleEnabled={onToggleEnabled}
              onRenameId={onRenameId}
            />
          ))}
        </div>
      )}
    </div>
  );
}