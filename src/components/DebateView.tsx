import React from "react";

interface DebateViewProps {
  devilsAdvocate: string;
  praiseAgent: string;
  className?: string;
}

const DebateView: React.FC<DebateViewProps> = ({
  devilsAdvocate,
  praiseAgent,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Devil's Advocate */}
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">😈</span>
          <h3 className="text-lg font-semibold text-danger-800">
            Devil's Advocate
          </h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-danger-700 leading-relaxed whitespace-pre-wrap">
            {devilsAdvocate}
          </p>
        </div>
      </div>

      {/* Praise Agent */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🌟</span>
          <h3 className="text-lg font-semibold text-success-800">
            Praise Agent
          </h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-success-700 leading-relaxed whitespace-pre-wrap">
            {praiseAgent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebateView;
