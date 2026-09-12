import { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export const FileUploader = memo(function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const svgFiles = acceptedFiles.filter(file => file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg'));
    onFilesSelected(svgFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/svg+xml': ['.svg'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-300 ease-in-out
        ${isDragActive
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1
          ${isDragActive ? 'bg-purple-100 dark:bg-purple-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <svg
            className={`w-6 h-6 ${isDragActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isDragActive ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            )}
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop the files here' : 'Upload SVG files'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Drag &amp; drop or click to browse
          </p>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          .svg — multiple files allowed
        </p>
      </div>
    </div>
  );
});
