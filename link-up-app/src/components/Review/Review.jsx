import { useState, useEffect } from 'react';

export function Review() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviews = [
        {
            text: "LinkUP has proven to be an indispensable asset for team collaboration. Its intuitive design and efficiency streamline communication, making interactions both seamless and enjoyable. The overall experience with LinkUP is exceptionally positive, significantly boosting our productivity and enhancing our workflow.",
            name: "Gergana Mihaleva",
            company: "COO of MagicFilms",
            imagePerson: "https://imagizer.imageshack.com/v2/1600x1200q70/537/rXSlgb.jpg",
            logo: "https://imagizer.imageshack.com/v2/1600x1200q70/923/txctIr.png",
        },
        {
            text: "Using LinkUP has transformed our communication strategy. The platform's user-friendly interface and robust features make it an essential tool for our team. It's reliable, effective, and has truly elevated our collaborative efforts.",
            name: "John Doe",
            company: "Founder of TechInnovators",
            imagePerson: "https://imagizer.imageshack.com/v2/1600x1200q70/537/eslcrs.jpg",
            logo: "https://imagizer.imageshack.com/v2/1600x1200q70/924/IYakSY.png"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [reviews.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
            <p className="text-center text-3xl font-bold text-gray-900 mb-10">Reviews</p> {/* Reviews paragraph added */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(105rem_40rem_at_bottom,theme(colors.indigo.100),white)] opacity-80" />
            <div className="absolute inset-y-0 left-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
                <div className="relative overflow-hidden">
                    <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {reviews.map((review, index) => (
                            <div key={index} className="flex-shrink-0 w-full px-4">
                                <img alt="" src={review.logo} className="mx-auto h-24 mb-6" />
                                <figure className="mt-10">
                                    <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                                        <p>{review.text}</p>
                                    </blockquote>
                                    <figcaption className="mt-10">
                                        <img
                                            alt=""
                                            src={review.imagePerson}
                                            className="mx-auto h-12 w-12 rounded-full"
                                        />
                                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                            <div className="font-semibold text-gray-900">{review.name}</div>
                                            <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                                                <circle r={1} cx={1} cy={1} />
                                            </svg>
                                            <div className="text-gray-600">{review.company}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </div>
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out rounded-full p-2 shadow-md"
                        aria-label="Previous review"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out rounded-full p-2 shadow-md"
                        aria-label="Next review"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
