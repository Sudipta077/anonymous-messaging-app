import React, { useEffect, useRef, useState } from 'react';
import { data, useParams } from 'react-router-dom';

function Message(props) {
    const [text, setText] = useState("");
    const [rotation, setRotation] = useState(0); // State to track rotation
    const params = useParams();
    const dice = useRef();
    const [suggestion, setSuggestion] = useState("");
    console.log(text);

    const handleSubmit = async () => {
        try {
            fetch(`http://localhost:8080/user/message/${params.id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ text })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        console.log("ok->", data.message);
                    } else {
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
            fetch('http://localhost:8080/user/api/gemini', {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setSuggestion(data);
                    console.log(data);
                })
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestion);
        setText(suggestion)
    }

    return (
        <div className='bg-primary min-h-screen grid place-content-center px-2'>
            <form onSubmit={handleSubmit} className='flex gap-2'>
                <input
                    required
                    type="text"
                    className='h-14 w-96 focus:outline-none text-secondary bg-primary rounded px-2 py-1 border border-secondary'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Write message'
                    maxlength="100"
                />
                <button type='submit' className='bg-secondary text-primary h-full font-myfont2'>Send</button>
            </form>


            <p className='my-5 font-myfont2 text-secondary'>Some suggestions for you. Click to use it.</p>
            <div className='flex flex-col-reverse sm:flex-row justify-between items-center gap-x-5 '>

                {suggestion ?
                    <p className='mt-5 sm:mt-0 hover:cursor-pointer font-myfont2 text-primary p-2 rounded bg-secondary text-2xl' onClick={handleCopy}>{suggestion}</p>
                    :
                    <>Loading...</>
                }

                <h1
                    ref={dice}
                    className='text-4xl cursor-pointer w-fit m-auto'
                    onClick={rollDice}
                >
                    🎲
                </h1>


            </div>
        </div>
    );
}

export default Message;
