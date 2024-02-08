import App from "./components/App";
import SignupForm from "./components/SignupForm";
import RestaurantsList from "./components/RestaurantsList";
import AddRestaurantForm from "./components/AddRestaurantForm";
import EditRestaurantForm from "./components/EditRestaurantForm";

const routes = [
    {
        path: '/',
        element: <App />
    },
    {
        path: '/signup',
        element: <SignupForm />
    },
    {
        path: '/home',
        element: <RestaurantsList />
    },
    {
        path: '/restaurants/new',
        element: <AddRestaurantForm />
    },
    {
        path: '/restaurants/edit/:restaurantId',
        element: <EditRestaurantForm />
    }
]

export default routes