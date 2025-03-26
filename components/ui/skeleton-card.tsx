import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard = ({ className }: SkeletonCardProps) => {
  return (
    <div className={cn("rounded-lg bg-white shadow-md overflow-hidden animate-pulse", className)}>
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-8 bg-gray-200 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
};

export default SkeletonCard;