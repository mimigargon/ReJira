/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import Context from "../Context";

const API_URL = 'http://localhost:3000/api';

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
    const { setRegister } = useContext(Context);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const redirect = useNavigate();

    const isRegister = (event) => {
        event.preventDefault();

        const credentials = {
            name,
            email,
            password
        }

        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }

        fetch(API_URL + '/register', options)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setRegister(data)
                    redirect('/project')
                }
            })
            .catch(error => console.error(error))

    }


    return (
        <div className="w-full max-w-xs m-auto">
            <form onSubmit={isRegister} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-center">Register</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        onInput={(event) => setName(event.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Username" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onInput={(event) => setEmail(event.target.value)}
                        value={email}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        onInput={(event) => setPassword(event.target.value)}
                        value={password} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="text-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Entrar
                    </button>
                    <NavLink className="text-blue-700 text-decoration-underline" to='/login'>¿Ya tienes cuenta? Inicia sesión</NavLink>

                </div>
            </form>

        </div>
    )
}