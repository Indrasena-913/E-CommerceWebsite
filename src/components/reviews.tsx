import React from "react";

import { Review } from "@/types";
import { Progress } from "@/components/ui/progress";
import Rating from "@/components/ui/Rating";

function groupReviewsByRating(reviews: Review[]): { [key: number]: Review[] } {
	return reviews.reduce((acc, review) => {
		const rating = review.rating;
		if (!acc[rating]) acc[rating] = [];
		acc[rating].push(review);
		return acc;
	}, {} as { [key: number]: Review[] });
}

export default function Reviews({
	reviews,
}: {
	reviews: Review[] | undefined;
}) {
	if (!reviews || reviews.length === 0) {
		return <p>No reviews available</p>;
	}

	// Use the custom grouping function
	const reviewData = groupReviewsByRating(reviews);

	return (
		<div>
			{Object.entries(reviewData)
				.sort(([a], [b]) => Number(b) - Number(a))
				.map(([rating, reviewList]) => {
					const percentage = (
						(reviewList.length / reviews.length) *
						100
					).toFixed(2);

					return (
						<div key={rating} className="grid grid-cols-2 gap-1">
							<section className="flex items-center gap-1">
								<Rating rating={Number(rating)} />
							</section>
							<p className="flex items-center gap-1">
								<Progress value={Number(percentage)} max={100} />
								<span>{percentage}%</span>
							</p>
						</div>
					);
				})}
		</div>
	);
}
