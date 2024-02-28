import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

//CSS FUNCTIONS:

//SVG icons for checked and unchecked states
const CheckedIcon = () => (
    <svg className='fill-current text-pink-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' width='20' height='20'>
        <path d='M10 15l-5.5-5.5 1.4-1.4L10 12.2l4.1-4.1 1.4 1.4z' />
    </svg>
);

const UncheckedIcon = () => (
    <svg className='fill-current text-gray-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' width='20' height='20'>
        <path d='M10 15l-5.5-5.5 1.4-1.4L10 12.2l4.1-4.1 1.4 1.4z' />
    </svg>
);

// Error Icon Component
const ErrorIcon = () => (
    <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

// Tooltip Component for displaying error messages
const Tooltip = ({ message }) => (
    <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs rounded py-1 px-2 z-10">
      {message}
    </div>
);

// Define placeholders with examples
const fieldPlaceholders = {
    name: 'Enter a Restaurant Name',
    cuisine: 'Type Cuisine Here',
    neighborhood: 'Specify Neighborhood',
};

const AddRestaurantForm = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            cuisine: '',
            neighborhood: '',
            visited: false
        },
        validationSchema: yup.object({
            name: yup.string().required('Name is required'),
            cuisine: yup.string().required('Cuisine is required'),
            neighborhood: yup.string().required('Neighborhood is required'),
            visited: yup.boolean()
        }),
        onSubmit: (values) => {
            fetch('/restaurants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then(response => {
                if (response.ok) {
                    navigate('/home'); //Redirect back to the home page after submission
                } else {
                    console.log('An error occurred');
                }
            });
        },
    });

    return (
        <div className="min-h-screen bg-y2k-bg bg-cover flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl shadow-pink-500/50">
          <h2 className="text-2xl font-bold mb-6 text-center font-heading text-y2k-purple">Add a New Restaurant</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4 relative">
              {['name', 'cuisine', 'neighborhood'].map((field) => (
                <div key={field} className="relative group">
                  <input
                    id={field}
                    name={field}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values[field]}
                    placeholder={fieldPlaceholders[field]} // Use dynamic placeholders
                    // placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="input input-bordered w-full focus:shadow-lg focus:shadow-y2k-pink"
                  />
                  {formik.touched[field] && formik.errors[field] && (
                    <>
                      <ErrorIcon />
                      <Tooltip message={formik.errors[field]} />
                    </>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                        <label htmlFor="visited" className="text-gray-700">
                            <div className="relative">
                                <input
                                    id="visited"
                                    name="visited"
                                    type="checkbox"
                                    onChange={formik.handleChange}
                                    checked={formik.values.visited}
                                    className="sr-only"
                                />
                                <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded flex justify-center items-center hover:bg-y2k-pink transition-colors duration-300">
                                    {formik.values.visited ? <CheckedIcon /> : <UncheckedIcon />}
                                </div>
                            </div>
                            Visited?
                        </label>
                    </div>
                    <button type="submit" className="btn bg-y2k-pink hover:bg-y2k-red focus:ring-y2k-blue focus:ring-opacity-50 w-full transition ease-in-out duration-150">Submit</button>
                </form>
                <Link to="/home" className="inline-block align-baseline font-bold text-sm text-gray hover:text-y2k-green transition ease-in-out duration-150">Back to Home</Link>
            </div>
        </div>
    );
};

export default AddRestaurantForm;
