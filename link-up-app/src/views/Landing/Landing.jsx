import { Review } from "../../components/Review/Review";

export function Landing() {

    return (

        <>
            <html data-theme="light dark">

                <div
                    className="hero min-h-screen"
                    style={{
                        backgroundImage: "url(https://img.freepik.com/free-photo/long-shot-business-people-meeting_23-2148427153.jpg?t=st=1723898181~exp=1723901781~hmac=aafd5cab694e411236e757fdd11eaf05d53967b6012936c734d1eca35256578d&w=1800)",
                    }}>
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-5xl font-bold">LinkUP</h1>
                            <p className="mb-5">
                                Connecting people, one message at a time. Whether you're collaborating with your team, catching up with friends, or building new communities, LinkUP makes communication seamless and fun. Dive in and start connecting today!
                            </p>
                            <button className="btn btn-primary">Get Started</button>
                        </div>
                    </div>

                </div>

                <Review />
            </html>
        </>
    )
}