"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { DateTimePicker } from "../ui/datetime-picker";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { RichTextEditor } from "../editor/RichTextEditor";
import { cn } from "@/lib/utils";
import { ProfileInputPropsInterface } from "@/types/component";

const ProfileInput = ({
  form,
  flag = "default",
  type = "input",
  id,
  title,
  content,
  minValue = -9999999999,
  maxValue = 9999999999,
  checkboxLabel = "",
  radioValues = [],
  checkboxValues = [],
  selectValues = [],
  textWidth = "max-w-64",
  tag = "",
  handleValue,
  placeholder = "",
  disabled = false,
  actionButton,
}: ProfileInputPropsInterface) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="w-full flex justify-between tablet:flex-col" id={id}>
      {flag === "default" && (
        <div
          className={cn(
            "w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2",
            textWidth
          )}
        >
          <p className="font-medium mobile:text-sm">{title}</p>
          {content && (
            <p className="text-sm text-content mobile:text-xs">{content}</p>
          )}
        </div>
      )}
      {type === "input" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex flex-col">
                  <Input
                    className={cn(flag === "default" ? "h-9" : "h-10")}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...field}
                  />
                  {actionButton && (
                    <div className="flex justify-end mt-2">
                      <span
                        className="text-sm text-gray-500 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={actionButton.onClick}
                      >
                        {actionButton.text}
                      </span>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "password" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Input
                    className="h-10 pr-10"
                    type={isShow ? "text" : "password"}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...field}
                  />
                  <Button
                    className="absolute h-full right-0 top-0 hover:bg-transparent hover:text-customhover"
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShow((prev) => !prev)}
                  >
                    {isShow ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "number" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className={cn(flag === "default" ? "h-9" : "h-10")}
                  type="number"
                  min={minValue}
                  max={maxValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "tagInput" && (
        <FormField
          control={form}
          name={id}
          render={({ field: { value, onChange } }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex justify-between">
                  <Input
                    className="h-9  border-r-0 rounded-r-none focus-visible:ring-0"
                    type="number"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      if (handleValue) handleValue(e.target.value);
                    }}
                    min={minValue}
                    max={maxValue}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                  <div className="flex items-center px-3 bg-[#EFEFEF] border border-input rounded-r-md shadow-sm">
                    <p className="text-xs text-center text-content">{tag}</p>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "email" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className={cn(flag === "default" ? "h-9" : "h-10")}
                  type="email"
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "radio" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {radioValues.map((item, key) => (
                    <FormItem key={key}>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id={item.id} value={item.value} />
                          <Label
                            className="text-sm text-content mobile:text-xs"
                            htmlFor={item.id}
                          >
                            {item.value}
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "checkbox" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="flex justify-center items-center w-3 h-3"
                    id={checkboxLabel}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    className="text-sm text-content mobile:text-xs"
                    htmlFor={checkboxLabel}
                  >
                    {checkboxLabel}
                  </Label>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "checkboxs" && (
        <FormField
          control={form}
          name={id}
          render={() => (
            <FormItem className="w-full">
              {checkboxValues.map((item, key) => (
                <FormField
                  key={key}
                  control={form}
                  name={id}
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id}>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={item.id}
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: any) => value !== item.value
                                      )
                                    );
                              }}
                            />
                            <Label
                              className="text-sm text-content mobile:text-xs"
                              htmlFor={item.id}
                            >
                              {item.value}
                            </Label>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "switch" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "selectbox" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectValues.map((item, key) => (
                    <SelectItem key={key} value={item.key}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
      {type === "date" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DateTimePicker
                  aria-label={id}
                  jsDate={field.value ? new Date(field.value) : null}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {type === "textarea" && (
        <FormField
          control={form}
          name={id}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <RichTextEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder={placeholder}
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ProfileInput;
