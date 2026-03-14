export function DemoBanner() {
  return (
    <div className="w-full bg-amber-400 text-black text-center text-sm font-medium px-4 py-2.5 sticky top-0 z-[1000]">
      <span>
        Heads up 👋 <strong>Early Build</strong> &nbsp;·&nbsp; You&apos;re viewing the Base Batches demo version of Invalend. &nbsp;·&nbsp; The entire project is being fully rewritten from scratch. &nbsp;·&nbsp;{' '}
        <a
          href="https://x.com/invalend"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline hover:opacity-70"
        >
          Follow us on X @invalend
        </a>
      </span>
    </div>
  )
}
