export default function Card({ title, right, children, className = "" }) {
  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
