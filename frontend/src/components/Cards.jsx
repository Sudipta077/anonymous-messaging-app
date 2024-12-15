import React, { useRef, useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import { toPng } from 'html-to-image';

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
            <div
                onClick={handleCardClick}
                className={`bg-secondary p-5 w-full sm:w-72 h-24 sm:h-52 overflow-hidden text-center text-primary rounded flex flex-wrap items-center hover:cursor-pointer shadow-md transition-transform transform hover:scale-105 duration-300 ${
                    isModalOpen ? 'hidden' : ''
                }`}
            >
                <h1 className='m-auto overflow-hidden w-full text-primary text-lg sm:text-2xl font-myfont2 line-clamp-3'>
                    {data.message}
                </h1>
            </div>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-secondary text-primary p-6 sm:p-10 rounded-lg w-11/12 max-w-3xl flex flex-col items-center justify-start transform transition-all duration-300 relative shadow-xl flex-wrap"
                    >
                        <h1 className="mt-5 text-xl sm:text-3xl font-myfont2 text-wrap text-center break-words">
                            {data.message}
                        </h1>

                        <MdDownload
                            onClick={handleDownload}
                            className={`absolute top-4 left-4 text-3xl sm:text-4xl text-white p-1 sm:p-2 rounded hover:cursor-pointer hover:scale-110 transition-transform ${
                                hideIcons ? 'hidden' : ''
                            }`}
                        />

                        <MdOutlineClose
                            onClick={closeModal}
                            className={`absolute top-4 right-4 text-3xl sm:text-4xl text-white p-1 sm:p-2 rounded hover:cursor-pointer hover:scale-110 transition-transform ${
                                hideIcons ? 'hidden' : ''
                            }`}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Cards;
