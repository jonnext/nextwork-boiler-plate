import React from "react";
import { Menu, Bell, Settings } from "lucide-react";

interface LearningToolbarProps {
  onSignIn?: () => void;
  onNotification?: () => void;
  onSettings?: () => void;
}

const LearningToolbar: React.FC<LearningToolbarProps> = ({
  onSignIn,
  onNotification,
  onSettings,
}) => {
  return (
    // Container to center the toolbar
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex justify-center items-center">
      {/* Main toolbar container */}
      <div className="w-fit h-20 flex-col justify-start items-center gap-[27px] inline-flex">
        {/* Toolbar content with evenly spaced children */}
        <div className="px-6 py-4 bg-white rounded-3xl shadow border border-[#d0d5dd] flex items-center">
          {/* Left section with menu icon */}
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-500" />
          </button>

          {/* Spacer for consistent gap */}
          <div className="w-6" />

          {/* Right section with evenly spaced elements */}
          <div className="flex items-center gap-6">
            {/* Action icons grouped together */}
            <button
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onNotification}
            >
              <Bell className="w-6 h-6 text-gray-500" />
            </button>

            <button
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onSettings}
            >
              <Settings className="w-6 h-6 text-gray-500" />
            </button>

            {/* First vertical divider */}
            <div className="h-12 w-[1px] bg-[#dfdfdf]" />

            {/* Sign in button */}
            <button
              className="px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onSignIn}
            >
              <span className="text-[#004eea] text-base font-semibold font-['Inter'] leading-normal whitespace-nowrap">
                Sign In
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningToolbar;
