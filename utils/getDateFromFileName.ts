export const getDateFromFileName = (fileName: string): string | null => {
  const parts = fileName.split('T');
  if (parts.length < 2 || isNaN(Date.parse(parts[0]))) {
    return null;
  }
  return parts[0];
};
