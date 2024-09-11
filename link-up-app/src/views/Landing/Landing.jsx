import { NavLink } from "react-router-dom";
import { Review } from "../../components/Review/Review";
import Creators from "../../components/Creators/Creators";

export function Landing() {

    return (
        <div data-theme="light dark bg-red-200">

            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: "url(https://imagizer.imageshack.com/v2/1600x1200q70/923/jvbgbq.jpg)",
                }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">LinkUP</h1>
                        <p className="mb-5 text-xl font-semibold">
                            Connecting People, One Message at a Time!
                        </p>
                        <p className="mb-5">
                            Welcome to LinkUP, where every message brings people closer together! Whether you're teaming up with colleagues, catching up with friends, or discovering new communities, LinkUP makes every conversation seamless and exciting. Jump in and start connecting today!
                        </p>

                        <button className="btn btn-primary bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition duration-300 ease-in-out px-6 py-3 rounded-lg">
                            <NavLink to="/register" className="flex items-center justify-center">
                                Get Started
                            </NavLink>
                        </button>
                    </div>
                </div>

            </div>


            <Review />
            <Creators />
        </div >
    )
}