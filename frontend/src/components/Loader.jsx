import React from 'react';
import '../styles/Loader.css'
function Loader(props) {
    return (
        <div className='backdrop-blur h-fit m-auto grid place-content-center w-56'>
            <span className="loader"></span>
            <p className='text-secondary font-myfont2 mt-5'>Loading...</p>
        </div>
    );
}

export default Loader;