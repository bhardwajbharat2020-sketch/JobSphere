const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseStyles = 'bg-gray-200 animate-pulse';
  const variants = {
    rect: `rounded ${className}`,
    circle: `rounded-full ${className}`,
    text: `rounded h-4 ${className}`,
  };

  return <div className={`${baseStyles} ${variants[variant]}`} />;
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-custom-soft space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-4 shadow-custom-soft">
        <Skeleton className="h-5 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

export default Skeleton;
