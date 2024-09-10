export default function Creators() {
    return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-12">Meet the Creators</h1>
                <div className="flex justify-center gap-8 flex-wrap">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg cursor-pointer transition-transform transform hover:scale-110">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Creator 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white px-4 py-2 rounded-md">
                            <blockquote className="text-xl font-semibold leading-8 text-white">
                                <p>
                                    Martina
                                </p>
                            </blockquote>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg cursor-pointer transition-transform transform hover:scale-110">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Creator 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white px-4 py-2 rounded-md">
                            <blockquote className="text-xl font-semibold leading-8 text-white">
                                <p>
                                    Ivo
                                </p>
                            </blockquote>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg cursor-pointer transition-transform transform hover:scale-110">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Creator 3" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white px-4 py-2 rounded-md">
                            <blockquote className="text-xl font-semibold leading-8 text-white">
                                <p>
                                    Lyuboslava
                                </p>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
