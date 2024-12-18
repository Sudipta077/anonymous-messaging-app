import React, { useEffect, useRef, useState } from 'react';
import { data, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Message(props) {
    const [text, setText] = useState("");
    const [rotation, setRotation] = useState(0); // State to track rotation
    const params = useParams();
    const dice = useRef();
    const [suggestion, setSuggestion] = useState("");
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
                    if (data.status === 200) {
                        notify(data.message);
                        setText("");
                    } else {
                        notify(data.message);
                        console.log("Error occurred : ", data);
                    }
                })
                .catch(err => console.log("Error occurred : ", err));
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
        try {
            fetch('https://anonymous-messaging-app-myu7.onrender.com/user/api/gemini', {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.prompt) { // Assuming 'prompt' is the key you want
                        setSuggestion(data.prompt); // Set only the string value
                    } else {
                        console.log("Unexpected response format: ", data);
                        setSuggestion("No suggestions available.");
                    }
                })
                .catch(err => {
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
        <div className='bg-primary min-h-screen grid place-content-center px-2'>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2 px-2'>
                <input
                    required
                    type="text"
                    className='sm:h-full h-24 w-96 focus:outline-none text-secondary bg-primary rounded px-2 py-1 border border-secondary font-myfont2'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Write message'
                    maxLength="100"
                />
                <button type='submit' className='bg-secondary text-primary w-full sm:w-24 sm:h-full font-myfont2'>Send</button>
            </form>


            <p className='my-5 font-myfont2 text-secondary'>Some suggestions for you. Click to use it.</p>
            <div className='flex flex-col-reverse sm:flex-row justify-between items-center gap-x-5 '>

                {suggestion ?
                    <p className='mt-5 sm:mt-0 hover:cursor-pointer font-myfont2 text-primary p-2 rounded bg-secondary text-2xl w-96' onClick={handleCopy}>{suggestion}</p>
                    :
                    <span className="mt-5 sm:mt-0 hover:cursor-pointer font-myfont2 text-primary p-2 rounded bg-secondary text-2xl ">Loading...</span>
                }

                <h1
                    ref={dice}
                    className='text-4xl cursor-pointer w-fit m-auto'
                    onClick={rollDice}
                >
                    🎲
                </h1>


            </div>
            <ToastContainer/>
        </div>
    );
}

export default Message;
