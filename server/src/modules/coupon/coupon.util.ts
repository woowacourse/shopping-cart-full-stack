export const stringToHoursAndMinutes = (timeString: string) => {
  const [hour, minutes] = timeString.split(":");

  return [Number(hour), Number(minutes)];
};

export const getFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
