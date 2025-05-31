// src/components/ui/calendar.tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { 
  DayPicker, 
  type DayPickerProps, 
  type CustomComponents 
  // Removed NavButtonProps import
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = DayPickerProps;

// Define NavButtonProps locally based on react-day-picker's expected props for these slots
interface LocalNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  displayMonth: Date; 
  // Add other specific props if react-day-picker passes them to Previous/NextMonthButton slots
  // For example, 'dir?: "rtl" | "ltr"' if it's relevant for your styling or logic
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: componentsFromProps, 
  ...props
}: CalendarProps) {

  const defaultNavButtonComponents = {
    PreviousMonthButton: ({ displayMonth, ...buttonHTMLProps }: LocalNavButtonProps) => (
      <button
        type="button"
        {...buttonHTMLProps} 
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", 
          "absolute left-1", 
          buttonHTMLProps.className 
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    ),
    NextMonthButton: ({ displayMonth, ...buttonHTMLProps }: LocalNavButtonProps) => (
      <button
        type="button"
        {...buttonHTMLProps}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", 
          "absolute right-1", 
          buttonHTMLProps.className
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    ),
  };

  const mergedComponents = {
    ...defaultNavButtonComponents,
    ...(componentsFromProps || {}),
  } as CustomComponents; 

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center", // Default caption will be used if not overridden by mergedComponents.Caption
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center", 
        nav_button: cn( 
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1", 
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={mergedComponents}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };