'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 