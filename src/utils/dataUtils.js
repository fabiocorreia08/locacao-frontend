import { DateTime } from 'luxon';

/**
 * Detecta se a string é só uma data (yyyy-MM-dd) ou data+hora (ISO completo)
 */
const isOnlyDate = (dataISO) => /^\d{4}-\d{2}-\d{2}$/.test(dataISO);

/**
 * Converte uma string ISO ou date (yyyy-MM-dd) para formato brasileiro (dd/MM/yyyy)
 */
export const formatarDataBR = (dataISO) => {
  if (!dataISO) return '—';

  let date;
  if (isOnlyDate(dataISO)) {
    // Vem só a data (ex: 2025-10-06), não mexe em timezone
    date = DateTime.fromISO(dataISO);
  } else {
    // Vem com hora/offset, considera UTC e converte para local
    date = DateTime.fromISO(dataISO, { zone: 'utc' }).toLocal();
  }

  return date.toFormat('dd/MM/yyyy');
};

/**
 * Converte uma string ISO para formato brasileiro com hora (dd/MM/yyyy HH:mm)
 */
export const formatarDataHoraBR = (dataISO) => {
  if (!dataISO) return '—';

  const date = DateTime.fromISO(dataISO, { zone: 'utc' }).toLocal();
  return date.toFormat('dd/MM/yyyy HH:mm');
};

/**
 * Converte uma data do input tipo date (yyyy-MM-dd) para ISO (yyyy-MM-dd)
 */
export const converterInputParaISO = (inputDate) => {
  if (!inputDate) return null;
  return DateTime.fromFormat(inputDate, 'yyyy-MM-dd').toISODate();
};

/**
 * Converte uma data brasileira (dd/MM/yyyy) para ISO (yyyy-MM-dd)
 */
export const converterBRParaISO = (dataBR) => {
  if (!dataBR) return null;
  return DateTime.fromFormat(dataBR, 'dd/MM/yyyy').toISODate();
};
