export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p>Invoice & GST Calculator</p>
          {/* TODO: Replace with your full name */}
          {/* TODO: Replace with your email */}
        </div>
        <a
          className="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
        >
          Built for Digital Heroes
        </a>
      </div>
    </footer>
  );
}
