'use client';

import { useEffect, useState } from 'react';

const SHARE_URL = 'https://sprit-z.vercel.app/';
const SHARE_TEXT =
  'Free SVG Sprite Generator — combine SVG icons into one sprite with Sprit-Z';

const enc = (value: string) => encodeURIComponent(value);

interface Network {
  id: string;
  label: string;
  href: string;
  path: string;
}

const NETWORKS: Network[] = [
  {
    id: 'x',
    label: 'Share on X (Twitter)',
    href: `https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(SHARE_URL)}`,
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    id: 'facebook',
    label: 'Share on Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${enc(SHARE_URL)}`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    id: 'linkedin',
    label: 'Share on LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(SHARE_URL)}`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  {
    id: 'telegram',
    label: 'Share on Telegram',
    href: `https://t.me/share/url?url=${enc(SHARE_URL)}&text=${enc(SHARE_TEXT)}`,
    path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  },
  {
    id: 'reddit',
    label: 'Share on Reddit',
    href: `https://www.reddit.com/submit?url=${enc(SHARE_URL)}&title=${enc(SHARE_TEXT)}`,
    path: 'M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.468.468 0 0 1 .157-.282.471.471 0 0 1 .376-.129l2.902.57a1.25 1.25 0 0 1 1.157-.698zM8.578 11.46a1.002 1.002 0 0 0-1.002 1.003 1.002 1.002 0 1 0 2.004 0 1.002 1.002 0 0 0-1.002-1.003zm6.976 0a1.002 1.002 0 0 0-1.002 1.003 1.002 1.002 0 1 0 2.004 0 1.002 1.002 0 0 0-1.002-1.003zM9.447 14.98c.854 0 1.7.293 2.466.855a.471.471 0 0 1-.273.855.47.47 0 0 1-.281-.091 3.73 3.73 0 0 0-1.91-.616 3.75 3.75 0 0 0-2.033.566.47.47 0 0 1-.553-.763 4.72 4.72 0 0 1 2.584-.806zm3.107 0c.928 0 1.839.277 2.58.805a.47.47 0 0 1-.553.765 3.763 3.763 0 0 0-2.03-.568 3.73 3.73 0 0 0-1.912.616.47.47 0 0 1-.554-.763 4.71 4.71 0 0 1 2.469-.855z',
  },
];

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
    } catch {
      // Clipboard API unavailable (permissions/insecure context) — silently ignore.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {NETWORKS.map(network => (
        <a
          key={network.id}
          href={network.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={network.label}
          title={network.label}
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-500 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={network.path} />
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy page link to clipboard"
        title="Copy link"
        className="h-9 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-500 transition-colors"
      >
        {copied ? 'Link copied!' : 'Copy link'}
      </button>
    </div>
  );
}