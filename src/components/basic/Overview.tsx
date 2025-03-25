import { cn } from "@/lib/utils";
import { OverviewPropsInterface } from "@/types/component";

const Overview = ({
  title,
  content,
  flag = "default",
}: OverviewPropsInterface) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col space-y-1",
        flag === "default" ? "max-w-72" : "max-w-xl"
      )}
    >
      <p className="text-xs text-content">{title}</p>
      <p className="text-xs font-medium">{content}</p>
    </div>
  );
};

export default Overview;
