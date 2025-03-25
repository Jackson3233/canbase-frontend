import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { AddressInputPropsInterface } from "@/types/component";

const AddressInput = ({
  form,
  type = "default",
  content,
  textWidth = "max-w-64",
  disabled = false,
}: AddressInputPropsInterface) => {
  return (
    <div className="w-full flex justify-between tablet:flex-col" id="address">
      <div
        className={cn(
          "w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2",
          textWidth
        )}
      >
        <p className="font-medium mobile:text-sm">
          {type === "default" ? "Adresse" : "Adresse*"}
        </p>
        {content && (
          <p className="text-sm text-content mobile:text-xs">{content}</p>
        )}
      </div>
      <div className="w-full flex flex-col space-y-2">
        <div className="w-full flex space-x-3 tablet:flex-col tablet:space-x-0 tablet:space-y-3">
          <FormField
            control={form}
            name="street"
            render={({ field }) => (
              <FormItem className="w-2/3 tablet:w-full">
                <FormControl>
                  <Input
                    className="h-9"
                    placeholder="Straße"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form}
            name="address"
            render={({ field }) => (
              <FormItem className="w-1/3 tablet:w-full">
                <FormControl>
                  <Input
                    className="h-9"
                    placeholder="Hausnummer"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex space-x-3 tablet:flex-col tablet:space-x-0 tablet:space-y-3">
          <FormField
            control={form}
            name="postcode"
            render={({ field }) => (
              <FormItem className="w-1/3 tablet:w-full">
                <FormControl>
                  <Input
                    className="h-9"
                    placeholder="Postleitzahl"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form}
            name="city"
            render={({ field }) => (
              <FormItem className="w-2/3 tablet:w-full">
                <FormControl>
                  <Input
                    className="h-9"
                    placeholder="Stadt"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form}
          name="country"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="h-9"
                  placeholder="Deutschland"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressInput;
