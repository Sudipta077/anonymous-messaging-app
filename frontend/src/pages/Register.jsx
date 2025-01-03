import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Button.css'
import image from '../images/register.png'
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from '../components/Loader';
function Register(props) {

    const notify = (message) => toast(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        closeButton: false,

    });

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        username: "",
        password: ""
    })

    const [eye, setEye] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        fetch('https://anonymous-messaging-app-myu7.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false)
                if (data.status === 200) {
                    console.log("Successfully registered.");
                    notify(data.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
                else {
                    notify(data.message);
                    console.log("Error occurred : ", data);
                }
            })
            .catch(err =>{
                setLoading(false)
                console.log("Error occurred : ", err)});
    }

    return (
        <div className="bg-primary min-h-screen sm:grid sm:place-content-center px-0 sm:px-1">

            <h1 className='font-myfont text-secondary text-4xl sm:text-4xl p-5 sm:p-0'>Sign-up</h1>


            <div className='sm:border-r-8 sm:border-b-8 bg-primary items-center flex flex-col sm:flex-row sm:w-[500px] md:w-full w-full h-fit p-0 sm:p-0 sm:border border-secondary mt-5 rounded backdrop-blur-lg '>

                <div className='h-56 sm:h-96 w-full px-5 sm:px-0 sm:w-96 rounded-2xl'>
                    <img src={image} alt="" className='h-56 sm:h-96 w-full sm:w-full object-cover rounded' />
                </div>

                <form action="" onSubmit={handleSubmit} className='mt-5 sm:mt-0 w-full sm:w-[40%] p-5 ml-0 sm:ml-10'>

                    <div className='relative'>
                        <label htmlFor="name" className='px-1 font-myfont2 absolute top-[-5px] sm:top-[-10px] left-4 tetx-lg sm:text-xl text-secondary bg-primary'>Name</label>
                        <input autoComplete='off' required onChange={handleChange} name="name" type="text" className="text-secondary mt-2 focus:outline-none w-full rounded p-2 text-base sm:text-xl bg-primary border border-secondary" />
                    </div>


                    <div className='relative mt-5'>
                        <label htmlFor="username" className='px-1 font-myfont2 absolute top-[-10px] left-4 text-lg sm:text-xl text-secondary bg-primary'>Username</label>
                        <input required onChange={handleChange} name="username" type="text" className=" mt-2 focus:outline-none w-full rounded p-2 text-base sm:text-xl text-secondary bg-primary border border-secondary" />
                    </div>

                    <div className="relative mt-5">
                        <label htmlFor="password" className='px-1 font-myfont2 absolute top-[-15px] left-4 text-lg sm:text-xl text-secondary bg-primary'>Password</label>

                        <div className='flex border border-secondary rounded p-2 items-center'>
                            <input required onChange={handleChange} name="password" type={eye === false ? "password" : "text"} className="focus:outline-none  mt-2 w-full rounded text-secondary  text-base sm:text-xl bg-primary " />

                            {

                                eye === false ? <GoEyeClosed className='text-secondary text-2xl' onClick={() => setEye(!eye)} /> : <GoEye className='text-secondary text-2xl' onClick={() => setEye(!eye)} />
                            }

                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center mt-5">
                                <Loader/>
                        </div>
                    ) :(
                    <button type='button submit' className='w-full mt-5 font-myfont2 '>Submit</button>)}

                    <h1 className='font-myfont2 mt-2'>Already have account?
                        <Link to='/login' className='text-secondary font-semibold'> login</Link>
                    </h1>
                </form>
            </div>

            <ToastContainer />

        </div>
    );
}

export default Register;    