export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'rgba(0,212,255,0.08)',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-[#334155]">
          Operating globally from Denmark. &nbsp;CVR-nr: 46343387
        </p>
        <p className="text-sm text-[#334155]">
          © {new Date().getFullYear()} voidexa. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
