import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Using lucide-react for icons

// API base URL to construct image paths
const API_BASE_URL = 'http://localhost:5000';

const books = [
    { id: 1, title: 'The Handmaid\'s Tale', img: `${API_BASE_URL}/uploads/image-1760292844360.jpg` },
    { id: 2, title: 'Your Name', img: `${API_BASE_URL}/uploads/image-1760206417317.jpg` },
    { id: 3, title: 'The Psychology of Money', img: `${API_BASE_URL}/uploads/image-1760291863335.jpg` },
    { id: 4, title: 'Can We Be Strangers Again?', img: `${API_BASE_URL}/uploads/image-1760209858633.jpg` },
    { id: 5, title: 'Atomic Habits', img: `${API_BASE_URL}/uploads/image-1760210030876.jpg` },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === books.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? books.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds
        return () => clearInterval(slideInterval);
    }, [currentIndex, nextSlide]);


    return (
        <div className="h-[450px] w-full max-w-md mx-auto relative group overflow-hidden rounded-2xl shadow-lg">
            <div 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                className="w-full h-full flex transition-transform ease-out duration-500"
            >
                {books.map((book) => (
                    <img 
                        key={book.id} 
                        src={book.img} 
                        alt={book.title}
                        className="w-full h-full object-cover flex-shrink-0"
                    />
                ))}
            </div>
            {/* Left Arrow */}
            <button onClick={prevSlide} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-colors z-10">
                <ChevronLeft size={30} />
            </button>
            {/* Right Arrow */}
             <button onClick={nextSlide} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-colors z-10">
                <ChevronRight size={30} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
                {books.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;

