const countRating = (arr) => {
	const value = arr.reduce((prev, review) => prev + review.rating, 0);
	if (value === 0) return 0;

	return value / arr.length;
};

export default countRating;
