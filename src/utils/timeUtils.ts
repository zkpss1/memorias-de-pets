import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

// Extend dayjs with plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

/**
 * Calculates the time difference between the current time and a given date
 * @param date - The date to calculate the difference from (can be timestamp, Date object, or string)
 * @returns An object containing years, days, hours, minutes, and seconds
 */
export const calculateTimeDifference = (date: number | Date | string) => {
  const now = dayjs();
  const startDate = dayjs(date);
  const diff = dayjs.duration(now.diff(startDate));

  return {
    years: Math.floor(diff.asYears()),
    days: Math.floor(diff.asDays() % 365),
    hours: Math.floor(diff.asHours() % 24),
    minutes: Math.floor(diff.asMinutes() % 60),
    seconds: Math.floor(diff.asSeconds() % 60)
  };
};

/**
 * Formats the time difference into a readable string in Portuguese
 * @param timeDiff - The time difference object
 * @returns A formatted string representing the time difference in Portuguese
 */
export const formatTimeDifference = (timeDiff: {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const { years, days, hours, minutes, seconds } = timeDiff;
  
  const parts = [];
  
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  }
  
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }
  
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  }
  
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
  }
  
  return parts.join(', ');
};

/**
 * Atualiza o contador de tempo em tempo real
 * @param date - A data de início para calcular o tempo decorrido
 * @param callback - Função de callback que recebe o objeto de tempo atualizado
 * @returns Uma função para limpar o intervalo
 */
export const startTimeCounter = (
  date: number | Date | string,
  callback: (timeDiff: {
    years: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => void
) => {
  // Atualiza imediatamente
  callback(calculateTimeDifference(date));
  
  // Configura um intervalo para atualizar a cada segundo
  const interval = setInterval(() => {
    callback(calculateTimeDifference(date));
  }, 1000);
  
  // Retorna uma função para limpar o intervalo
  return () => clearInterval(interval);
};
