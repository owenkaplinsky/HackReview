import React from "react";

interface Tab {
  id: string;
  label: string;
  count: number;
  icon: string;
  color: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`border-b border-white/10 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300
              ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-300 bg-glass-purple backdrop-blur-sm shadow-lg"
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/30 hover:bg-glass-white/50 backdrop-blur-sm"
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm
              ${
                activeTab === tab.id
                  ? tab.color === "success"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : tab.color === "warning"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-white/10 text-gray-400 border border-white/20"
              }
            `}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
