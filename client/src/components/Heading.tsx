interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <h1 className="text-2xl text-center font-bold">{title}</h1>
      {subtitle && (
        <p className="text-sm text-center text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

export default Heading;
