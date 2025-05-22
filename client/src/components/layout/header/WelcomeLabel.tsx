import React from "react";

interface WelcomeLabelProps {
  name?: string;
  compact?: boolean;
}

const WelcomeLabel: React.FC<WelcomeLabelProps> = ({
  name,
  compact = false,
}) => {
  if (!name) return null;

  const firstName = name.split(" ")[0];

  return (
    <span
      className={`
        text-sm text-gray-600 dark:text-gray-300
        ${compact ? "hidden sm:inline" : ""}
      `}
    >
      {compact ? `${firstName}'s todolista` : `Välkommen, ${firstName}!`}
    </span>
  );
};

export default WelcomeLabel;
