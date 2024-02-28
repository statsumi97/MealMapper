import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup'
import SignupForm from './SignupForm';
import RestaurantsList from './RestaurantsList'
import AddRestaurantForm from './AddRestaurantForm';
import EditRestaurantForm from './EditRestaurantForm';
import ShareExperienceForm from './ShareExperienceForm';
import ViewExperiences from './ViewExperiences';
import { UserProvider } from '../context/UserContext';
import EditPostsForm from './EditPostsForm';
import UserProfile from './UserProfile';
import UserPreferencesForm from './UserPreferencesForm';
import PopupModal from './PopupModal';

function App() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const formSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Please enter valid email'),
    password: yup.string().required('Password incorrect').max(15)
  })

  const [form, setForm] = useState(formSchema)
  const [loggedIn, setLoggedIn] = useState(false)

  const formik = useFormik({
    initialValues: {
        email: '',
        password: ''
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: values.email,
              password: values.password
          }),
      })
      .then(async response => {
          const data = await response.json(); // Await for the JSON data
          if (response.ok) {
              // Handle successful login here
              console.log(data); // Assuming 'data' contains the user object
              localStorage.setItem('user_id', data.id);
              alert('You signed in');
              setLoggedIn(true);
              navigate('/home'); // Redirect to /home page after login
          } else {
              // If the server responds with a 401 status, indicate that the password is incorrect
              if (response.status === 401) {
                  formik.setErrors({ password: 'Password is incorrect' });
              } else {
                  // For other errors, use the message from the server if available, or a generic message
                  formik.setErrors({ email: data.message || 'Login failed' });
              }
          }
      })
      .catch(error => {
          console.error('Login error:', error);
          // Handle network error or other unforeseen errors
          formik.setErrors({ email: 'Network error, please try again later.' });
      });
  },
});

return (
  <div className="min-h-screen bg-y2k-bg bg-cover flex items-center justify-center">
    <Routes>
            {/* <Route path='/' element={<App />} /> */}
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/home' element={<RestaurantsList/>} />
            <Route path='/restaurants/new' element={<AddRestaurantForm/>} />
            <Route path='/restaurants/edit/:restaurantId' element={<EditRestaurantForm/>} />
            <Route path='/experiences/new' element={<ShareExperienceForm/>} />
            <Route path='/experiences' element={<ViewExperiences/>} />
            <Route path='/experiences/edit/:experienceId' element={<EditPostsForm/>}  />
            <Route path='/users/:userId' element={<UserProfile/>} />
            <Route path='/users/:userId/preferences' element={<UserPreferencesForm/>} />
            {/* <Route path='/restaurants/new' element={<AddRestaurantForm/>} /> */}
        </Routes>
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 transition-all duration-300 ease-in-out transform hover:scale-105">
        <h1 className="text-2xl font-bold text-center mb-4 transition duration-300 ease-in-out text-y2k-purple">Welcome to MealMapper!</h1>
        <form onSubmit={formik.handleSubmit} className="transition duration-300 ease-in-out">
          {/* Input fields with transitions */}
          <div className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
          <label htmlFor="email" className="block text-sm font-medium text-gray">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 ${formik.touched.email && formik.errors.email ? 'border-y2k-red bg-y2k-yellow focus:border-y2k-red focus:ring-y2k-red' : 'border-gray-300 focus:border-y2k-purple'}`}
          />
          {formik.touched.email && formik.errors.email && <div className="text-sm text-y2k-red">{formik.errors.email}</div>}
            {/* <div className="text-sm text-red-600">{formik.errors.email}</div>
          ) : null} */}
        </div>
        <div className="mb-6 transition duration-300 ease-in-out transform hover:scale-105">
        <label htmlFor="password" className="block text-sm font-medium text-gray">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 ${formik.touched.password && formik.errors.password ? 'border-y2k-red bg-y2k-yellow focus:border-y2k-red focus:ring-y2k-red' : 'border-gray-300 focus:border-y2k-purple'}`}
          />
          {formik.touched.password && formik.errors.password && <div className="text-sm text-y2k-red">{formik.errors.password}</div>}
            {/* <div className="text-sm text-red-600">{formik.errors.password}</div>
          ) : null} */}
        </div>
        {/* Submit button with transitions */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray bg-y2k-pink hover:bg-y2k-red focus:outline-none focus:ring-2 focus:ring-y2k-blue focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Log In
        </button>
      </form>
      <div className="text-center">
          <Link
            to="/signup"
            className="inline-block text-sm font-medium text-gray hover:text-y2k-green transition duration-300 ease-in-out"
          >
            Sign Up
          </Link>
        </div>
    </div>
  </div>
);
}

export default App;