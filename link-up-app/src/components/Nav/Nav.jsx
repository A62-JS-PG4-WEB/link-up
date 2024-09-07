import { NavLink, useNavigate } from "react-router-dom";
import { Counter } from "../Counter/Counter";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
import { logoutUser } from "../../services/auth.service";

export function Nav() {
    const { user, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex items-center">
                <NavLink
                    to={user ? "/home" : "/"}
                    className="btn btn-ghost text-xl"
                >
                    LinkUP
                </NavLink>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <Counter />
            </div>
            <NavLink to="/login" className="pr-5 hover:scale-115 transition duration-300 ease-in-out">
                Log in
            </NavLink>
            <button className="btn btn-active btn-ghost hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out">
                <NavLink to="/register" className="transition duration-300 ease-in-out">
                    Sign up
                </NavLink>
            </button>
        </div>
    );
}
