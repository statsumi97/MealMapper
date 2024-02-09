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
    <div className='App'>
      {/* <BrowserRouter> */}
        <Routes>
            {/* <Route path='/' element={<App />} /> */}
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/home' element={<RestaurantsList/>} />
            <Route path='/restaurants/new' element={<AddRestaurantForm/>} />
            <Route path='/restaurants/edit/:restaurantId' element={<EditRestaurantForm/>} />
            <Route path='/experiences/new' element={<ShareExperienceForm/>} />
            <Route path='/experiences' element={<ViewExperiences/>} />
            <Route path='/experiences/edit/:experienceId' element={<EditPostsForm/>}  />
            {/* <Route path='/restaurants/new' element={<AddRestaurantForm/>} /> */}
        </Routes>
      {/* </BrowserRouter> */}
      <h1 className='login-title'>Welcome to MealMapper!</h1>
      {!loggedIn ? (
       <form onSubmit={formik.handleSubmit}>
         <input
          type='text'
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          placeholder='Email'
          onBlur={formik.handleBlur}>
        </input>
        {formik.touched.email && formik.errors.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}
         <input
          type='password'
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder='Password'
          onBlur={formik.handleBlur}>

         </input>
         {formik.touched.password && formik.errors.password && <div style={{color: 'red'}}>{formik.errors.password}</div>}
         <button className='btn btn-danger login_button' type='submit'>Log In</button>

      </form>
      ) : (
        <>
        <p>You are logged in. <Link to='/home'>Go to Home</Link></p>
        {/* <Link to='/add-restaurant'> Add New Restaurant</Link> */}
        </>
        )}
       <button className='btn btn-outline-danger'>
         <Link className='link' to={`/signup`}>Sign Up Here</Link>
       </button> 
    </div>
  )
}

export default App;