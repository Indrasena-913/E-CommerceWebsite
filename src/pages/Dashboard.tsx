import { useEffect } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Reviews from "@/components/reviews";
import { Badge } from "@/components/ui/badge";
import { Product, ProductsResponse } from "@/types";
import Filter from "@/components/ui/fliter";
import { SortProductsByPrice } from "@/lib/utils";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/features/cartSlice";
import { RootState } from "@/store";

const DefaultLimit = 15;
export async function loader({ request }: { request: Request }) {
	try {
		const url = new URL(request.url);
		const category = url.searchParams.get("category");
		const search = url.searchParams.get("search");
		const page = url.searchParams.get("page");
		const skip = page ? (Number(page) - 1) * DefaultLimit : 0;

		let endpoint;
		if (search) {
			// Prioritize search query
			endpoint = `https://dummyjson.com/products/search?q=${search}`;
		} else if (category && category !== "All") {
			// Fetch by category if category is specified and not "All"
			endpoint = `https://dummyjson.com/products/category/${category}?DefaultLimit=${DefaultLimit}&skip=${skip}`;
		} else {
			// Default to fetching all products
			endpoint = `https://dummyjson.com/products?&DefaultLimit=${DefaultLimit}&skip=${skip}`;
		}

		const response = await fetch(endpoint);
		if (!response.ok) throw new Error("Failed to fetch products");

		const data = await response.json();
		return data; // Default to empty array if products is undefined
	} catch (error) {
		console.error("Error loading products:", error);
		return { products: [] }; // Return empty array if there's an error
	}
}

export default function Dashboard() {
	const { products, total, skip } = useLoaderData() as ProductsResponse;
	// console.log(products);
	const [filteredProducts, setFilteredProducts] = useState(products);
	const [searchParams, setSearchParams] = useSearchParams();

	// console.log(total, skip, DefaultLimit);

	// console.log(filteredProducts);
	const NumberofPages = Math.round(total / DefaultLimit);
	const pageNumber = Math.ceil(skip / DefaultLimit) + 1;
	const dispatch = useDispatch();

	// console.log(NumberofPages);

	const [sortby, setSortBy] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		// console.log("Filtered products updated", filteredProducts);
		setFilteredProducts(products);
	}, [products]);

	const SortedProducts = SortProductsByPrice({ products });

	// console.log(SortedProducts);

	function onPriceChange([MaxPrice, MinPrice]: number[]) {
		console.log([MaxPrice, MinPrice]);
		const filteredProducts = products.filter((product) => {
			return product.price <= MinPrice && product.price >= MaxPrice;
		});
		if (sortby) {
			setFilteredProducts(
				SortProductsByPrice(
					{ products: filteredProducts },
					sortby as "asc" | "desc"
				)
			);
		} else {
			setFilteredProducts(filteredProducts);
		}
	}

	function AddProductsToCart(product: any) {
		dispatch(addToCart({ product, quantity: 1 }));
	}

	function OnSortChange(value: string) {
		if (value === "low") {
			setSortBy("asc");
			setFilteredProducts(SortProductsByPrice({ products: filteredProducts }));
		} else if (value === "high") {
			setSortBy("desc");
			setFilteredProducts(
				SortProductsByPrice({ products: filteredProducts }, "desc")
			);
		} else {
			setFilteredProducts(products);
		}
	}
	function GetPageNO(page: number, event: React.MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		console.log(page);
		console.log({ page, searchParams, value: searchParams.toString() });
		const urlSearchParams = new URLSearchParams(searchParams);
		urlSearchParams.set("page", page.toString());
		console.log(urlSearchParams.toString());

		setSearchParams(urlSearchParams);
	}

	function BuildPagiNation() {
		const Pages = [];
		for (
			let index = pageNumber > 4 ? pageNumber - 2 : 1;
			index <= pageNumber + 2 && index <= NumberofPages;
			index++
		) {
			Pages.push(
				<PaginationItem key={index}>
					<PaginationLink
						isActive={pageNumber === index}
						onClick={(event) => GetPageNO(index, event)}
						href="#"
					>
						{index}
					</PaginationLink>
				</PaginationItem>
			);
		}
		if (pageNumber + 2 < NumberofPages) {
			Pages.push(
				<PaginationItem key="ellipsis">
					<PaginationEllipsis />
				</PaginationItem>
			);
		}
		return Pages;
	}

	function showProduct(productId: number) {
		navigate(`/product/${productId}`);
	}

	return (
		<article className="px-4 flex flex-col gap-6">
			<div>
				<header className="flex justify-end items-center mb-4 mr-4 mt-2">
					<Filter
						MaxPrice={SortedProducts.at(-1)?.price ?? 0}
						MinPrice={SortedProducts.at(0)?.price ?? 0}
						onPriceChange={onPriceChange}
						onsort={OnSortChange}
					/>
				</header>
				<section className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
					{filteredProducts.map(
						({
							title,
							description,
							id,
							thumbnail,
							price,
							discountPercentage,
							tags,
							reviews,
							images,
						}) => (
							<Card key={id} className="w-full cursor-pointer">
								<CardHeader onClick={() => showProduct(id)}>
									<img
										className="h-full w-full object-contain"
										src={thumbnail}
										alt="{title}"
									/>
								</CardHeader>
								<CardContent
									className="flex flex-col gap-3"
									onClick={() => showProduct(id)}
								>
									<article className="flex gap-4">
										<p className="font-medium">${price}</p>
										<div className="border-2  rounded-md ">
											<p className="text-green-400 scale-75">
												{" "}
												{discountPercentage}%
											</p>
										</div>
									</article>
									<CardTitle className="line-clamp-1">{title}</CardTitle>
									<CardDescription className="line-clamp-1">
										{description}
									</CardDescription>

									<HoverCard>
										<HoverCardTrigger className="underline hover:cursor-pointer">
											View More
										</HoverCardTrigger>
										<HoverCardContent>
											<article className="flex flex-col gap-2">
												<h1 className="font-semibold">{title}</h1>
												<p className="text-sm">{description}</p>
												<div className="flex items-center gap-2">
													{tags.map((tag) => (
														<Badge key={tag}>{tag}</Badge>
													))}
												</div>
												<Reviews reviews={reviews} />
											</article>
										</HoverCardContent>
									</HoverCard>
								</CardContent>

								<CardFooter>
									<Button
										className="w-full"
										onClick={() =>
											AddProductsToCart({
												id,
												title,
												description,
												price,
												thumbnail,
												reviews,
												discountPercentage,
												tags,
												images,
											})
										}
									>
										<ShoppingCart className="mr-2 h-4 w-4" />
										Add to cart
									</Button>
								</CardFooter>
							</Card>
						)
					)}
				</section>
			</div>
			<Pagination>
				<PaginationContent>
					{pageNumber > 1 ? (
						<PaginationItem>
							<PaginationPrevious
								onClick={(event) => GetPageNO(pageNumber - 1, event)}
								href="#"
							/>
						</PaginationItem>
					) : null}
					{BuildPagiNation()}

					{pageNumber < NumberofPages ? (
						<PaginationItem>
							<PaginationNext
								onClick={(event) => GetPageNO(pageNumber + 1, event)}
								href="#"
							/>
						</PaginationItem>
					) : null}
				</PaginationContent>
			</Pagination>
		</article>
	);
}
