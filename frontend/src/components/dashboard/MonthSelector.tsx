import { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  month: string; // "YYYY-MM"
  onChange: (month: string) => void;
}

export const MonthSelector = ({ month, onChange }: MonthSelectorProps) => {
  const initialMonth = month ? dayjs(month) : dayjs();
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const handlePrev = () => {
    const newMonth = currentMonth.subtract(1, 'month');
    setCurrentMonth(newMonth);
    onChange(newMonth.format('YYYY-MM'));
  };

  const handleNext = () => {
    const newMonth = currentMonth.add(1, 'month');
    setCurrentMonth(newMonth);
    onChange(newMonth.format('YYYY-MM'));
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-md w-max">
      <button onClick={handlePrev} className="p-2 rounded hover:bg-gray-200 transition">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="font-semibold">{currentMonth.format('MMM YYYY')}</span>

      <button onClick={handleNext} className="p-2 rounded hover:bg-gray-200 transition">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
