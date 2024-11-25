// import React from 'react'
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { SlidersHorizontal } from "lucide-react";

export default function Fliter({
	MaxPrice,
	MinPrice,
	onPriceChange,
	onsort,
}: {
	MaxPrice: number;
	MinPrice: number;
	onPriceChange: (value: number[]) => void;
	onsort: (value: string) => void;
}) {
	// console.log(MaxPrice, "," + MinPrice);
	const [value, setValue] = useState([MinPrice, MaxPrice]);

	function onvaluechange(value: number[]) {
		setValue(value);
		onPriceChange(value);
	}

	function onsortchange(value: string) {
		console.log(value);
		onsort(value);
	}
	function clearFilters() {
		setValue([MinPrice, MaxPrice]);
		onPriceChange([MinPrice, MaxPrice]);
		onsort("");
	}
	return (
		<Popover>
			<PopoverTrigger>
				<SlidersHorizontal />
			</PopoverTrigger>
			<PopoverContent className="w-full -translate-x-4 ">
				<section className="flex flex-col gap-2">
					<section>
						<Select onValueChange={onsortchange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sort Products" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sort">Sort Products By</SelectItem>
								<SelectItem value="low">Price: Low to High</SelectItem>
								<SelectItem value="high">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>
					</section>

					<div className="flex items-center gap-2 min-w-[280px] ">
						<span>{`$${value[0]}`}</span>
						<Slider
							defaultValue={[0]}
							value={value}
							max={MaxPrice}
							step={1}
							onValueChange={onvaluechange}
						/>
						<span>{`$${value[1]}`}</span>
					</div>
				</section>
				<section>
					<Button className="w-full" onClick={clearFilters}>
						clear filter
					</Button>
				</section>
			</PopoverContent>
		</Popover>
	);
}
