import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 5242880, // 5MB
  className,
  label = 'Upload your resume',
  error,
  isLoading = false,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileError(null);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: isLoading,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setFileError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setFileError('Invalid file type. Please upload a PDF or DOCX file');
      } else {
        setFileError('Error uploading file. Please try again.');
      }
    },
  });

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50',
          isLoading && 'opacity-50 cursor-not-allowed',
          (error || fileError) && 'border-red-500 hover:border-red-500'
        )}
      >
        <input {...(getInputProps() as any)} data-testid="file-upload-input" />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-500">
              Drag & drop your file here, or click to browse
            </p>
            <p className="text-xs text-gray-500">PDF or DOCX (max {maxSize / 1024 / 1024}MB)</p>
          </div>
        </div>
      </div>

      {fileName && (
        <div className="mt-2 flex items-center justify-between rounded-md border border-gray-200 p-2">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm text-gray-700 truncate max-w-[200px]">{fileName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setFileName(null);
            }}
            disabled={isLoading}
          >
            Remove
          </Button>
        </div>
      )}

      {(error || fileError) && (
        <p className="mt-2 text-xs text-red-500">{error || fileError}</p>
      )}
    </div>
  );
}
