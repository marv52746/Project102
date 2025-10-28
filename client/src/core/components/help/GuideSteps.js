import React from "react";
import { Clock, User } from "lucide-react";

export default function GuideSteps({ title, date, author, steps }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700">{title}</h1>

        <div className="text-gray-500 flex items-center gap-2 mt-2 text-sm">
          <Clock size={16} />
          <span>Created: {date}</span>
        </div>

        <div className="text-gray-500 flex items-center gap-2 mt-1 text-sm">
          <User size={16} />
          <span>By: {author}</span>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Step-by-Step Instructions
      </h2>

      <div className="space-y-10">
        {steps.map((step, index) => (
          <div key={index}>
            <h3 className="text-lg font-medium text-blue-600 mb-2">
              {index + 1}. {step.title}
            </h3>

            {step.description && (
              <p className="text-gray-600 mb-3 whitespace-pre-line leading-relaxed">
                {step.description}
              </p>
            )}

            {step.img && (
              <img
                src={step.img}
                alt={step.title}
                className="rounded-lg border border-gray-200 w-full max-w-3xl"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
