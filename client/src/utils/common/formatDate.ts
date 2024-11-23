import { format } from "date-fns";

export const formatDate = (dateString: string, dateFormat: string): string => {
  return format(new Date(dateString), dateFormat);
};
