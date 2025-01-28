import { useState, useEffect } from "react";
import "./App.css";
import TopProgressBar from "./components/TopProgressBar";
import ProjectDetails from "./components/ProjectDetails";
import LearningToolbar from "./components/LearningToolbar";
import ExpandablePrompt from "./components/ExpandablePrompt";
import Note from "./components/Note";
import { createRoot } from "react-dom/client";

const API_ENDPOINT = "YOUR_AI_API_ENDPOINT";

function App() {
  const [selectedOS, setSelectedOS] = useState<"MacOS" | "Windows" | "Linux">(
    "MacOS"
  );
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    range: Range;
    text: string;
  } | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [notes, setNotes] = useState<
    Array<{
      text: string;
      range: Range;
      id: string;
      container: HTMLElement;
    }>
  >([]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      console.log("Mouse up - Selection:", {
        hasSelection: !!selection,
        text: selection?.toString(),
      });

      if (selection && selection.toString().trim().length > 0) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectionRect(rect);
          setCurrentSelection({
            range: range.cloneRange(),
            text: selection.toString(),
          });

          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
          setIsTextSelected(true);
        } catch (error) {
          console.error("Error getting selection position:", error);
        }
      }
    };

    const handleScroll = () => {
      if (selectionRect && isTextSelected) {
        const updatedRect = currentSelection?.range.getBoundingClientRect();
        if (updatedRect) {
          setSelectionPosition({
            x: updatedRect.left + updatedRect.width / 2,
            y: updatedRect.top,
          });
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("scroll", handleScroll, true);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".expandable-prompt")) {
        // Reset all states to default
        setIsTextSelected(false);
        setCurrentSelection(null);
        setIsExpanded(false);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isTextSelected, currentSelection, selectionRect]);

  const handleHighlight = () => {
    if (currentSelection) {
      console.log("Highlighted text:", currentSelection.text);
      window.getSelection()?.removeAllRanges();
      setIsTextSelected(false);
      setCurrentSelection(null);
    }
  };

  const handleNote = () => {
    console.log("Note clicked");
  };

  const handleSubmit = async (text: string) => {
    console.log("Submitted:", text);

    if (currentSelection) {
      const range = currentSelection.range;

      if (range.endContainer.nodeType === Node.TEXT_NODE) {
        const endContainer = range.endContainer;
        const endOffset = range.endOffset;
        const originalText = endContainer.textContent || "";
        const selectedText = currentSelection.text;

        // Split text
        const beforeText = originalText.slice(0, endOffset);
        const afterText = originalText.slice(endOffset);

        // Get the parent block element
        let parentBlock = endContainer.parentElement;
        while (parentBlock && !["P", "DIV"].includes(parentBlock.tagName)) {
          parentBlock = parentBlock.parentElement;
        }

        if (parentBlock) {
          // Store the original parent block content and structure
          const originalContent = parentBlock.cloneNode(true);

          // Create a new container for all content
          const newContainer = document.createElement("div");
          newContainer.style.cssText = `
            display: block;
            width: 100%;
          `;

          // Create the before text container
          const beforeContainer = document.createElement("div");
          beforeContainer.textContent = beforeText;
          beforeContainer.style.cssText = `
            display: block;
            margin-bottom: 1.5rem;
            font-size: 1.125rem;
            line-height: 1.75rem;
          `;

          // Create the note container
          const noteContainer = document.createElement("div");
          noteContainer.style.cssText = `
            display: block;
            margin: 1.5rem 0;
          `;

          // Create the after text container
          const afterContainer = document.createElement("div");
          afterContainer.textContent = afterText;
          afterContainer.style.cssText = `
            display: block;
            margin-top: 1.5rem;
            font-size: 1.125rem;
            line-height: 1.75rem;
          `;

          // Render the Note component with loading state
          const root = createRoot(noteContainer);
          root.render(
            <Note
              text=""
              isLoading={true}
              onDelete={() => {
                if (parentBlock) {
                  parentBlock.parentElement?.replaceChild(
                    originalContent,
                    parentBlock
                  );
                }
                setNotes((prev) =>
                  prev.filter((note) => note.container !== noteContainer)
                );
              }}
            />
          );

          // Clear and rebuild the content structure
          parentBlock.textContent = "";
          newContainer.appendChild(beforeContainer);
          newContainer.appendChild(noteContainer);
          newContainer.appendChild(afterContainer);
          parentBlock.appendChild(newContainer);

          const noteId = crypto.randomUUID();
          setNotes((prev) => [
            ...prev,
            {
              text,
              id: noteId,
              range,
              container: noteContainer,
            },
          ]);

          try {
            // Call AI API
            const response = await fetch(API_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                question: text,
                context: selectedText,
              }),
            });

            if (!response.ok) throw new Error('API request failed');
            
            const aiResponse = await response.json();

            // Update note with AI response
            root.render(
              <Note
                text={aiResponse.answer}
                isLoading={false}
                onDelete={() => {
                  if (parentBlock) {
                    parentBlock.parentElement?.replaceChild(
                      originalContent,
                      parentBlock
                    );
                  }
                  setNotes((prev) =>
                    prev.filter((note) => note.container !== noteContainer)
                  );
                }}
              />
            );
          } catch (error) {
            console.error('Error getting AI response:', error);
            // Update note with error state
            root.render(
              <Note
                text="Sorry, I couldn't generate an answer at this time. Please try again later."
                isLoading={false}
                onDelete={() => {
                  if (parentBlock) {
                    parentBlock.parentElement?.replaceChild(
                      originalContent,
                      parentBlock
                    );
                  }
                  setNotes((prev) =>
                    prev.filter((note) => note.container !== noteContainer)
                  );
                }}
              />
            );
          }

          // After creating the note, hide the expandable prompt
          setIsTextSelected(false);
          setCurrentSelection(null);
          window.getSelection()?.removeAllRanges();
        }
      }
    }

    setIsExpanded(false);
  };

  const handleExpandCollapse = (expanded: boolean) => {
    setIsExpanded(expanded);

    if (expanded && currentSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(currentSelection.range);
      }
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <TopProgressBar />
      </div>
      <div className="mx-auto max-w-[688px] select-text">
        <div className="w-[688px] flex flex-col pt-16 gap-16">
          <div className="h-[142px] flex-col justify-start items-start gap-4 inline-flex">
            <div className="justify-start items-center gap-4 inline-flex">
              <div className="px-2.5 py-1 bg-white rounded-lg shadow border border-[#d0d5dd] justify-start items-center gap-1.5 flex">
                <div className="w-2 h-2 relative">
                  <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#2970ff] rounded-full" />
                </div>
                <div className="text-center text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                  PROJECT
                </div>
              </div>
            </div>
            <div className="self-stretch h-[98px] flex-col justify-start items-start gap-2 flex">
              <div className="text-left self-stretch text-[#101828] text-5xl font-medium font-['Inter'] leading-[60px]">
                Build a chatbot with AWS LEX
              </div>
              <div className="text-left self-stretch text-[#344054] text-xl font-normal font-['Inter'] leading-[30px]">
                Let's create your very own banking chatbot, the BankerBot!{" "}
              </div>
            </div>
          </div>
          <ProjectDetails selectedOS={selectedOS} onSelectOS={setSelectedOS} />
          <div className="h-[378px] flex-col justify-start items-center gap-6 inline-flex">
            <div className="text-left self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
              ⚡️ 30 second Summary
            </div>
            <div className="text-left self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7">
              Let's create your very own banking chatbot, the BankerBot! This
              project is going to supercharge your skills in Amazon Lex and AWS
              Lambda, giving you the power to build something interactive and
              practical.
              <br />
              Amazon Lex is a tool that helps you create programs that can talk
              or chat with people, just like Siri or Alexa. It understands what
              people say or type and helps the program respond in a useful way.
              <br />
              This means an Amazon Lex chatbot doesn't just respond, but also
              uses AI/ML to understand the user's goals and processes requests
              about their bank balances and transactions. You can even converse
              with your BankerBot using voice commands!
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-left self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7">
              Want a complete demo of how to do this project, from start to
              finish? Check out our 🎬 walkthrough with Natasha 🎬
            </div>
            <iframe
              className="w-full aspect-video rounded-lg"
              src="https://www.youtube.com/embed/Ab_ybGhjHz4"
              title="Project Walkthrough with Natasha"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      {isTextSelected && (
        <div
          className="fixed z-[9999] w-full left-0 flex justify-center"
          style={{
            top: `${selectionPosition.y}px`,
            transform: "translateY(-100%)",
            pointerEvents: "auto",
          }}
        >
          <ExpandablePrompt
            onHighlight={handleHighlight}
            onNote={handleNote}
            onSubmit={handleSubmit}
            onExpandChange={handleExpandCollapse}
          />
        </div>
      )}
      <div className="fixed bottom-4 left-0 w-full z-50">
        <LearningToolbar />
      </div>
    </div>
  );
}

export default App;
