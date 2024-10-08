import { useContext, useState } from "react";
import { registerUser } from "../../services/auth.service";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserUsername, getUserByEmail, getUserByUsername } from "../../services/users.service";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../../common/constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Register component for handling user registration.
 * Contains form fields for email, username, phone, password, and confirm password.
 * Validates form data and submits it for user registration.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 */
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

    /**
    * Function to update user state based on form inputs.
    * Uses property name as a key and updates the corresponding state value.
    *
    * @param {string} prop - The key of the property being updated (e.g., 'username', 'email').
    * @returns {function} A function to handle the event and update state accordingly.
    */
    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    /**
   * Handles form submission for registering a new user.
   * Validates the input data, checks for existing user accounts, registers the user,
   * and updates the application state upon success.
   *
   * @param {Event} e - The form submission event.
   * @returns {Promise<void>} Resolves when registration is complete or validation fails.
   */
    const register = async (e) => {
        e.preventDefault();

        if (!user.email.trim() || !user.password) {
            return toast.error('No credentials provided!');
        }
        if (user.password !== user.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (user.username.length < MIN_USERNAME_LENGTH || user.username.length > MAX_USERNAME_LENGTH) {
            return toast.error('Invalid username length');
        }

        try {
            const userEmail = await getUserByEmail(user.email.trim());
            if (userEmail) {
                return toast.warn(`User with email ${user.email} already exists!`);
            };

            const userFromDB = await getUserByUsername(user.username);
            if (userFromDB) {
                return toast.warn(`User ${user.username} already exists!`);
            };


            const credential = await registerUser(user.email.trim(), user.password.trim());
            await createUserUsername(user.username, credential.user.uid, user.email, user.phone);
            setAppState({ user: credential.user, userData: null });
            navigate('/home');
            toast.success('Successfully registered');

        } catch (error) {
            toast.error(error.message);

        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-l from-white to-indigo-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://imagizer.imageshack.com/v2/1600x1200q70/922/s4nXvx.png"
                    className="mx-auto h-16 w-auto"
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
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                placeholder='Password...'
                                value={user.password}
                                onChange={updateUser('password')}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                placeholder='Confirm password...'
                                value={user.confirmPassword}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={updateUser('confirmPassword')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
