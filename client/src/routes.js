import App from "./components/App";
import SignupForm from "./components/SignupForm";
import RestaurantsList from "./components/RestaurantsList";
import AddRestaurantForm from "./components/AddRestaurantForm";

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
    }
]

export default routes