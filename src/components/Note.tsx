import React, { useState, useRef, useEffect } from "react";
import { Trash2, GripVertical } from "lucide-react";

interface NoteProps {
  text?: string;
  isLoading?: boolean;
  onDelete?: () => void;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
}

const defaultContent = `This is a note to test the note component. Wowser!`;

const Note: React.FC<NoteProps> = ({
  text = defaultContent,
  isLoading: externalLoading = false,
  onDelete,
  className = "",
  minHeight = 200,
  maxHeight = 800,
}) => {
  const [height, setHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const noteRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  useEffect(() => {
    if (externalLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [externalLoading]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaY = e.clientY - startYRef.current;
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, startHeightRef.current + deltaY)
    );
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={noteRef}
      style={{ height: `${height}px` }}
      className={`w-[688px] p-6 bg-white rounded-3xl border border-[#e7e4e3] flex flex-col gap-6 relative z-10 ${className}`}
    >
      {/* Header with title and delete button */}
      <div className="self-stretch pb-3 border-b border-[#eaecf0] flex justify-between items-center">
        <div className="text-black text-lg font-semibold leading-7">Answer</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2.5 rounded-lg flex justify-center items-center hover:bg-gray-50 transition-colors"
            aria-label="Delete note"
          >
            <Trash2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 w-[640px] flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-2">
          {showLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse space-y-4 w-full">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#101828] text-lg font-normal leading-7 whitespace-pre-line">
              {text}
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle */}
      <button
        className="absolute bottom-2 right-2 p-1 rounded cursor-ns-resize text-gray-400 hover:text-gray-600 transition-colors"
        onMouseDown={handleMouseDown}
        aria-label="Resize note"
      >
        <GripVertical className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Note;
