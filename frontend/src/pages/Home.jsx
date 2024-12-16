import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cards from '../components/Cards';
import Loader from '../components/Loader';
import { motion } from "framer-motion";
function Home(props) {
    const notify = (message) => toast(message, {
        position: "top-center",
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
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchUser = async () => {
        setIsUserLoading(true);
        try {
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/user/', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (data.status === 200) {
                setUser(data.response[0]);
            } else {
                console.error("Error occurred: ", data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUserLoading(false);
        }
    };

    const fetchMessages = async () => {
        setIsMessagesLoading(true);
        try {
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/user/message/getAll', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (data.status === 200) {
                setMessages(data.message);
            } else {
                console.error("Error occurred: ", data);
            }
        } catch (err) {
            console.error("Error occurred: ", err);
        } finally {
            setIsMessagesLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchMessages();
    }, []);

    const link = `http://localhost:3000/send/${user.id}`;

    const name = user?.name?.split(' ')[0];

    return (
        <div className='bg-primary min-h-screen flex-col justify-center  py-5 px-10'>
            <motion.h1
                className="w-full text-right text-sm sm:text-xl font-myfont2 hover:cursor-pointer hover:text-secondary transition mt-4"
                onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}
                animate={{opacity:1}}
                initial={{opacity:0}}
            >
                Logout
            </motion.h1>

            {(isUserLoading || isMessagesLoading) === true ? <Loader /> :

                <>

                    <motion.div className="flex flex-col items-center justify-center h-[400px]"
                        animate={{opacity:1}}
                        initial={{opacity:0}}
                    >
                        <h1 className="text-4xl sm:text-6xl font-semibold mb-4 text-center font-myfont2 text-secondary">
                            Hello, {name}
                        </h1>
                        <div className="flex flex-col justify-center items-center mt-6 sm:mt-5 border border-secondary p-4 sm:p-6 w-11/12 sm:w-1/2 rounded-lg">
                            <motion.h1
                                className="bg-secondary w-fit px-2 py-1 sm:px-4 sm:py-2 text-lg sm:text-2xl rounded text-primary hover:cursor-pointer transition-transform font-myfont"
                                onClick={() => {
                                    notify('Link copied to clipboard!');
                                    navigator.clipboard.writeText(link);
                                }}
                                animate={{
                                    scale: [1, 1.1, 1], // Keyframes for scaling
                                }}
                                transition={{
                                    duration: 1.5, // Duration of one cycle (scale up and down)
                                    repeat: Infinity, // Infinite repetition
                                    ease: 'easeInOut', // Smooth easing
                                }}
                            >
                                {link}
                            </motion.h1>

                            <p className="text-center font-myfont2 text-base sm:text-base mt-2">
                                Click on the link
                            </p>

                        </div>
                    </motion.div>


                    <div className=''>
                        <h1 className='text-center sm:text-left text-3xl font-myfont2 mt-5'>Your messages :</h1>

                        <motion.div
                            className="flex gap-5 mt-5 flex-wrap justify-center sm:justify-start"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.2,
                                    },
                                },
                            }}

                        >

                            {messages && messages.map((item, index) => <Cards key={index} data={item} />)}
                        </motion.div>
                    </div>
                </>

            }
            <ToastContainer />
        </div>
    );
}

export default Home;
