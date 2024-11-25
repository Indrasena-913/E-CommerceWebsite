// import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Button } from "./button";
import { getCartItemCount } from "@/lib/utils";
import { Toaster } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
	const Navigate = useNavigate();
	const [categories, setCategories] = useState<string[]>([]);
	const [search, setSearch] = useState<string>("");
	const { items } = useSelector((state: RootState) => state.cart);
	const { user } = useSelector((state: RootState) => state.user);
	const totalItems = getCartItemCount(items);
	const navigate = useNavigate();

	useEffect(() => {
		function LoadCategories() {
			return fetch("https://dummyjson.com/products/category-list")
				.then((res) => res.json())
				.then(setCategories);
		}
		LoadCategories();
	}, []);

	// console.log(categories);
	function handleCategory(updatedcategory: string) {
		if (updatedcategory === "All") {
			Navigate("/");
			return;
		}
		Navigate(`/?category=${updatedcategory}`);
	}

	function searchItems(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === "") {
			Navigate("/");
			return;
		}
		setSearch(e.target.value);
	}
	function searchCLick() {
		Navigate(`/?search=${search}`);
	}

	function onLogout() {
		localStorage.removeItem("user");
		navigate("/login");
	}

	return (
		<article className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 grid ">
			<header className="flex flex-col p-4  ">
				<section className="grid grid-cols-[auto_1fr_auto] gap-2 ">
					<article className="flex items-center gap-2">
						<h1>
							<Link to="/">
								<Store />
							</Link>
						</h1>
					</article>

					<section className="grid grid-cols-[auto_1fr_auto_auto] gap-2 align-center">
						<article className="flex items-center">
							<Select onValueChange={handleCategory}>
								<SelectTrigger>
									<SelectValue placeholder="All" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</article>
						<section className="shadow-sm transition-colors border border-input rounded-lg px-2 flex items-center focus-within:ring-1 focus-within:ring-primary">
							<Input
								className="border-none shadow-none focus-visible:ring-0  outline-none"
								placeholder="Search...."
								type="search"
								onChange={searchItems}
							/>
							<Search
								onClick={searchCLick}
								className="size-6 text-muted-foreground"
							/>
						</section>
						<section className="flex gap-4 place-items-center justify-end ">
							<section className="flex items-center flex-col  relative ml-4 ">
								{items.length > 0 ? (
									<span className="absolute top-[-2px]  font-semibold  text-xs">
										{totalItems}
									</span>
								) : null}
								<Button
									variant="ghost"
									onClick={() => Navigate("/cart")}
									className=" flex justify-center items-center"
								>
									<ShoppingCart className="absolute top-[10px] scale-150" />
								</Button>
							</section>
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Avatar>
											<AvatarImage src="" alt={user.firstName} />
											<AvatarFallback>
												{user.firstName.at(0)}
												{user.lastName.at(0)}
											</AvatarFallback>
										</Avatar>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Profile</DropdownMenuItem>
										<DropdownMenuItem onClick={onLogout}>
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button
									onClick={() => navigate("/login")}
									className="w-full h-full"
									variant={"ghost"}
									size={"sm"}
								>
									Login
								</Button>
							)}
						</section>
					</section>
				</section>
			</header>
		</article>
	);
}
export default function Layout() {
	return (
		<div id="layout">
			<Header />
			<main>
				<Outlet />
				<Toaster />
			</main>
			<footer className="p-4 mt-4  border-t-2 grid place-items-center">
				<p>© {new Date().getFullYear()} INDRA Store</p>
			</footer>{" "}
		</div>
	);
}
