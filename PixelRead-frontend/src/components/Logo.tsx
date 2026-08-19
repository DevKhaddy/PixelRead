import { Camera } from "lucide-react";

export default function Logo({ iconSize = 14 }: { iconSize?: number }) {
  return (
    <div
      className="w-7 h-7 rounded-md grid place-items-center shrink-0"
      style={{ background: "linear-gradient(135deg,#F5D896,#E8B54C)" }}
    >
      <Camera size={iconSize} color="#1A1408" />
    </div>
  );
}
