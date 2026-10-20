"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-2xl tracking-widest uppercase text-[#1a1a1a]">
            Something Went Wrong
          </h1>
          <p className="font-sans-clean text-sm text-[#6b6b6b] leading-relaxed">
            An unexpected error occurred. This has been logged and we'll look into it.
          </p>
          {error.digest && (
            <p className="font-sans-clean text-xs text-[#9a9a9a]">
              Error ID: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-gold px-8 py-3 text-sm"
          >
            Try Again
          </button>
          <Link href="/" className="btn-outline px-8 py-3 inline-block text-sm">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
