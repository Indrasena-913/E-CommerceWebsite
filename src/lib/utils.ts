import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItemsType, type Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function SortProductsByPrice(
	{ products }: { products: Product[] },
	order: "asc" | "desc" = "asc"
) {
	return order === "asc"
		? (products as any).toSorted((a: Product, b: Product) => a.price - b.price)
		: (products as any).toSorted((a: Product, b: Product) => b.price - a.price);
}

export const getCartItemCount = (items: CartItemsType[]) =>
	items.reduce((prevValue, currentItem) => prevValue + currentItem.quantity, 0);

export function getCartSubtotal(items: CartItemsType[]) {
	const subtotal = items.reduce(
		(prev, current) => prev + current.product.price * current.quantity,
		0
	);
	return subtotal.toFixed(2);
}

export function getStoredValue(key: string) {
	const item = localStorage.getItem(key);
	try {
		return item ? JSON.parse(item) : null;
	} catch (error) {
		return null;
	}
}

export function saveValueToLocalStorage<T>(key: string, value: T) {
	localStorage.setItem(key, JSON.stringify(value));
}
