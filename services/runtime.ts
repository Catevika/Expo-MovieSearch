export function convertMinutesToHoursAndMinutes(
	minutes: number | null,
): runtime | null {
	if (!minutes) return null;

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = (minutes % 60).toString().padStart(2, '0');

	if (hours === 0) return {hours: null, remainingMinutes};

	return {hours, remainingMinutes};
}
