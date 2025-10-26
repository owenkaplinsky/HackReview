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
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">😈</span>
          <h3 className="text-lg font-semibold text-red-300">
            Devil's Advocate
          </h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-red-200 leading-relaxed whitespace-pre-wrap">
            {devilsAdvocate}
          </p>
        </div>
      </div>

      {/* Praise Agent */}
      <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🌟</span>
          <h3 className="text-lg font-semibold text-purple-300">
            Praise Agent
          </h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-purple-200 leading-relaxed whitespace-pre-wrap">
            {praiseAgent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebateView;
