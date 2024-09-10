import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-base-200 text-base-content">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-error">404</h1>
                <p className="text-2xl md:text-3xl font-semibold mt-4">
                    Oops! Page not found.
                </p>
                <span className="loading loading-dots loading-lg"></span>
                <p className="mt-2 mb-8 text-gray-500">
                    The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
