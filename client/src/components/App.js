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
      console.log('word')
      fetch('/login', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      }).then((r) => {
        if (r.ok) {
          r.json().then(user => {
            if (user.id) {
              console.log('you signed in')
              setForm(formSchema)
              setLoggedIn(true)
              navigate('/home'); // Redirect to /home page after login
            } else {
              console.log('Login failed: ', user)
            }
          })
        } else {
          r.json().then((err) => console.log('error'))
        }
      })
    }
  })

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
          <p>{formik.touched.email && formik.errors.email ? (
          <h3>{formik.errors.email}</h3>
          ) : ('')}</p>
         <input
          type='password'
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder='Password'
          onBlur={formik.handleBlur}>

         </input>
         <p>{formik.touched.password && formik.errors.password ? (
         <h3>{formik.errors.password}</h3>
         ) : ('')}</p>
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