import App from "./components/App";
import SignupForm from "./components/SignupForm";
import RestaurantsList from "./components/RestaurantsList";
import AddRestaurantForm from "./components/AddRestaurantForm";
import EditRestaurantForm from "./components/EditRestaurantForm";
import ShareExperienceForm from "./components/ShareExperienceForm";
import ViewExperiences from "./components/ViewExperiences";
import EditPostsForm from "./components/EditPostsForm";

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
    },
    {
        path: '/experiences/new',
        element: <ShareExperienceForm />
    },
    {
        path: '/experiences',
        element: <ViewExperiences />
    },
    {
        path: '/experiences/edit/:experienceId',
        element: <EditPostsForm />
    }
]

export default routes