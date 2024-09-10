import { NavLink } from "react-router-dom";
import { Review } from "../../components/Review/Review";
import Creators from "../../components/Creators/Creators";

export function Landing() {

    return (
        <div data-theme="light dark">

            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: "url(https://imagizer.imageshack.com/v2/1600x1200q70/923/jvbgbq.jpg)",
                }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">LinkUP</h1>
                        <p className="mb-5">
                            Connecting people, one message at a time. Whether you're collaborating with your team, catching up with friends, or building new communities, LinkUP makes communication seamless and fun. Dive in and start connecting today!
                        </p>
                        <button className="btn btn-primary"><NavLink to="/register">Get Started</NavLink></button>
                    </div>
                </div>

            </div>

            <Review />
            <Creators />
        </div>
    )
}