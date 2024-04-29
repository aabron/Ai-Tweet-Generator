import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Circles } from 'react-loader-spinner';
import 'react-loader-spinner';

const Signup = ({ login }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [failed, setFailed] = React.useState(false);
    const nav = useNavigate();
    const initialValues = {
        name: '',
        email: '',
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values) => {
        // console.log("in handle submit")
        setLoading(true);
        try {
            const response  = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8001/api/signup/',
                data: { username: values.username, email: values.email, password: values.password, name: values.name},
                headers: {
                    'content-Type': 'multipart/form-data'
                }
              });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
            setFailed(true);
        }
        nav('/login');
        // console.log(response)
    }

    const handleCloseModal = () => {
        setLoading(false);
        setFailed(false);
    };

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black  py-12 px-4 sm:px-6 lg:px-8">
            <Modal
                    isOpen={loading}
                    onRequestClose={handleCloseModal}
                    style={customStyles}
                    contentLabel="loading"
                >
                        <div className="flex flex-col items-center justify-center h-40 w-80 text-center">
                            <p>Signing Up....</p>
                            <Circles color="#0066FF" height={90} width={90} />
                        </div>
            </Modal>
            <Modal
                    isOpen={failed}
                    onRequestClose={handleCloseModal}
                    style={customStyles}
                    contentLabel="loading"
                >
                        <div className="flex flex-col items-center justify-center h-40 w-80 text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900">Sign up failed: {error}</h2>
                            <button onClick={handleCloseModal} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Close</button>
                        </div>
            </Modal>
             <img
                className="absolute top-0 b-auto right-0 pt-2 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
                src={require("../assets/img/pattern_react.png")}
                alt="..."
                />
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign Up with Ai Tweet Generator</h2>
                </div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className=''>
                                <label htmlFor="name" className="sr-only">First and Last Name</label>
                                <Field id="name" name="name" type="text" autoComplete="name" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Name" />
                            </div>
                            <div className=''>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <Field id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email" />
                            </div>
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <Field id="username" name="username" type="text" autoComplete="" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username"/>
                            </div>
                            <div className=''>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <Field id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                            </div>
                            
                        </div>
                        <div className="flex items-center justify-between">
                            {/* <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div> */}

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign up
                            </button>
                        </div>
                        <div>
                            <Link to="/login" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Already have an account? Login
                            </Link>
                        </div>
                    </Form>
                    
                </Formik>
            </div>
        </div>
    );

}

export default Signup;