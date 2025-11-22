import React from "react";
import type { ReactNode } from "react";
import { FileText, Cog, Bolt } from "lucide-react";
import { Badge } from "../ui/badge";
import { MdBolt } from "react-icons/md";

interface WorkStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HowItWorksProps {
  sectionId?: string;
  title?: { text?: string | ReactNode; className?: string };
  description?: { text?: string; className?: string };
  steps?: WorkStep[];
  className?: string;
  featureBadge?: { text?: string; className?: string; icon?: ReactNode };
}

const DEFAULT_STEPS: WorkStep[] = [
  {
    id: "01",
    title: "Collect & Normalize",
    description:
      "Gathers raw subject scores from multiple sources and standardizes them into a unified format.",
    icon: <Cog className="w-6 h-6 text-white" />,
  },
  {
    id: "02",
    title: "Analyze & Compute",
    description:
      "Calculates essential indicators such as score distributions, subject averages, performance tiers and group-based statistics.",
    icon: <Bolt className="w-6 h-6 text-white" />,
  },
  {
    id: "03",
    title: "Precision",
    description:
      "Evaluates total scores across selected subjects and generates accurate leaderboards.",
    icon: <FileText className="w-6 h-6 text-white" />,
  },
];

const HowItWorks2: React.FC<HowItWorksProps> = ({
  sectionId = "",
  title,
  description,
  steps = DEFAULT_STEPS,
  className = "",
  featureBadge,
}) => {
  const {
    text: titleText = (
      <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
        <span>Our Work</span>
        <span className="pl-3 text-primary">Process</span>
      </h1>
    ),
    className: titleClassName = "",
  } = title || {};

  const {
    text: descriptionText = "This guide will walk you through the essential steps to activate and utilize this feature effectively.",
    className: descriptionClassName = "",
  } = description || {};

  const {
    text: featureBadgeText = "How It Works",
    className: featureBadgeClassName = "",
    icon: featureBadgeIcon = <MdBolt size={16} />,
  } = featureBadge || {};

  return (
    <section id={sectionId} className={`py-5 w-full ${className}`}>
      <div className="max-w-4xl flex justify-center mx-auto mb-7">
        <Badge
          variant="outline"
          className={`px-2 py-1 flex items-center gap-1 text-[13px] font-medium border-primary/20 ${featureBadgeClassName}`}
        >
          {featureBadgeIcon}
          {featureBadgeText}
        </Badge>
      </div>

      <div className="max-w-6xl mx-auto text-center">
        {typeof titleText === "string" ? (
          <h2
            className={`text-4xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${titleClassName}`}
          >
            {titleText}
          </h2>
        ) : (
          <>{titleText}</>
        )}

        <p
          className={`opacity-60 max-w-2xl mx-auto max-sm:px-6 leading-relaxed ${descriptionClassName}`}
        >
          {descriptionText}
        </p>

        {/* Steps Container */}
        <div className="pt-14 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              {/* Icon Circle */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-[#0f2289] shadow-none rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                  <span className="text-xs font-bold text-white dark:text-black">
                    {step.id}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm opacity-50 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks2;


