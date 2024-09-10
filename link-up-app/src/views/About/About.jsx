export default function About(){
    return(
        <>
            <div className="about-container p-8 text-gray-900 bg-gradient-to-r from-gray-100 to-indigo-300">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="mb-6 text-lg">Welcome to LinkUP! 🎉💬</p>

                <p className="mb-4">
                    LinkUP is a versatile communication app designed to bring people together, whether for professional collaboration or casual conversations. With LinkUP, you can create teams, start chat rooms, invite members, and send GIFs to make every interaction more fun and engaging. Whether you're managing a project, building a community, or chatting with friends, LinkUP has all the tools to keep everyone connected.
                </p>

                <h2 className="text-2xl font-semibold mb-3">What We Offer:</h2>
                <ul className="list-disc list-inside mb-6">
                    <li><strong>Create Teams & Chat Rooms:</strong> Organize your conversations with custom chat rooms and team spaces.</li>
                    <li><strong>Invite Members:</strong> Add people to your chat rooms and collaborate easily.</li>
                    <li><strong>Send GIFs:</strong> Make your conversations more lively with GIF sharing right within the chat.</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-3">Built With:</h2>
                <p className="mb-4">
                    LinkUP is built using React, Firebase Real-Time Database for fast data syncing, and styled with Tailwind CSS and DaisyUI for a smooth and modern user experience.
                </p>
                <p className="mb-6">
                    This project was developed in just one month, from August 13 to September 10, showcasing the dedication and passion of our team.
                </p>

                <h2 className="text-2xl font-semibold mb-3">Meet the Team:</h2>
                <p className="mb-4">
                    LinkUP was created by <a href="https://github.com/A62-JS-PG4-WEB" target="_blank" className="text-blue-500 hover:underline">Code Collective</a>, a group of passionate developers: Martina, Ivo, and Lyuboslava. We collaborated on every aspect of this project, from concept to design to deployment, ensuring that LinkUP meets the needs of both professional and casual users alike.
                </p>

                <h2 className="text-2xl font-semibold mb-3">Our Other Projects:</h2>
                <p className="mb-2">
                    Check out our other platforms:
                </p>
                <ul className="list-disc list-inside mb-6">
                    <li><a href="https://gifster-second.web.app/" target="_blank" className="text-blue-500 hover:underline">Gifster</a> – Explore and share fun GIFs.</li>
                    <li><a href="https://hike-quest-8d75b.web.app/" target="_blank" className="text-blue-500 hover:underline">Hike Quest</a> – A community for hiking enthusiasts.</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-3">Join Us!</h2>
                <p>
                    Whether you're using LinkUP for work or play, we're excited to have you join our community. Start chatting, collaborating, and sharing today with LinkUP!
                </p>
            </div>
        </>
    )
}
