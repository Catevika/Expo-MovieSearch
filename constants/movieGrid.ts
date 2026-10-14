const GRID_GUTTER = 40;
const GRID_GAP = 16;
const MAX_GRID_WIDTH = 1200;

export const getMovieGridLayout = (windowWidth: number) => {
	const numColumns = windowWidth >= 1024 ? 6 : windowWidth >= 640 ? 4 : 2;
	const gridWidth = Math.min(
		Math.max(0, windowWidth - GRID_GUTTER),
		MAX_GRID_WIDTH,
	);

	return {
		numColumns,
		cardWidth: (gridWidth - GRID_GAP * (numColumns - 1)) / numColumns,
		columnGap: GRID_GAP,
	};
};
