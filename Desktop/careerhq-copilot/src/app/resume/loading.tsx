export default function ResumeLoading() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        
        <div>
          <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
