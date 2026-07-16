import React from 'react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-800 bg-gray-950 p-8 shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight text-white text-center">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Start coordinating your integrations with FoundrAI.
        </p>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              className="mt-2 w-full rounded border border-gray-800 bg-black px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Min 8 characters"
              required
              className="mt-2 w-full rounded border border-gray-800 bg-black px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-purple-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
