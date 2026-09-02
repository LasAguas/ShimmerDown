/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pins the workspace root to this folder. Without it, Next.js finds the
  // stray /Users/miguellee/package-lock.json (unrelated to this project, no
  // package.json next to it) and guesses the home directory is the root —
  // which makes the dev server's file watcher scope to everything under it,
  // not just this repo, causing reloads whenever anything else on the
  // machine touches a file.
  outputFileTracingRoot: __dirname,
  images: {
    // The session films' poster frames come straight off YouTube's CDN so we
    // don't have to keep a copy of each thumbnail in the repo.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      // Store product photos are served from the dashboard's Supabase bucket.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
