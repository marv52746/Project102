import { StarIcon } from "lucide-react";
import React from "react";

export default function ReviewsTab() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Patient Reviews</h3>
      <div className="flex items-center text-yellow-400 mb-2">
        {[...Array(4)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4" />
        ))}
        <StarIcon className="w-4 h-4 text-gray-300" />
        <span className="ml-2 text-sm text-gray-600">4.0</span>
      </div>
      <p className="text-sm text-gray-700">
        Great experience. Dr. Smith is very attentive.
      </p>
    </div>
  );
}
