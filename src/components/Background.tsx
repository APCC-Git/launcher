export const Background = () => {
  return (
    <div className="absolute flex flex-col items-center justify-between top-0 left-0 w-full h-full">
      <div
        className="w-full"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      >
        <div className="w-full h-[60px] bg-checker"></div>
        <div className="w-full h-[60px] checker"></div>
      </div>
      <div
        className="w-full"
        style={{
          maskImage: "linear-gradient(to top, black 20%, transparent 90%)",
        }}
      >
        <div className="w-full h-[60px] checker"></div>
        <div className="w-full h-[60px] bg-checker"></div>
      </div>
    </div>
  );
};
