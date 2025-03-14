import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../../components/common/FileUpload';
import { Button } from '../../components/common/Button';
import { ParserService } from '../../services/parser.service';
import { ResumeService } from '../../services/resume.service';
import { useAuth } from '../../context/AuthContext';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Auto-generate a title based on the file name (without extension)
    const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
    setTitle(fileNameWithoutExt);
    // Clear any previous errors when a new file is selected
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your resume');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);
    
    try {
      // Step 1: Parse the document using the Edge Function (with client-side fallback)
      setUploadProgress(25);
      const parsedResult = await ParserService.parseDocument(file);
      
      // Check if we're using the fallback parsing method
      if (parsedResult.error) {
        console.warn('Using client-side fallback due to Edge Function error:', parsedResult.error);
        setIsUsingFallback(true);
        
        // Get file content as text for fallback
        const fileText = await readFileAsText(file);
        parsedResult.content = fileText;
      }
      
      setUploadProgress(75);
      
      // Step 2: Save the resume to Supabase
      const resumeData = {
        title,
        content: parsedResult.content || '',
        fileType: file.type,
        originalFileName: file.name,
        userId: user?.id
      };
      
      console.log('Creating resume with data:', {
        title: resumeData.title,
        fileType: resumeData.fileType,
      });
      
      const { error: saveError } = await ResumeService.createResume(resumeData);
      
      if (saveError) {
        throw new Error(`Failed to save resume: ${saveError.message}`);
      }
      
      setUploadProgress(100);
      
      // Redirect to the resumes page on success
      navigate('/resumes');
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setError(err.message || 'An error occurred while uploading your resume');
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Resume</h1>
        
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {isUsingFallback && (
          <div className="mb-4 p-4 text-sm text-yellow-700 bg-yellow-100 rounded-md">
            <p><strong>Note:</strong> Using simplified document parsing due to connectivity issues with our advanced parsing service. 
            Basic information has been extracted from your resume, but some formatting and structure may be limited.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Resume Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Software Engineer Resume"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume File
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'text/plain': ['.txt'],
              }}
              isLoading={isLoading}
              error={error && error.includes('file') ? error : undefined}
            />
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          
          {uploadProgress > 0 && (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500 text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !file}
            >
              {isLoading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
