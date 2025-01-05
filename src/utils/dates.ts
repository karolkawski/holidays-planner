import {IMonthMap} from '@/src/interfaces/IMonthMap';
import {CalendarDate} from '@nextui-org/react';

export const getDateFromFileName = (fileName: string): string | null => {
  const parts = fileName.split('T');
  if (parts.length < 2 || isNaN(Date.parse(parts[0]))) {
    return null;
  }
  return parts[0];
};

export const formatTime = (date: string | null) => {
  if (!date) {
    return '---';
  }

  const formatToDste = parsePublished(date);

  if (!formatToDste || !(formatToDste instanceof Date) || isNaN(formatToDste.getTime())) {
    return '---';
  }

  const day = String(formatToDste.getUTCDate()).padStart(2, '0');
  const month = String(formatToDste.getUTCMonth() + 1).padStart(2, '0');
  const year = formatToDste.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

export const parsePublished = (dateString: string) => {
  const monthMap: IMonthMap = {
    stycznia: 0,
    lutego: 1,
    marca: 2,
    kwietnia: 3,
    maja: 4,
    czerwca: 5,
    lipca: 6,
    sierpnia: 7,
    września: 8,
    października: 9,
    listopada: 10,
    grudnia: 11,
  };

  try {
    const [datePart, timePart] = dateString.split(', ');
    const [day, monthName, year] = datePart.split(' ');
    const [hour, minute] = timePart.split(':');

    const month = monthMap[monthName as keyof typeof monthMap];
    const dayNumber = parseInt(day, 10);
    const yearNumber = parseInt(year, 10);
    const hourNumber = parseInt(hour, 10);
    const minuteNumber = parseInt(minute, 10);

    return new Date(Date.UTC(yearNumber, month, dayNumber, hourNumber, minuteNumber));
  } catch (error: unknown) {
    return new Error(error as string);
  }
};

export const parseFromCalendarToDate = (date: {from: CalendarDate; to: CalendarDate}, key: 'from' | 'to') => {
  return new Date(date[key].year, date[key].month !== 0 ? date[key].month - 1 : 0, date[key].day).toISOString().split('T')[0];
};
