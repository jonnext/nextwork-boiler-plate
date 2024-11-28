import { useState } from "react";
import "./App.css";
import TopProgressBar from "./components/TopProgressBar";
import ProjectDetails from "./components/ProjectDetails";
import LearningToolbar from "./components/LearningToolbar";

function App() {
  const [selectedOS, setSelectedOS] = useState<"MacOS" | "Windows" | "Linux">(
    "MacOS"
  );

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <TopProgressBar />
      </div>
      <div className="mx-auto max-w-[688px]">
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
              This means an Amazon Lex chatbot doesn’t just respond, but also
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-36 z-50">
        <LearningToolbar />
      </div>
    </div>
  );
}

export default App;
