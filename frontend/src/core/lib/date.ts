import dayjs from "dayjs"

export const getDaysInMonth = (month: number, year: number) => {
	return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number) => {
	return new Date(year, month, 1).getDay();
};


/**
 * Format a date string to a specified format.
 * @param dateString The date string input
 * @param targetFormat The format to convert the date string to, default is "YYYY-MM-DD"
 * @returns formatted date string
 */
export const formatDate = (dateString: string, targetFormat: string = "YYYY-MM-DD") => {
	return dayjs(dateString).format(targetFormat);
};
