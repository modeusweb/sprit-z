'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/5 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

                  <div className="relative z-10 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
            <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-8xl font-extrabold text-gray-900 dark:text-white mb-2">
            404
          </h1>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Oops! Page not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            The page <span className="font-mono text-purple-600 dark:text-purple-400">{pathname}</span> doesn't exist or may have been moved.
          </p>
        </div>

        <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2v8a2 2 0 002 2h10a2 2 0 002-2V10l2-2l-8-8l-8 8z" />
            </svg>
            Back to Sprit-Z
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-4-4m0 0l4-4m-4 4h10" />
            </svg>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
