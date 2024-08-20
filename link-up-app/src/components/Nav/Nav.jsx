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
                <a className="btn btn-ghost text-xl">LinkUP</a>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <Counter />
            </div>

            <div className="flex items-center gap-2">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>

                <input type="checkbox" value="synthwave" className="toggle theme-controller" />
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <NavLink to="/profile" className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </NavLink>
                            </li>
                            <li><NavLink to="/settings">Settings</NavLink></li>
                            <button onClick={logout} className="btn btn-ghost">Logout</button>
                        </ul>
                    </div>
                ) : (
                    <>
                        <NavLink to="/login">Log in</NavLink>
                        <button className="btn btn-active btn-ghost"> <NavLink to="/register">Sign up</NavLink></button>

                    </>
                )}

            </div>
        </div>
    );
}
