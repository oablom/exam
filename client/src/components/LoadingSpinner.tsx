type Props = {
  fullPage?: boolean;
  message?: string;
};

const LoadingSpinner = ({ fullPage = false, message }: Props) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      {message && <p className="text-zinc-900 text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0  flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
