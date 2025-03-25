"use client";

import { useEffect, useRef, useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useFormContext } from 'react-hook-form';

interface DateOTPInputProps {
  form: Control<any>;
  id: string;
  disabled?: boolean;
}

const DateOTPInput = ({ form, id, disabled = false }: DateOTPInputProps) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isInitialUpdate, setIsInitialUpdate] = useState(true);
  
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDayChange = (value: string, onChange: (date: Date | null) => void) => {
    const numValue = value.replace(/\D/g, "");
    if (numValue.length <= 2) {
      setDay(numValue);
      if (numValue.length === 2 && monthRef.current) {
        monthRef.current.focus();
      }
      updateDate(numValue, month, year, onChange);
    }
  };

  const handleMonthChange = (value: string, onChange: (date: Date | null) => void) => {
    const numValue = value.replace(/\D/g, "");
    if (numValue.length <= 2) {
      setMonth(numValue);
      if (numValue.length === 2 && yearRef.current) {
        yearRef.current.focus();
      }
      updateDate(day, numValue, year, onChange);
    }
  };

  const handleYearChange = (value: string, onChange: (date: Date | null) => void) => {
    const numValue = value.replace(/\D/g, "");
    if (numValue.length <= 4) {
      setYear(numValue);
      updateDate(day, month, numValue, onChange);
    }
  };

  const updateDate = (
    dayValue: string,
    monthValue: string,
    yearValue: string,
    onChange: (date: Date | null) => void
  ) => {
    if (dayValue && monthValue && yearValue.length === 4) {
      const dateString = `${yearValue}-${monthValue.padStart(2, "0")}-${dayValue.padStart(2, "0")}`;
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    }
  };

  const { getValues } = useFormContext();

  useEffect(() => {
    if (getValues()[id] && isInitialUpdate) {
      const date = new Date(getValues()[id]);
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString().padStart(2, "0"));
        setMonth((date.getMonth() + 1).toString().padStart(2, "0"));
        setYear(date.getFullYear().toString());
      }
      setIsInitialUpdate(false);
    }
  }, [form, id, isInitialUpdate, getValues]);

  return (
    <FormField
      control={form}
      name={id}
      render={({ field }) => {

        return (
          <FormItem className="w-full">
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input
                  ref={dayRef}
                  className="h-10 w-16 text-center"
                  placeholder="TT"
                  maxLength={2}
                  value={day}
                  onChange={(e) => handleDayChange(e.target.value, field.onChange)}
                  disabled={disabled}
                />
                <span className="text-lg">.</span>
                <Input
                  ref={monthRef}
                  className="h-10 w-16 text-center"
                  placeholder="MM"
                  maxLength={2}
                  value={month}
                  onChange={(e) => handleMonthChange(e.target.value, field.onChange)}
                  disabled={disabled}
                />
                <span className="text-lg">.</span>
                <Input
                  ref={yearRef}
                  className="h-10 w-20 text-center"
                  placeholder="JJJJ"
                  maxLength={4}
                  value={year}
                  onChange={(e) => handleYearChange(e.target.value, field.onChange)}
                  disabled={disabled}
                />
              </div>
            </FormControl>
            <FormMessage className="text-left" />
          </FormItem>
        );
      }}
    />
  );
};

export default DateOTPInput;
