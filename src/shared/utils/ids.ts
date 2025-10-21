export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};
