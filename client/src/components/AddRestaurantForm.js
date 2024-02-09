import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Add a New Restaurant</h2>
            <form onSubmit={formik.handleSubmit}>
                <input
                    id='name'
                    name='name'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    placeholder='Restaurant Name'
                />
                {formik.touched.name && formik.errors.name && <div style={{color: 'red'}}>{formik.errors.name}</div>}
                <input
                    id='cuisine'
                    name='cuisine'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.cuisine}
                    placeholder='Cuisine'
                />
                {formik.touched.cuisine && formik.errors.cuisine && <div style={{color: 'red'}}>{formik.errors.cuisine}</div>}
                <input
                    id='neighborhood'
                    name='neighborhood'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.neighborhood}
                    placeholder='Neighborhood'
                />
                {formik.touched.neighborhood && formik.errors.neighborhood && <div style={{color: 'red'}}>{formik.errors.neighborhood}</div>}
                <label>
                    Visited?
                    <input
                        id='visited'
                        name='visited'
                        type='checkbox'
                        onChange={formik.handleChange}
                        checked={formik.values.visited} 
                    />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default AddRestaurantForm;
