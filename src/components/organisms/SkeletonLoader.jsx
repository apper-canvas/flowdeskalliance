import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'list' }) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  };

  const Shimmer = () => (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
    />
  );

  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="p-6 flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full relative overflow-hidden flex-shrink-0">
                <Shimmer />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-3 bg-gray-200 rounded w-16 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/5 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pipeline') {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 relative overflow-hidden mb-2">
                <Shimmer />
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/3 relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                        <Shimmer />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-1/5 relative overflow-hidden">
                        <Shimmer />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default list type
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden flex-shrink-0">
              <Shimmer />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/3 relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-3 bg-gray-200 rounded w-16 relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;