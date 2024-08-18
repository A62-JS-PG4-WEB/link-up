import { useContext, useState } from "react"
import { registerUser } from "../../services/auth.service"
import { AppContext } from "../../state/app.context"
import { useNavigate } from "react-router-dom"
import { createUserUsername, getUserByUsername } from "../../services/users.service"


export default function Register() {
    const [user, setUser] = useState({
        username: '',
        phone: '', 
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    const register = async () => {

        if (!user.email.trim() || !user.password) {
            return console.error('No credentials provided!');
        }
        if (user.password !== user.confirmPassword) {
            console.info("Passwords do not match!");
            return;
        }

        if (user.username.length < 5 || user.username.length > 35) {
            return console.error('Invalid username length');
        }
    
        try {
            // const userDB = await getUserByEmail(user.email.trim());
            // if (userDB) {
            //     return console.error(`User {${user.email}} already exists!`);
            // }

            const userFromDB = await getUserByUsername(user.username);
            if (userFromDB) {
                return console.error(`User {${user.username}} already exists!`);
            }
            const credential = await registerUser(user.email.trim(), user.password.trim());
            await createUserUsername(user.username, credential.user.uid, user.email, user.phone);
            setAppState({ user: credential.user, userData: null });
            navigate('/');
            console.success('Successfully registered');
        } catch (error) {
            console.error(error.message);
        }
    };


    return (
        <>
            <div className="registerContainer">
                <h1 className="registerTitle">Register</h1>

                <label className="registerLabel" htmlFor="handle">Username: </label>
                <input className="registerInput" placeholder='Create a username...' value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" /><br />

                <label className="registerLabel" htmlFor="firstName">First name: </label>
                <input className="registerInput" placeholder='Create a first name...' value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br />

                <label className="registerLabel" htmlFor="lastName">Last name: </label>
                <input className="registerInput" placeholder='Create a last name...' value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br />

                <label className="registerLabel" htmlFor="email">Email: </label>
                <input className="registerInput" placeholder='Create email...' value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br />

                <label className="registerLabel" htmlFor="password">Password: </label>
                <input className="registerInput" placeholder='Create a password...' value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br />

                <label className="registerLabel" htmlFor="confirmPassword">Confirm Password: </label>
                <input className="registerInput" placeholder='Confirm the password...' value={user.confirmPassword} onChange={updateUser('confirmPassword')} type="password" name="confirmPassword" id="confirmPassword" /><br />

                <button className="registerButton" onClick={register}>Register</button>
            </div>
        </>

    );
}