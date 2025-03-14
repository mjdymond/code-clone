export default function Dashboard() {
  // Keeping this comment for future authentication features

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to ResumeOptimizer</h1>
        <p className="mt-2 text-gray-600">
          Your personal assistant for optimizing resumes and landing more interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Upload Resume</h2>
          <p className="mt-2 text-gray-600">
            Upload your resume to get started with optimization.
          </p>
          <div className="mt-4">
            <a
              href="/upload"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Upload Resume
            </a>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Add Job Description</h2>
          <p className="mt-2 text-gray-600">
            Add a job description to compare with your resume.
          </p>
          <div className="mt-4">
            <a
              href="/jobs/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Add Job
            </a>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">View Analyses</h2>
          <p className="mt-2 text-gray-600">
            View your resume analyses and optimization suggestions.
          </p>
          <div className="mt-4">
            <a
              href="/analyses"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              View Analyses
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <p className="mt-2 text-gray-600">
          You haven't performed any actions yet. Upload a resume to get started!
        </p>
      </div>
    </div>
  );
}
