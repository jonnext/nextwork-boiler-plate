import React from "react";
import {
  Clock,
  DollarSign,
  Flame,
  Package,
  Server,
  Monitor,
} from "lucide-react";

interface ProjectDetailsProps {
  difficulty?: string;
  time?: string;
  cost?: string;
  requirements?: string[];
  awsServices?: string[];
  selectedOS?: "MacOS" | "Windows" | "Linux";
  onSelectOS?: (os: "MacOS" | "Windows" | "Linux") => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  difficulty = "Pretty spicy",
  time = "2 - 2.5 hour",
  cost = "$1.30",
  requirements = [
    'An AWS account - <span class="underline">Create one here</span>',
    "A project buddy",
  ],
  awsServices = ["Amazon Lex", "Amazon Lambda", "AWS ECR", "Docker"],
  selectedOS = "MacOS",
  onSelectOS,
}) => {
  const DetailHeader = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 p-2 rounded-md shadow border border-[#eaecf0] flex justify-center items-center">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="text-[#101828] text-sm font-semibold leading-tight">
          {label}
        </div>
      </div>
      <div className="text-[#101828] text-sm font-normal leading-tight">
        {value}
      </div>
    </div>
  );

  const operatingSystems = ["MacOS", "Windows", "Linux"] as const;

  return (
    <div className="h-[424px] py-12 border-t border-b border-[#eaecf0] flex-col justify-start items-start gap-8 inline-flex">
      <div className="h-[328px] flex-col justify-start items-start gap-10 flex">
        <div className="self-stretch justify-start items-start gap-16 inline-flex">
          <DetailHeader icon={Flame} label="DIFFICULTY" value={difficulty} />
          <DetailHeader icon={Clock} label="TIME" value={time} />
          <DetailHeader icon={DollarSign} label="COST" value={cost} />
        </div>

        <div className="self-stretch flex items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 p-2 rounded-md shadow border border-[#eaecf0] flex justify-center items-center">
              <Package className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-[#101828] text-sm font-semibold leading-tight">
              WHAT YOU'LL NEED
            </div>
          </div>
          <div className="text-left pt-1.5 flex flex-col gap-2">
            <div className="text-[#475467] text-sm leading-tight">
              {requirements.map((req, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: req }} />
              ))}
            </div>
          </div>
        </div>

        <div className="self-stretch flex items-start gap-8">
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className="w-8 h-8 p-2 rounded-md shadow border border-[#eaecf0] flex justify-center items-center">
              <Server className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-[#101828] text-sm font-semibold leading-tight whitespace-nowrap">
              AWS SERVICES
            </div>
          </div>
          <div className="text-left pt-1.5 flex items-center gap-2">
            <div className="text-[#475467] text-sm leading-tight">
              {awsServices.map((service, index) => (
                <div key={index}>{service}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="self-stretch flex items-center gap-[45px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 p-2 rounded-md shadow border border-[#eaecf0] flex justify-center items-center">
              <Monitor className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-[#101828] text-sm font-semibold leading-tight">
              MY OPERATING SYSTEM
            </div>
          </div>
          <div className="p-1 bg-gray-50 rounded-[10px] border border-[#eaecf0] flex items-center gap-1">
            {operatingSystems.map((os) => (
              <button
                key={os}
                onClick={() => onSelectOS?.(os)}
                className={`px-3 py-2 ${
                  selectedOS === os
                    ? "bg-white rounded-md shadow text-[#344054]"
                    : "text-[#667085] hover:text-[#344054] transition-colors"
                } flex justify-center items-center gap-2`}
              >
                <div className="text-sm font-semibold leading-tight">{os}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
