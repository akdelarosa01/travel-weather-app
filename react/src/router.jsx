import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import MapLayout from "./components/MapLayout";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home/>
	},
    {
		path: '/map/:city',
		element: <MapLayout/>
	},
	{
		path: '/map/:city/:interest',
		element: <MapLayout/>
	},
	{
		path: "*",
		element: <NotFound />
	}
]);

export default router;