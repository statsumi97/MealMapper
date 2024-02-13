import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    //For when signup is successful
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        username: yup.string().required('Username is required'),
        user_email: yup.string().email('Invalid email').required('Email is required'),
        passwordhash: yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
        username: '',
        user_email: '',
        passwordhash: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('/users', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                res.json().then((user) => {
                    console.log('ok')
                    setSuccessMessage('Sign up successful! Redirecting to login...');
                    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
                })
                } else{
                    res.json().then((err) => console.log('error'))
                }
            });
        },
    });

    return (
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex items-center justify-center">
            <div className="w-full max-w-xs">
                {successMessage && <p className="bg-green-100 text-green-800 p-3 rounded">{successMessage}</p>}
                <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_email">
                            Email Address
                        </label>
                        <input
                            id="user_email"
                            name="user_email"
                            type="email"
                            onChange={formik.handleChange}
                            value={formik.values.user_email}
                            onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {formik.touched.user_email && formik.errors.user_email && <p className="text-red-500 text-xs italic">{formik.errors.user_email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {formik.touched.username && formik.errors.username && <p className="text-red-500 text-xs italic">{formik.errors.username}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordhash">
                            Password
                        </label>
                        <input
                            id="passwordhash"
                            name="passwordhash"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.passwordhash}
                            onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {formik.touched.passwordhash && formik.errors.passwordhash && <p className="text-red-500 text-xs italic">{formik.errors.passwordhash}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Sign Up
                        </button>
                        <Link to="/" className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800">
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm