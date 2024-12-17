import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cards from '../components/Cards';
import Loader from '../components/Loader';
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Toast notification
    const notify = (message) => toast(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        closeButton: false,
    });

    // Fetch User
    const fetchUser = async () => {
        setIsUserLoading(true);
        if (!token) return navigate('/login');

        try {
            const response = await fetch('https://anonymous-messaging-app-myu7.onrender.com/user/', { headers });
            const data = await response.json();

            if (data.status === 200) {
                console.log("user got --------->", data.user);
                setUser(data.user);
            } else {
                console.error("Error occurred: ", data);
            }
        } catch (err) {
            console.error("Fetch user error: ", err);
        } finally {
            setIsUserLoading(false);
        }
    };

    // Fetch Messages
    const fetchMessages = async () => {
        setIsMessagesLoading(true);
        if (!token) return navigate('/login');

        try {
            const response = await fetch('https://anonymous-messaging-app-myu7.onrender.com/user/message/getAll', { headers });
            const data = await response.json();

            if (data.status === 200) {
                console.log(data.messages);
                setMessages(data.messages);
            } else {
                console.error("Error fetching messages: ", data);
            }
        } catch (err) {
            console.error("Fetch messages error: ", err);
        } finally {
            setIsMessagesLoading(false);
        }
    };

    // Delete All Messages
    const deleteAll = async () => {
        try {
            const response = await fetch('https://anonymous-messaging-app-myu7.onrender.com/user/deleteAll', {
                method: 'POST',
                headers,
            });

            const data = await response.json();
            notify(data.message);
            if (data.status === 200) 
                setMessages(null)
        } catch (err) {
            console.error("Delete error: ", err);
        }
    };

    // Copy Link to Clipboard
    const handleLinkCopy = () => {
        notify('Link copied to clipboard!');
        navigator.clipboard.writeText(link);
    };

    useEffect(() => {
        fetchUser();
        fetchMessages();
    }, []);

    const link = `https://anonymous-messaging-app-myu7.onrender.com/send/${user.username}`;
    const name = user?.name?.split(' ')[0];
    const isLoading = isUserLoading || isMessagesLoading;

    return (
        <div className='bg-primary min-h-screen flex-col justify-center py-5 px-10'>
            <motion.button
                className="w-fit text-right text-sm sm:text-xl font-myfont2 hover:cursor-pointer hover:text-primary transition mt-4 px-2 ml-[-80px] py-1 float-end"
                onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0,scale:1 }}
                whileHover={{scale:1.2}}
            >
                Logout
            </motion.button>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <motion.div
                        className="flex flex-col items-center justify-center h-[400px]"
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                    >
                        <h1 className="text-4xl sm:text-6xl font-semibold mb-4 text-center font-myfont2 text-secondary">
                            Hello, {name}
                        </h1>
                        <div className="flex flex-col justify-center items-center mt-6 sm:mt-5 border border-secondary p-4 sm:p-6 w-fit sm:w-1/2 rounded-lg hover:cursor-pointer bg-secondary text-primary transition 1s">
                            <motion.h1
                                className="bg-secondary w-fit px-2 py-1 sm:px-4 sm:py-2 text-lg sm:text-2xl rounded text-primary hover:cursor-pointer transition-transform font-myfont"
                                onClick={handleLinkCopy}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {link}
                            </motion.h1>
                            <p className="text-center font-myfont2 text-base sm:text-base mt-2">
                                Click on the link
                            </p>
                        </div>
                    </motion.div>

                    <div>
                        <div className='flex flex-col sm:flex-row justify-between items-center'>
                            <div>
                                <h1 className='text-center sm:text-left text-3xl font-myfont2 mt-5'>Your messages </h1>
                                <p className='font-myfont2'>Click on the messages to download</p>
                            </div>
                            <button className='mt-5 sm:mt-0 font-myfont2' onClick={deleteAll}>Delete all</button>
                        </div>

                        <motion.div
                            className="flex gap-5 mt-5 flex-wrap justify-center sm:justify-start"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: { staggerChildren: 0.2 },
                                },
                            }}
                        >
                            {messages?.slice().reverse().map((item, index) => (
                                <Cards key={index} data={item} />
                            ))}
                        </motion.div>
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
}

export default Home;
