import React from 'react'

const News = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-28 h-7 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-32 h-9 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <div className="space-y-5 mb-10">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></div>
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <div className="w-14 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-10/12 h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  )
}

export default News