import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { useUser } from '../context/UserContext';

const ShareExperienceForm = () => {  
    // const {user} = useUser();
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    //State to hold the uploaded image URL
    const [image, setImage] = useState('');

    useEffect(() => {
        //Fetch the list of restaurants to populate search function
        fetch('/restaurants')
        .then(response => response.json())
        .then(data => {
            setRestaurants(data);
            console.log('restaurants:', data);
        })
            .catch(error => console.error('Error fetching restaurants', error));
    }, []);

    const filteredRestaurants = searchQuery
        ? restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];
    // console.log('filteredRestaurants:', filteredRestaurants)

    const handleSubmitDirectly = (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem('user_id');
        const payload = {
            ...formik.values,
            user_id,
            image_url: image, //Include 'image' state as part of submission payload
        }
        fetch('/experiences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload) //use the updated payload with user_id
        }).then(response => {
            if (response.ok) {
                navigate('/experiences'); //Redirect back to the home page after submission
            } else {
                console.log('An error occurred');
            }
        });
    }

    const formik = useFormik({
        initialValues: {
            user_id: localStorage.getItem('user_id'),
            // user_id: user ? user.id : null, //set user_id from context
            restaurant_id: '',
            visit_date: '',
            image_url: '',
            story: '',
        },
        validationSchema: yup.object({
            user_id: yup.number(),
            restaurant_id: yup.number().required('Restaurant is required'),
            visit_date: yup.date().required('Visit date is required'),
            image_url: yup.string(),
            story: yup.string().required('Text is required')
        }),
        onSubmit: (values) => {
            console.log("Form submitted", values)
            //Retrieve user_id from local storage
            // const userId = localStorage.getItem('user_id');

            // //When submitting the form
            // const payload = {
            //     ...values, //spread the existing form values
            //     user_id: userId, //add the user_id to the payload
            // };
            fetch('/experiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values) //use the updated payload with user_id
            }).then(response => {
                if (response.ok) {
                    navigate('/home'); //Redirect back to the home page after submission
                } else {
                    console.log('An error occurred');
                }
            });
        },
    });

    const handleImageUpload = (e) => {
        const files = e.target.files;
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', 'yt1lmdwp'); //Cloudinary upload preset

        fetch('https://api.cloudinary.com/v1_1/dwbgeypis/image/upload', { //Cloud name from Cloudinary
            method: 'POST',
            body: formData
        }) 
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                setImage(data.secure_url);
            }
        })
        .catch(error => console.log(error));
    };

    return (
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex items-center justify-center">
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl space-y-4">
                <h2 className="text-2xl font-bold text-center">Share Your Memories!</h2>
                <form onSubmit={handleSubmitDirectly} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Search Restaurants"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <select
                        id="restaurant_id" 
                        name="restaurant_id"
                        onChange={formik.handleChange}
                        value={formik.values.restaurant_id}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select a Restaurant</option>
                        {filteredRestaurants.map(restaurant => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                    <input
                        id="visit_date"
                        name="visit_date"
                        type="date"
                        onChange={formik.handleChange}
                        value={formik.values.visit_date}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="file:btn file:btn-primary"
                    />
                    {image && <img src={image} alt="Uploaded" className="mt-4 max-w-xs mx-auto" />}
                    <textarea
                        id="story"
                        name="story"
                        onChange={formik.handleChange}
                        value={formik.values.story}
                        placeholder="Share your memory"
                        className="textarea textarea-bordered w-full"
                    />
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
                <div className="flex justify-between">
                    <button onClick={() => navigate('/home')} className="btn btn-outline btn-accent">Back to Home Page</button>
                    <button onClick={() => navigate('/experiences')} className="btn btn-outline btn-accent">View Past Posts</button>
                </div>
            </div>
        </div>
    );
};

export default ShareExperienceForm;