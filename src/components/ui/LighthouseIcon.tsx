import Image from "next/image";

export function LighthouseIcon({
  className,
  size = 24,
  color = "black",
}: {
  className?: string;
  size?: number;
  color?: "black" | "white";
}) {
  const getFilter = () => {
    if (color === "white") {
      return "brightness(0) invert(1)";
    }
    return "brightness(0)";
  };

  return (
    <Image
      src="/lighthouse.svg"
      alt="Lighthouse"
      width={size}
      height={size}
      className={`${className} inline`}
      style={{ filter: getFilter() }}
    />
  );
}
