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
        username: yup.string()
            .required('Required'),
        user_email: yup.string()
            .email('Invalid email address')
            .required('Required'),
        passwordhash: yup.string()
            .required('Required'),
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
        <div>
            {successMessage && <div>{successMessage}</div>}
        <form onSubmit={formik.handleSubmit} style={{margin: '30px'}}>
            <label>Email Address</label>
            <br />
            <input
            id='user_email'
            name='user_email'
            onChange={formik.handleChange}
            value={formik.values.user_email}
            onBlur={formik.handleBlur}
            />
            <p>{formik.touched.user_email && formik.errors.user_email ? (
                <h3>{formik.errors.user_email}</h3>
            ) : ('')}</p>
            
            <label>Username</label>
            <br />
            <input
            id='username'
            name='username'
            onChange={formik.handleChange}
            value={formik.values.username}
            onBlur={formik.handleBlur}
            />
            <p>{formik.touched.username && formik.errors.username ? (
                <h3>{formik.errors.username}</h3>
            ) : ('')}</p>
            
            <label>Password</label>
            <br />
            <input
            id='passwordhash'
            name='passwordhash'
            onChange={formik.handleChange}
            value={formik.values.passwordhash}
            onBlur={formik.handleBlur}
            />
            <p>{formik.touched.passwordhash && formik.errors.passwordhash ? (
                <h3>{formik.errors.passwordhash}</h3>
            ) : ('')}</p>
            <button type='submit'>Submit</button>
            <button>
                <Link className='link-to-login' to={'/'}>Login</Link></button>
        </form>
        </div>
    );
};

export default SignupForm