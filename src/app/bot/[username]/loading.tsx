export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <div className="sticky top-3 z-50 w-full px-4 flex justify-center mb-2">
        <div className="w-full max-w-3xl h-13 rounded-2xl bg-white/60 animate-pulse" />
      </div>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="rounded-2xl bg-white border border-[#e4ecf2] p-6 animate-pulse space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 rounded-xl bg-slate-200" />
            <div className="w-32 h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
