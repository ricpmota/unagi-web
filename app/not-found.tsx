export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Page not found</h2>
      <p className="mb-4">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Go back home
      </a>
    </div>
  );
} 