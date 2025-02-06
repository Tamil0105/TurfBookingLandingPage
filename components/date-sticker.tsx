'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  addDays,
  format,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
  disabledDates?: string[];
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  selected,
  onSelect,
  disabledDates = [],
  minDate = new Date(),
  maxDate = addDays(new Date(), 90),
}: DatePickerProps) {
  const [month, setMonth] = useState(new Date());
  const [startIndex, setStartIndex] = useState(0);
  const [visibleDatesCount, setVisibleDatesCount] = useState(5);

  const disabledDatesArray = disabledDates.map((date) => parseISO(date));
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    const updateVisibleDates = () => {
      if (window.innerWidth < 640) {
        setVisibleDatesCount(3); // mobile
      } else if (window.innerWidth < 768) {
        setVisibleDatesCount(4); // tablet
      } else if (window.innerWidth < 1024) {
        setVisibleDatesCount(5); // small laptop
      } else {
        setVisibleDatesCount(7); // desktop
      }
    };

    // Initial update
    updateVisibleDates();

    // Add event listener
    window.addEventListener('resize', updateVisibleDates);

    // Cleanup
    return () => window.removeEventListener('resize', updateVisibleDates);
  }, []);

  const visibleDates = dates.slice(startIndex, startIndex + visibleDatesCount);

  const isDateDisabled = (date: Date) => {
    return (
      isBefore(date, minDate) ||
      isAfter(date, maxDate) ||
      disabledDatesArray.some((disabled) => isSameDay(date, disabled))
    );
  };

  const handleScroll = (scrollDirection: 'left' | 'right') => {
    if (scrollDirection === 'left' && startIndex > 0) {
      setStartIndex((prev) => Math.max(0, prev - 1));
    } else if (
      scrollDirection === 'right' &&
      startIndex < dates.length - visibleDatesCount
    ) {
      setStartIndex((prev) =>
        Math.min(dates.length - visibleDatesCount, prev + 1)
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {format(month, 'MMMM yyyy')}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={onSelect}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 shadow-sm"
          onClick={() => handleScroll('left')}
          disabled={startIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
            {visibleDates.map((date) => {
              const isDisabled = isDateDisabled(date);
              const isSelected = isSameDay(date, selected);
              const dayName = format(date, 'EEE');
              const dayNumber = format(date, 'd');
              const isCurrentDay = isToday(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => onSelect(date)}
                  disabled={isDisabled}
                  className={cn(
                    'flex flex-col items-center p-2 sm:p-3 rounded-lg shadow-sm',
                    'min-w-[60px] sm:min-w-[80px]',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : isCurrentDay
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-white hover:bg-muted',
                    isDisabled && 'opacity-50 cursor-not-allowed bg-gray-100',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                >
                  <span className="text-xs sm:text-sm font-medium">
                    {dayName}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold">
                    {dayNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 shadow-sm"
          onClick={() => handleScroll('right')}
          disabled={startIndex >= dates.length - visibleDatesCount}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}