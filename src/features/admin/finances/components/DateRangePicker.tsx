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
// Import the specific CaptionProps from react-day-picker
// Also import CalendarMonth if we need to inspect its structure, though we'll try to avoid it.
import type { CaptionProps, CalendarMonth } from "react-day-picker"; 


interface CustomCalendarCaptionProps {
  currentMonth: Date; 
  onMonthNavigate: (date: Date) => void; 
}

function ShadcnCustomCalendarCaption({ currentMonth, onMonthNavigate }: CustomCalendarCaptionProps) {
  const currentYear = getYear(currentMonth);
  const currentDisplayMonthValue = getMonth(currentMonth); 

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
    () => {
        const initial = parseISO(initialStartDateString);
        return isValid(initial) ? startOfMonth(initial) : startOfMonth(new Date());
    }
  );
  const [endCalendarDisplayMonth, setEndCalendarDisplayMonth] = useState<Date>(
    () => {
        const initial = parseISO(initialEndDateString);
        const initialStart = parseISO(initialStartDateString); 
        if (isValid(initial)) return startOfMonth(initial);
        if (isValid(initialStart)) return startOfMonth(initialStart); 
        return startOfMonth(new Date());
    }
  );

  useEffect(() => {
    setIsMounted(true);
    const initialStart = parseISO(initialStartDateString);
    if (isValid(initialStart) && startDate?.toISOString() !== initialStart.toISOString()) {
        setStartDate(initialStart);
        setStartCalendarDisplayMonth(startOfMonth(initialStart));
    }
    const initialEnd = parseISO(initialEndDateString);
     if (isValid(initialEnd) && endDate?.toISOString() !== initialEnd.toISOString()) {
        setEndDate(initialEnd);
        setEndCalendarDisplayMonth(startOfMonth(initialEnd));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStartDateString, initialEndDateString]);


  const handleSubmit = () => {
    if (!startDate || !endDate) { toast.error("Please select both start and end dates."); return; }
    if (startDate > endDate) { toast.error("Start date cannot be after end date."); return; }
    onFilterSubmit({
      start: format(startDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
    });
  };

  const calendarClassNamesFromUser = { 
    months: "flex flex-col",
    month: "space-y-1.5 p-3 pt-0",
    caption: "hidden", 
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


  if (!isMounted) { 
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

  // Helper to extract a representative date from the captionProps TypeScript is seeing
  const getMonthFromCaptionProps = (props: any): Date => {
    if (props.month instanceof Date) { // Ideal case, react-day-picker v9 standard
      return props.month;
    }
    // Fallback based on the error message structure: { calendarMonth: CalendarMonth; ... }
    // A CalendarMonth is an array of weeks, each week an array of days.
    // We try to get a date from the first non-empty week and first day.
    if (props.calendarMonth && Array.isArray(props.calendarMonth)) {
      const firstWeekWithDays = props.calendarMonth.find((week: any[]) => week && week.length > 0 && week[0] && week[0].date);
      if (firstWeekWithDays && firstWeekWithDays[0].date instanceof Date) {
        return startOfMonth(firstWeekWithDays[0].date); // Get start of that month
      }
    }
    // Absolute fallback if structure is totally unexpected
    return props.displayIndex !== undefined ? addMonths(new Date(), props.displayIndex) : new Date();
  };


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Select Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 ">
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <p className="text-sm font-medium text-muted-foreground self-center sm:self-start">Start Date</p>
            <div className="rounded-md border bg-card shadow-sm w-full max-w-[280px] sm:w-auto mx-auto sm:mx-0">
              <Calendar
                mode="single"
                selected={startDate}
                month={startCalendarDisplayMonth} 
                onMonthChange={setStartCalendarDisplayMonth} 
                onSelect={(date) => {
                  setStartDate(date || undefined);
                  if (date) setStartCalendarDisplayMonth(startOfMonth(date));
                  if (date && endDate && date > endDate) {
                     setEndDate(undefined); 
                     if (endCalendarDisplayMonth < startOfMonth(date)) { 
                        setEndCalendarDisplayMonth(startOfMonth(date));
                     }
                    }
                }}
                disabled={isLoading}
                fromYear={2000} toYear={new Date().getFullYear() + 5}
                classNames={calendarClassNamesFromUser}
                components={{
                  // Use MonthCaption if 'Caption' key caused issues previously
                  // If 'Caption' is the correct key per latest RDP docs, use that.
                  // The error "'Caption' does not exist" suggests 'MonthCaption' or another key.
                  // Let's assume 'Caption' IS the correct key for RDP v9.7.0 as per its main docs,
                  // and the issue is the props *inside* it.
                  Caption: (captionProps: CaptionProps) => { // Explicitly type captionProps
                    const currentDisplayMonth = getMonthFromCaptionProps(captionProps);
                    return (
                      <ShadcnCustomCalendarCaption
                        currentMonth={currentDisplayMonth}
                        onMonthNavigate={setStartCalendarDisplayMonth}
                      />
                    );
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground h-4 pl-1 text-center sm:text-left">
              {startDate ? format(startDate, "PPP") : <span>&nbsp;</span>}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <p className="text-sm font-medium text-muted-foreground self-center sm:self-start">End Date</p>
            <div className="rounded-md border bg-card shadow-sm w-full max-w-[280px] sm:w-auto mx-auto sm:mx-0">
              <Calendar
                mode="single"
                selected={endDate}
                month={endCalendarDisplayMonth} 
                onMonthChange={setEndCalendarDisplayMonth} 
                onSelect={(date) => {
                  setEndDate(date || undefined);
                  if (date) setEndCalendarDisplayMonth(startOfMonth(date));
                }}
                disabled={isLoading || !startDate}
                fromDate={startDate} 
                fromYear={startDate ? getYear(startDate) : 2000}
                toYear={new Date().getFullYear() + 5}
                classNames={calendarClassNamesFromUser}
                components={{
                  Caption: (captionProps: CaptionProps) => { // Explicitly type captionProps
                    const currentDisplayMonth = getMonthFromCaptionProps(captionProps);
                    return (
                      <ShadcnCustomCalendarCaption
                        currentMonth={currentDisplayMonth}
                        onMonthNavigate={setEndCalendarDisplayMonth}
                      />
                    );
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground h-4 pl-1 text-center sm:text-left">
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