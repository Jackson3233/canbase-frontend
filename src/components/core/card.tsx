import { CardHeader } from '../ui/card';

export type CanbaseCardHeaderProps = {
  headline: string;
  description?: string;
}

export const CanbaseCardHeader = ({
  headline,
  description
}: CanbaseCardHeaderProps) => {
  return (
    <CardHeader className="p-0">
      <div className="flex flex-col space-y-4 border-b pb-6 mb-6">
        <div className="flex flex-col space-y-2 px-6 pt-6">
          <h1 className="text-2xl font-semibold mobile:text-xl">{headline}</h1>
          {description && <p className="text-sm text-content mobile:text-xs">{description}</p>}
        </div>
      </div>
    </CardHeader>
  );
}