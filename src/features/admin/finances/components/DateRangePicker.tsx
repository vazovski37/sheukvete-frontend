// src/features/admin/finances/components/DateRangePicker.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format,
  parseISO,
  isValid,
  startOfMonth,
  getYear,
  getMonth,
  setYear,
  setMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Import CaptionProps for type safety if needed, but we'll pass a custom onMonthChange
import type { CaptionProps as RDPCaptionProps } from "react-day-picker";


interface CustomCalendarCaptionProps {
  currentMonth: Date; // The month currently displayed by the parent Calendar
  onMonthNavigate: (date: Date) => void; // Callback to change the parent Calendar's month
  // Optional: for disabling prev/next if at fromDate/toDate limits
  // previousMonthDisabled?: boolean;
  // nextMonthDisabled?: boolean;
}

function ShadcnCustomCalendarCaption({ currentMonth, onMonthNavigate }: CustomCalendarCaptionProps) {
  const currentYear = getYear(currentMonth);
  const currentDisplayMonthValue = getMonth(currentMonth); // 0-11 for date-fns

  const startYearRange = Math.min(2000, currentYear - 10);
  const endYearRange = Math.max(new Date().getFullYear() + 5, currentYear + 10);
  const years = Array.from({ length: endYearRange - startYearRange + 1 }, (_, i) => startYearRange + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(setMonth(new Date(currentYear, 0, 1), i), "MMMM"),
  }));

  const handleMonthChange = (monthValue: string) => {
    const newMonthIndex = parseInt(monthValue, 10);
    if (!isNaN(newMonthIndex)) {
      onMonthNavigate(setMonth(currentMonth, newMonthIndex));
    }
  };

  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue, 10);
    if (!isNaN(newYear)) {
      onMonthNavigate(setYear(currentMonth, newYear));
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-2 h-12 relative">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label="Go to previous month"
        // disabled={previousMonthDisabled} // If you pass this prop
        onClick={() => onMonthNavigate(subMonths(currentMonth, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-x-2">
        <Select value={String(currentDisplayMonthValue)} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-8 w-[110px] text-xs focus:ring-offset-0 focus:ring-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={String(month.value)} className="text-xs">
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(currentYear)} onValueChange={handleYearChange}>
          <SelectTrigger className="h-8 w-[75px] text-xs focus:ring-offset-0 focus:ring-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)} className="text-xs">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label="Go to next month"
        // disabled={nextMonthDisabled} // If you pass this prop
        onClick={() => onMonthNavigate(addMonths(currentMonth, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}


interface DateRangePickerProps {
  initialStartDateString: string;
  initialEndDateString: string;
  onFilterSubmit: (filter: { start: string; end: string }) => void;
  isLoading: boolean;
}

export function DateRangePicker({
  initialStartDateString,
  initialEndDateString,
  onFilterSubmit,
  isLoading,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const parsed = parseISO(initialStartDateString);
    return isValid(parsed) ? parsed : undefined;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const parsed = parseISO(initialEndDateString);
    return isValid(parsed) ? parsed : undefined;
  });
  const [isMounted, setIsMounted] = useState(false);

  const [startCalendarDisplayMonth, setStartCalendarDisplayMonth] = useState<Date>(
    startDate || startOfMonth(new Date())
  );
  const [endCalendarDisplayMonth, setEndCalendarDisplayMonth] = useState<Date>(
    endDate || (startDate ? startOfMonth(startDate) : startOfMonth(new Date()))
  );

  useEffect(() => {
    setIsMounted(true);
    const initialStart = parseISO(initialStartDateString);
    const initialEnd = parseISO(initialEndDateString);
    if (isValid(initialStart)) {
        setStartDate(initialStart);
        setStartCalendarDisplayMonth(startOfMonth(initialStart));
    }
    if (isValid(initialEnd)) {
        setEndDate(initialEnd);
        setEndCalendarDisplayMonth(startOfMonth(initialEnd));
    }
  }, [initialStartDateString, initialEndDateString]);


  const handleSubmit = () => {
    if (!startDate || !endDate) { toast.error("Please select both start and end dates."); return; }
    if (startDate > endDate) { toast.error("Start date cannot be after end date."); return; }
    onFilterSubmit({
      start: format(startDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
    });
  };

  const calendarClassNames = { /* ... same as before ... */
    months: "flex flex-col",
    month: "space-y-1.5 p-3 pt-0",
    caption: "hidden", // Hide default caption, our custom component replaces it
    table: "w-full border-collapse",
    head_row: "flex justify-around mb-1",
    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
    row: "flex w-full mt-1 justify-around",
    cell: cn("h-7 w-7 text-center text-xs p-0 relative",
      "[&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
      "focus-within:relative focus-within:z-20"),
    day: cn("h-7 w-7 p-0 font-normal aria-selected:opacity-100 rounded-md",
      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"),
    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
    day_today: "ring-1 ring-primary text-primary rounded-md",
    day_outside: "text-muted-foreground opacity-30",
    day_disabled: "text-muted-foreground opacity-30",
  };

  if (!isMounted) { /* Skeleton */
    return (
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-lg font-semibold">Select Date Range</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"> <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-[280px] w-full" /> <Skeleton className="h-4 w-1/2" /> </div>
            <div className="space-y-2"> <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-[280px] w-full" /> <Skeleton className="h-4 w-1/2" /> </div>
          </div>
          <div className="flex justify-start"> <Skeleton className="h-10 w-32" /> </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Select Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 ">
          <div className="flex flex-col w-min space-y-2 items-center">
            <p className="text-sm font-medium text-muted-foreground self-center md:self-start">Start Date</p>
            <div className="rounded-md border bg-card shadow-sm max-w-[280px] mx-auto md:mx-0">
              <Calendar
                mode="single"
                selected={startDate}
                month={startCalendarDisplayMonth} // Controlled by DateRangePicker state
                onMonthChange={setStartCalendarDisplayMonth} // Updates DateRangePicker state
                onSelect={(date) => {
                  setStartDate(date || undefined);
                  if (date) setStartCalendarDisplayMonth(startOfMonth(date));
                  if (date && endDate && date > endDate) setEndDate(undefined);
                }}
                disabled={isLoading}
                fromYear={2000} toYear={new Date().getFullYear() + 5}
                classNames={calendarClassNames}
                components={{
                  Caption: (captionProps) => (
                    <ShadcnCustomCalendarCaption
                      currentMonth={captionProps.displayMonth} // Pass RDP's displayMonth
                      onMonthNavigate={setStartCalendarDisplayMonth} // Pass our state setter
                    />
                  ),
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground h-4 pl-1 text-center md:text-left">
              {startDate ? format(startDate, "PPP") : <span>&nbsp;</span>}
            </p>
          </div>

          <div className="flex flex-col w-min space-y-2 items-center">
            <p className="text-sm font-medium text-muted-foreground self-center md:self-start">End Date</p>
            <div className="rounded-md border bg-card shadow-sm max-w-[280px] mx-auto md:mx-0">
              <Calendar
                mode="single"
                selected={endDate}
                month={endCalendarDisplayMonth} // Controlled
                onMonthChange={setEndCalendarDisplayMonth} // Controlled
                onSelect={(date) => {
                  setEndDate(date || undefined);
                  if (date) setEndCalendarDisplayMonth(startOfMonth(date));
                }}
                disabled={isLoading || !startDate}
                fromDate={startDate}
                fromYear={startDate ? getYear(startDate) : 2000}
                toYear={new Date().getFullYear() + 5}
                classNames={calendarClassNames}
                components={{
                  Caption: (captionProps) => (
                    <ShadcnCustomCalendarCaption
                      currentMonth={captionProps.displayMonth}
                      onMonthNavigate={setEndCalendarDisplayMonth}
                    />
                  ),
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground h-4 pl-1 text-center md:text-left">
              {endDate ? format(endDate, "PPP") : <span>&nbsp;</span>}
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end pt-4">
          <Button onClick={handleSubmit} disabled={isLoading || !startDate || !endDate} size="default" className="w-full sm:w-auto md:w-auto min-w-[120px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Apply Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}