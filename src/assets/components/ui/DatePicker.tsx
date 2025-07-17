import * as React from "react";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "./Index";
import { Calendar as CalendarComponent } from "./Calendar";
import { cn } from "../../utils/cn";
import { format } from "date-fns";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  trigger: React.ReactNode;
  className?: string;
}

export const DatePicker = ({
  selected,
  onSelect,
  trigger,
  className,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)}>
        <CalendarComponent
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
