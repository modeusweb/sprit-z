export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          <div className="absolute -inset-1 rounded-full bg-purple-600/20 blur" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading Sprit-Z…</p>
      </div>
    </div>
  );
}
