import { cn } from "@/lib/utils";
import { TextGroupPropsInterface } from "@/types/component";

const TextGroup = ({
  type = "default",
  title,
  value,
  html,
  children,
}: TextGroupPropsInterface) => {
  return (
    <div
      className={cn(
        "w-full flex justify-between py-3 text-sm tablet:py-2 mobile:py-2",
        type !== "last" && "border-b"
      )}
    >
      <p className="max-w-36 w-full text-content mr-32 laptop:mr-16 tablet:mr-8 mobile:mr-4">
        {title}
      </p>
      {value && <p className="w-full break-all">{value}</p>}
      {html && <p className="w-full break-all">{html}</p>}
      {children}
    </div>
  );
};

export default TextGroup;
