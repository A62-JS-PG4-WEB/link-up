export function Review() {

    return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(105rem_40rem_at_bottom,theme(colors.indigo.100),white)] opacity-80" />
            <div className="absolute inset-y-0 left-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
                <img alt="" src="https://imagizer.imageshack.com/v2/1600x1200q70/923/txctIr.png" className="mx-auto h-24" />
                <figure className="mt-10">
                    <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                        <p>
                            “LinkUP has proven to be an indispensable asset for team collaboration. Its intuitive design and efficiency streamline communication, making interactions both seamless and enjoyable. The overall experience with LinkUP is exceptionally positive, significantly boosting our productivity and enhancing our workflow”
                        </p>
                    </blockquote>
                    <figcaption className="mt-10">
                        <img
                            alt=""
                            src="https://imagizer.imageshack.com/v2/1600x1200q70/537/rXSlgb.jpg"
                            className="mx-auto h-12 w-12 rounded-full"
                        />
                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                            <div className="font-semibold text-gray-900">Gergana Mihaleva</div>
                            <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                                <circle r={1} cx={1} cy={1} />
                            </svg>
                            <div className="text-gray-600">CEO of MagicFilms</div>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}
