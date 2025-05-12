type Props = {
  fullPage?: boolean;
  message?: string;
};

const LoadingSpinner = ({ fullPage = false, message }: Props) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
