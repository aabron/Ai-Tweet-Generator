import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const Login = ({ login, setRememberMe, setTwitterInfo }) => {
    const nav = useNavigate();
    const initialValues = {
        username: '',
        password: ''
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (values) => {
        const response = await axios({
            method: 'post',
            url: 'http://127.0.0.1:8001/api/login/',
            data: values,
            config: {
                headers: {
                    'content-Type': 'multipart/json'
                }
            }
        })
        await login();
        const { token } = response.data;
        const { userprofile } = response.data;
        
        localStorage.setItem('token', token);
       
        if(values.rememberMe){
            setRememberMe(true);
        }
        //redirect to tweet generation page on successful login
        if(userprofile.twitter_key == "null"){
            nav('/settings');
        }
        else{
            nav('/home');
        }
       
    }

    const handleGoogle = async () => {
        const response = await axios({
            method: 'post',
            url: 'http://127.0.0.1:8001/api/login/google',
        })
        await login();
        const { session_key } = response.data;
        localStorage.setItem('session_key', session_key);
        //redirect to tweet generation page on successful login
        nav('/generator');
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <img
                className="absolute top-0 b-auto right-0 pt-2 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
                src={require("../assets/img/pattern_react.png")}
                alt="..."
                />
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
                </div>
                {/* <div className='w-full flex justify-center items-center'>
                    <button onClick={handleGoogle} className="mt-6 text-center text-2xl font-bold text-white bg-red-600 px-3 py-4 rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out">Sign in with Google</button>
                </div> */}
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <Field id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username"/>
                            </div>
                            <div className=''>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <Field id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Field id="remember-me" name="remember-me" type="checkbox" className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                <label htmlFor="remember-me" className="ml-2 block text-md text-gray-900 dark:text-white">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-md">
                                <a href="#" className="font-medium text-indigo-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign in
                            </button>
                        </div>
                        <div>
                            <Link to="/signup" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Dont Have an Account yet? Sign Up
                            </Link>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );

}

export default Login;