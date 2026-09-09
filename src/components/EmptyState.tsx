const STEPS = [
  {
    number: 1,
    title: 'Add icons',
    description: 'Drop .svg files or pick them via the sidebar.',
  },
  {
    number: 2,
    title: 'Configure',
    description: 'Set an optional symbol ID prefix to avoid collisions.',
  },
  {
    number: 3,
    title: 'Download',
    description: 'Copy or download sprite.svg, then reference icons with <use>.',
  },
];

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-24 h-24 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No icons yet
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
        Combine multiple SVG icons into a single reusable sprite — cleaner markup,
        fewer requests, and easy to maintain.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold flex items-center justify-center mb-3">
              {step.number}
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {step.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};