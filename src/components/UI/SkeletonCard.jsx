 const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 flex flex-col h-full animate-pulse">
    {/* Image Area */}
    <div className="aspect-video w-full bg-slate-200 rounded-t-2xl" />
    
    {/* Content Area */}
    <div className="p-3 flex flex-col grow justify-between">
      <div>
        {/* Title Line */}
        <div className="h-3.5 bg-slate-200 rounded-full w-3/4 mb-2" />
        {/* Location Line */}
        <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        {/* Price Area */}
        <div className="space-y-1">
          <div className="h-2 bg-slate-100 rounded-full w-8" />
          <div className="h-4 bg-slate-200 rounded-full w-12" />
        </div>
        {/* Time Badge */}
        <div className="h-5 bg-slate-100 rounded-lg w-10" />
      </div>
    </div>
  </div>
);
export default SkeletonCard;