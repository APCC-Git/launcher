interface Props {
  config: {
    diameterVH: number;
    outlineWithVH: number;
    rotationSpeed: number;
    holeSize: number;
    innerHoleSize: number;
    trackCount: number;
    trackOffset: number;
    trackSpacing: number;
  };
  cdRotation?: number;
  cdImage: string;
  className?: string;
}

export const CD = ({ config, cdRotation, cdImage, className }: Props) => {
  return (
    <div className={`relative ${className}`}>
      {/* CDの外側 */}
      <div
        className="rounded-full bg-gradient-to-br backdrop-blur-lg shadow-2xl"
        style={{
          width: `${config.diameterVH}vh`,
          height: `${config.diameterVH}vh`,
          transform: `rotate(${cdRotation}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 rounded-full bg-white"
          style={{
            width: `${config.diameterVH - config.outlineWithVH}vh`,
            height: `${config.diameterVH - config.outlineWithVH}vh`,
            backgroundImage: `url(${cdImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
        {/* CD中央の穴 */}
        <div
          className="absolute top-1/2 left-1/2 bg-gray-300 rounded-full shadow-inner"
          style={{
            width: config.holeSize,
            height: config.holeSize,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 bg-background rounded-full"
            style={{
              width: config.innerHoleSize,
              height: config.innerHoleSize,
              transform: "translate(-50%, -50%)",
              boxShadow: "inset 0px 12px 25px 5px rgba(0, 0, 0, 0.4)",
            }}
          ></div>
        </div>

        {/* CDの反射効果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-conic from-transparent via-white/20 to-transparent opacity-60"></div>

        {/* CDのトラック線 */}
        {Array.from({ length: config.trackCount }).map((_, i) => {
          const offset = config.trackOffset + i * config.trackSpacing;
          return (
            <div
              key={i}
              className="absolute border border-gray-400/30 rounded-full"
              style={{
                top: offset,
                left: offset,
                right: offset,
                bottom: offset,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
