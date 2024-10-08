import { NavLink } from "react-router-dom";
import { Counter } from "../Counter/Counter";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";

export function Nav() {
    const { user } = useContext(AppContext);

    return (
        <div className="navbar bg-base-100">
            <div className="flex items-center">
                <NavLink
                    to={user ? "/home" : "/"}
                    className="btn btn-ghost text-xl flex items-center"
                >
                    <img
                        src="https://imagizer.imageshack.com/v2/1600x1200q70/924/KrCL5s.png"
                        alt="Logo"
                        className="h-12 w-24 mr-6"
                    />
                </NavLink>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <Counter />
            </div>
            <NavLink
                to="/login"
                className="inline-block px-6 py-3 text-gray-900 hover:text-indigo-600 hover:scale-115 transition duration-300 ease-in-out font-semibold"
            >
                Log in
            </NavLink>

            <button className="btn btn-active btn-ghost bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition duration-300 ease-in-out px-6 py-3 rounded-lg">
                <NavLink to="/register" className="flex items-center justify-center">
                    Sign up
                </NavLink>
            </button>

        </div>
    );
}
