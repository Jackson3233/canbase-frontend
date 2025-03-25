import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ClubCardPropsInterface } from "@/types/component";

const ClubCard = ({
  title,
  icon,
  content,
  btnIcon,
  btnText,
  route,
}: ClubCardPropsInterface) => {
  return (
    <Card className="p-10 tablet:p-7 mobile:p-5">
      <CardContent className="h-full flex flex-col justify-between p-0">
        <div className="flex flex-col space-y-4">
          {icon}
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold mobile:text-xl">{title}</h1>
            <p className="text-sm text-content mobile:text-xs">{content}</p>
          </div>
        </div>
        <Link className="mt-4" href={route}>
          <Button className="h-10 flex items-center px-4 text-sm bg-custom mobile:w-full mobile:text-xs hover:bg-customhover">
            {btnIcon}
            <span className="ml-2.5 text-sm">{btnText}</span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ClubCard;
