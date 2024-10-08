export default function Creators() {
    const creators = [
        {
            name: "Martina",
            imageUrl: "https://imagizer.imageshack.com/v2/1600x1200q70/923/7Us28e.jpg",
            githubUrl: "https://github.com/martinabeleva"
        },
        {
            name: "Ivo",
            imageUrl: "https://imagizer.imageshack.com/v2/800x600q70/923/BYBmtm.png",
            githubUrl: "https://github.com/IvoHristoff"
        },
        {
            name: "Lyuboslava",
            imageUrl: "https://imageshack.com/i/pmjfoMocj",
            githubUrl: "https://github.com/Lyuboslava1"
        }
    ];

    return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(105rem_40rem_at_bottom,theme(colors.indigo.200),white)] opacity-80" />
            <div className="absolute inset-y-0 right-1/4 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-12">Meet the Creators</h1>
                <div className="flex justify-center gap-8 flex-wrap">
                    {creators.map((creator) => (
                        <a
                            key={creator.name}
                            href={creator.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group flex flex-col items-center"
                        >
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg cursor-pointer transition-transform transform hover:scale-110 mb-4">
                                <img src={creator.imageUrl} alt={creator.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center text-gray-800">
                                <p className="text-xl font-semibold">{creator.name}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
