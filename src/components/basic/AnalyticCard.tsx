import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { AnalyticPropsInterface } from "@/types/component";

const Analytic = ({
  title,
  content,
  info,
  icon,
  isComingSoon = false,
}: AnalyticPropsInterface) => {
  return (
    <Card>
      <CardContent className="p-8 tablet:p-5">
        <div className="flex justify-between items-center">
          <p className="font-bold">{title}</p>
          {icon}
        </div>
        {isComingSoon ? (
          <Badge className="w-fit h-fit p-1.5 mt-4 text-xs text-custom font-medium whitespace-nowrap bg-customforeground rounded-md">
            Neue Features
          </Badge>
        ) : (
          <>
            <p className="text-3xl mt-4 mb-2 tablet:text-2xl mobile:text-xl">
              {content}
            </p>
            <p className="text-xs text-content">{info}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Analytic;

