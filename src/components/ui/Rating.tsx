// import React from "react";
import { Star } from "lucide-react";

export default function Rating({ rating }: { rating: number }) {
	return (
		<div className="grid grid-flow-col place-items-center gap-1">
			{new Array(Math.round(rating)).fill(0).map(() => (
				<Star className="fill-primary size-4" />
			))}
			{/* <Star /> */}
		</div>
	);
}
