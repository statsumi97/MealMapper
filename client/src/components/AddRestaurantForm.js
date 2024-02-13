import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex justify-center items-center p-4">
            <div className="w-full max-w-xl bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">Add a New Restaurant</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            placeholder="Restaurant Name"
                            className="input input-bordered w-full"
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-red-500">{formik.errors.name}</p>}
                    </div>
                    <div>
                        <input
                            id="cuisine"
                            name="cuisine"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.cuisine}
                            placeholder="Cuisine"
                            className="input input-bordered w-full"
                        />
                        {formik.touched.cuisine && formik.errors.cuisine && <p className="text-red-500">{formik.errors.cuisine}</p>}
                    </div>
                    <div>
                        <input
                            id="neighborhood"
                            name="neighborhood"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.neighborhood}
                            placeholder="Neighborhood"
                            className="input input-bordered w-full"
                        />
                        {formik.touched.neighborhood && formik.errors.neighborhood && <p className="text-red-500">{formik.errors.neighborhood}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="visited" className="text-gray-700">
                            Visited?
                        </label>
                        <input
                            id="visited"
                            name="visited"
                            type="checkbox"
                            onChange={formik.handleChange}
                            checked={formik.values.visited} 
                            className="checkbox checkbox-primary"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
                <Link to="/home" className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800">
                            Back to Home
                        </Link>
            </div>
        </div>
    );
}

export default AddRestaurantForm;
