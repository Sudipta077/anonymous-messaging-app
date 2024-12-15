import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cards from '../components/Cards';
import Loader from '../components/Loader';

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


            {(isUserLoading || isMessagesLoading) === true ? <Loader /> :

                <>

                <div className='flex items-center'>

                    <h1 className='text-2xl font-myfont2 text-secondary w-full'>Hello, {name}</h1>

                    <h1
                        className='w-full text-right text-xl font-myfont2 hover:cursor-pointer hover:text-secondary transition'
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </h1>
                    </div>

                    <div className='flex flex-col justify-center mt-10 sm:mt-5'>
                        <h1
                            className='bg-secondary w-fit m-auto px-2 py-1 text-xl rounded text-primary hover:cursor-pointer'
                            onClick={() => {
                                notify('Link copied to clipboard!');
                                navigator.clipboard.writeText(link);
                            }}
                        >
                            {link}
                        </h1>
                        <p className='text-center font-myfont2'>Click on the link</p>
                    </div>

                    <div className=''>
                        <h1 className='text-center sm:text-left text-xl font-myfont2 mt-5'>Your messages:</h1>

                        <div className='flex gap-5 mt-5 flex-wrap justify-center sm:justify-start'>
                            {messages && messages.map((item, index) => <Cards key={index} data={item} />)}
                        </div>
                    </div>
                </>

            }
            <ToastContainer />
        </div>
    );
}

export default Home;
