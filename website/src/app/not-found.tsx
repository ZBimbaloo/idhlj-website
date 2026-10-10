export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-sand-50">
      <div className="container-narrow text-center">
        <div className="font-display text-7xl font-semibold text-brand-500">404</div>
        <h1 className="mt-4 font-display text-2xl font-semibold">Page Not Found</h1>
        <p className="mt-3 text-neutral-600">
          The page you are looking for might have been moved or no longer exists.
        </p>
        <a
          href="/en/"
          className="btn-primary mt-8 inline-flex"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
