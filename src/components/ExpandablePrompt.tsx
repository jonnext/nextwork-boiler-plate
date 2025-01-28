import React, { useState, useEffect, useRef } from "react";
import { TextSelect, MessageSquare, PlusIcon, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandablePromptProps {
  onHighlight?: () => void;
  onNote?: () => void;
  onSubmit?: (text: string) => void;
  onExpandChange?: (expanded: boolean) => void;
}

const ExpandablePrompt: React.FC<ExpandablePromptProps> = ({
  onHighlight,
  onNote,
  onSubmit,
  onExpandChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isExpanded]);

  // Notify parent component when expanded state changes
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit?.(inputValue);
      setInputValue("");
      setIsExpanded(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      className="expandable-prompt overflow-hidden mb-1.5 flex justify-center max-w-[688px] w-full"
      initial={false}
      animate={{
        width: isExpanded ? "100%" : "auto",
      }}
      transition={{
        ease: "easeOut",
        duration: 0.2,
      }}
    >
      <motion.div
        className={`
          bg-white rounded-lg border border-gray-200 shadow-sm
          ${isExpanded ? "w-full" : "inline-flex items-center justify-center"}
        `}
        layout
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              className="w-[688px] h-[152px] pt-4 pb-px bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(27,25,24,0.05)] border border-[#e7e4e3] flex-col justify-between items-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-[656px] justify-between items-start inline-flex">
                <div className="pr-4 py-2 bg-white rounded justify-center items-center gap-2 flex flex-1">
                  <div className="text-[#1b1918] text-base font-normal font-['FK Grotesk Neue'] leading-normal animate-pulse"></div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={handleInputClick}
                    placeholder="Ask anything..."
                    className="flex-1 text-[#717680] text-base font-normal font-['FK Grotesk Neue'] leading-normal focus:outline-none caret-[#1b1918]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      } else if (e.key === "Escape") {
                        setIsExpanded(false);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className={`p-2 bg-[#f8f5f1] rounded-lg shadow-[0px_1px_2px_0px_rgba(27,25,24,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(27,25,24,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(27,25,24,0.18)] border border-[#d6d2d0] justify-center items-center flex ${
                    !inputValue.trim() && "opacity-50"
                  }`}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-11 py-1 bg-[#fafaf8] rounded-bl-lg rounded-br-lg flex justify-end items-center">
                <div className="px-3 py-2 rounded-lg justify-center items-center gap-1 inline-flex hover:bg-[#f1efec] cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                  <div className="px-0.5 justify-center items-center flex">
                    <div className="text-[#1b1918] text-sm font-normal font-['FK Grotesk Neue'] leading-tight">
                      Ask community
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex p-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={onHighlight}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg"
              >
                <TextSelect className="w-4 h-4" />
                <span>Highlight</span>
              </button>

              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask</span>
              </button>

              <button
                onClick={onNote}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Note</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ExpandablePrompt;
