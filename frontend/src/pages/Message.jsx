import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Message(props) {
    const [text, setText] = useState("");
    const [rotation, setRotation] = useState(0); // State to track rotation
    const params = useParams();
    const dice = useRef();
    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(text);


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            fetch(`https://anonymous-messaging-app-myu7.onrender.com/user/message/${params.username}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ text })
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false)
                    if (data.status === 200) {
                        notify(data.message);
                        setText("");
                    } else {
                        notify(data.message);
                        console.log("Error occurred : ", data);
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.log("Error occurred : ", err)
                });
        } catch (err) {
            console.log(err);
        }
    };

    const rollDice = () => {
        const newRotation = rotation + 720; // Increment rotation by 360°
        setRotation(newRotation); // Update state with new rotation

        if (dice.current) {
            dice.current.style.transition = 'transform 0.6s ease';
            dice.current.style.transform = `rotate(${newRotation}deg)`; // Apply new rotation
        }
        fetchSuggestions();
    };

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            fetch('https://anonymous-messaging-app-myu7.onrender.com/user/api/gemini', {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);

                    if (data && data.prompt) { // Assuming 'prompt' is the key you want
                        setSuggestion(data.prompt); // Set only the string value
                    } else {
                        console.log("Unexpected response format: ", data);
                        setSuggestion("No suggestions available.");
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.error("Error fetching suggestions: ", err);
                    setSuggestion("Failed to load suggestions.");
                });
        } catch (err) {
            console.error("Error occurred: ", err);
            setSuggestion("Failed to load suggestions.");
        }
    };


    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestion);
        setText(suggestion)
    }


    return (
        <div className='bg-primary min-h-screen'>
            <h1 className='bg-secondary sm:w-fit w-[80%] rounded-b-lg m-auto text-2xl font-myfont text-center p-5 hover:cursor-pointer text-primary hover:scale-105 transition' onClick={() => navigate('/register')}>Create Your Account</h1>
            <div className='bg-primary mt-10 sm:w-96 w-[80%] m-auto'>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2 w-full  sm:h-12'>
                    <input
                        required
                        type="text"
                        className='sm:h-full h-32 w-full sm:w-96  focus:outline-none text-secondary bg-primary rounded px-2 py-1 border border-secondary font-myfont2 m-auto'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Write message'
                        maxLength="100"
                    />

                    <button type='submit' className='bg-secondary text-primary w-full sm:w-24 sm:h-full font-myfont2'>Send</button>
                </form>


                <p className='my-5 font-myfont2 text-secondary m-auto'>Some suggestions for you. Click to use it.</p>
                <div className='flex flex-col-reverse sm:flex-row justify-between items-center gap-x-5 '>

                    {loading === true ?

                        <span className="mt-5 sm:mt-0 hover:cursor-pointer font-myfont2 text-primary p-2 rounded bg-secondary text-2xl w-11/12 h-fit ">Loading...</span> :
                        <p className='mt-5 sm:mt-0 hover:cursor-pointer font-myfont2 text-primary p-2 rounded bg-secondary text-2xl w-full' onClick={handleCopy}>{suggestion}</p>

                    }

                    <h1
                        ref={dice}
                        className='text-4xl cursor-pointer w-fit m-auto'
                        onClick={rollDice}
                    >
                        🎲
                    </h1>


                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Message;
