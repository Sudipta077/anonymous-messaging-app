import React, { useRef, useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import { toPng } from 'html-to-image';
import { motion } from "framer-motion";
import paper from '../images/paper.png'
function Cards({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const [hideIcons, setHideIcons] = useState(false);

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDownload = async () => {
        if (modalRef.current) {
            try {
                setHideIcons(true);
                await new Promise((resolve) => setTimeout(resolve, 0));

                const dataUrl = await toPng(modalRef.current);

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'secret-message.png';
                link.click();

                setHideIcons(false);
            } catch (error) {
                console.error('Failed to generate image:', error);
                setHideIcons(false);
            }
        }
    };

    return (
        <>
            {/* Card */}
            <motion.div
                onClick={handleCardClick}
                className={`relative bg-transparent p-6 w-full sm:w-72 h-52 sm:h-52 overflow-hidden text-center text-primary rounded flex flex-col items-center justify-center hover:cursor-pointer transition-transform transform hover:scale-105 duration-300 ${isModalOpen ? 'hidden' : ''}`}
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ scale: 1.05 }}
            >
                {/* Image with shadow */}
                <img
                    src={paper}  // Replace with the actual path to your image
                    alt="Card background"
                    className="object-contain absolute inset-0 h-full w-full shadow-black z-0"
                />

                {/* Text content */}
                <h1 className='ml-8 m-auto text-primary text-lg sm:text-2xl font-myfont2 line-clamp-3 z-10 relative px-4'
                style={{ fontFamily: 'Sour Gummy, sans-serif' }}
                >
                    {data.message}
                </h1>

                {/* Overlay */}

            </motion.div>



            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className={`h-96 px-10 sm:p-10 rounded-lg w-11/12 max-w-3xl flex flex-col items-center justify-start transform transition-all duration-300 relative shadow-xl flex-wrap bg-transparent `}

                    >
                        {/* Image as background */}
                       
                            <img
                                src={paper}  // Replace with the actual path to your image
                                alt="Card background"
                                className="object-contain absolute inset-0 h-full w-full m-auto shadow-lg z-0"
                            />

                            {/* Text content */}
                            <h1 className="mt-32 sm:mt-12 ml-2   text-primary text-xl sm:text-3xl font-myfont2 text-wrap text-center break-words z-10 relative px-6 w-56 sm:w-96"
                            style={{ fontFamily: 'Sour Gummy, sans-serif' }}
                            >
                                {data.message}
                            </h1>
                     

                        {/* Download Icon */}
                        <MdDownload
                            onClick={handleDownload}
                            className={`absolute top-4 left-4 text-6xl sm:text-6xl text-primary p-1 sm:p-2 rounded hover:cursor-pointer hover:scale-110 transition-transform ${hideIcons ? 'hidden' : ''}`}
                        />

                        {/* Close Icon */}
                        <MdOutlineClose
                            onClick={closeModal}
                            className={`absolute top-4 right-4 text-6xl sm:text-6xl text-primary p-1 sm:p-2 rounded hover:cursor-pointer hover:scale-110 transition-transform ${hideIcons ? 'hidden' : ''}`}
                        />
                    </div>
                </div>
            )}

        </>
    );
}

export default Cards;
