import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import Login from "./pages/login.tsx";
import {
	createBrowserRouter,
	redirect,
	RouterProvider,
} from "react-router-dom";
// import path from "path";
import Layout from "./components/ui/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { loader } from "./pages/Dashboard.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import Cart from "./pages/Cart.tsx";
import ProductInfo, { loader as ProductInfoLoader } from "./pages/product.tsx";
import Payment from "./pages/Payment.tsx";
import { getStoredValue } from "./lib/utils.ts";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
				loader: loader,
			},
			{ path: "/cart", element: <Cart /> },
			{
				path: "/product/:productId",
				element: <ProductInfo />,
				loader: ProductInfoLoader,
			},
			{
				path: "/payment",
				element: <Payment />,
				loader: () => {
					const user = getStoredValue("user");
					if (!user) {
						return redirect("/login");
					}
					return null;
				},
			},
		],
	},
	{ path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>
);
