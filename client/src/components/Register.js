import React, { useState } from 'react';
import axios from 'axios';

//Function for creating an account
function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { username, email, password } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({username, email, password});

            const response = await axios.post('/api/register', body, config);

            if (response.status == 201) {
                console.log('Success', response.data.message);
                //Redirect the user to the login page or display a success message
            }
        } catch (error) {
            console.error('Registration error', error.response.data.message);
            //Display an error message to user
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={e => onSubmit(e)}>
                <div>
                    <label>Username</label>
                    <input
                        type='text'
                        name='username'
                        value={username}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div>
                <label>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div>
                <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}

export default Register;