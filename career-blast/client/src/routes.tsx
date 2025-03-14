import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';

// Resume pages
import ResumeUpload from './pages/resumes/ResumeUpload';
import ResumesPage from './pages/resumes/ResumesPage';

// Job pages
import JobList from './pages/jobs/JobList';
import JobUpload from './pages/jobs/JobUpload';
import JobDetail from './pages/jobs/JobDetail';

// Analysis pages
import AnalysisList from './pages/analysis/AnalysisList';
import AnalysisDetail from './pages/analysis/AnalysisDetail';
import NewAnalysis from './pages/analysis/NewAnalysis';

// Test pages
import EdgeFunctionTest from './pages/test/EdgeFunctionTest';
import FullAnalysisTest from './pages/test/FullAnalysisTest';

// Landing page
const LandingPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
    <h1 className="text-4xl font-bold text-blue-600">ResumeOptimizer</h1>
    <p className="mt-4 text-xl text-gray-600">Optimize your resume for job applications</p>
    <div className="mt-8 flex space-x-4">
      <a
        href="/login"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
      >
        Sign In
      </a>
      <a
        href="/register"
        className="rounded-md bg-white px-4 py-2 text-blue-600 ring-1 ring-blue-600 hover:bg-gray-50"
      >
        Sign Up
      </a>
    </div>
  </div>
);

// 404 page
const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
    <h1 className="text-4xl font-bold text-gray-900">404</h1>
    <p className="mt-4 text-xl text-gray-600">Page not found</p>
    <a
      href="/"
      className="mt-8 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
    >
      Go Home
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout><LandingPage /></MainLayout>,
  },
  {
    path: '/login',
    element: <MainLayout><Login /></MainLayout>,
  },
  {
    path: '/register',
    element: <MainLayout><Register /></MainLayout>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <MainLayout><Dashboard /></MainLayout>,
      },
      {
        path: '/upload',
        element: <MainLayout><ResumeUpload /></MainLayout>,
      },
      {
        path: '/resumes',
        element: <MainLayout><ResumesPage /></MainLayout>,
      },
      // Job routes
      {
        path: '/jobs',
        element: <MainLayout><JobList /></MainLayout>,
      },
      {
        path: '/jobs/upload',
        element: <MainLayout><JobUpload /></MainLayout>,
      },
      {
        path: '/jobs/:id',
        element: <MainLayout><JobDetail /></MainLayout>,
      },
      // Analysis routes - singular form
      {
        path: '/analysis',
        element: <MainLayout><AnalysisList /></MainLayout>,
      },
      {
        path: '/analysis/new',
        element: <MainLayout><NewAnalysis /></MainLayout>,
      },
      {
        path: '/analysis/:id',
        element: <MainLayout><AnalysisDetail /></MainLayout>,
      },
      // Analysis routes - plural form (for consistency)
      {
        path: '/analyses',
        element: <MainLayout><AnalysisList /></MainLayout>,
      },
      {
        path: '/analyses/new',
        element: <MainLayout><NewAnalysis /></MainLayout>,
      },
      {
        path: '/analyses/:id',
        element: <MainLayout><AnalysisDetail /></MainLayout>,
      },
      // Test routes
      {
        path: '/test/edge-function',
        element: <MainLayout><EdgeFunctionTest /></MainLayout>,
      },
      {
        path: '/test/full-analysis',
        element: <MainLayout><FullAnalysisTest /></MainLayout>,
      },
      // Add more protected routes here as they are implemented
      // Examples:
      // { path: '/settings', element: <MainLayout><Settings /></MainLayout> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
