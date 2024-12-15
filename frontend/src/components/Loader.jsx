import React from 'react';
import '../styles/Loader.css'
function Loader(props) {
    return (
        <div className='backdrop-blur min-h-screen grid place-content-center absolute w-full'>
            <span class="loader"></span>
        </div>
    );
}

export default Loader;