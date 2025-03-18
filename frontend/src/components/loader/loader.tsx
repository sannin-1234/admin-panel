export interface LoaderProps {
  isFullScreen?: any;
}

const Loader = (props: LoaderProps) => {
  const { isFullScreen = true } = props;
  return (
    <div
      className={`flex items-center justify-center ${
        isFullScreen ? "min-h-screen" : ""
      }`}
    >
      <div className="w-10 h-10 border-4 border-mint border-t-yellow border-r-terracotta border-b-purple rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
