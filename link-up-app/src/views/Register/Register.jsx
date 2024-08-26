import { useContext, useState } from "react";
import { registerUser } from "../../services/auth.service";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserUsername, getUserByEmail, getUserByUsername } from "../../services/users.service";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../../common/constants";

export default function Register() {
    const [user, setUser] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    const register = async (e) => {
        e.preventDefault();

        if (!user.email.trim() || !user.password) {
            return console.error('No credentials provided!');
        }
        if (user.password !== user.confirmPassword) {
            console.info("Passwords do not match!");
            return;
        }

        if (user.username.length < MIN_USERNAME_LENGTH || user.username.length > MAX_USERNAME_LENGTH) {
            return console.error('Invalid username length');
        }

        try {
            const userEmail = await getUserByEmail(user.email.trim());
            if (userEmail) {
                return alert(`User with email ${user.email} already exists!`);
            };

            const userFromDB = await getUserByUsername(user.username);
            if (userFromDB) {
                return alert(`User ${user.username} already exists!`);
            };

            const credential = await registerUser(user.email.trim(), user.password.trim());
            await createUserUsername(user.username, credential.user.uid, user.email, user.phone);
            setAppState({ user: credential.user, userData: null });
            navigate('/home');
            } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Get started with LinkUP
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={register} className="space-y-6">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder='Type your email...'
                                value={user.email}
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={updateUser('email')}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                autoComplete="username"
                                placeholder='Your username...'
                                value={user.username}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={updateUser('username')}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder='Phone number...'
                                value={user.phone}
                                autoComplete="phone"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={updateUser('phone')}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={user.password}
                                onChange={updateUser('password')}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={user.confirmPassword}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={updateUser('confirmPassword')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
