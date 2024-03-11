/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Context from "../Context";

const API_URL = 'http://localhost:3000/api';

export default () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const redirect = useNavigate();
    const { login, logout, setLogin } = useContext(Context);


    useEffect(() => {
        if (document.cookie.includes('token')) {
            fetch(API_URL + '/refresh', { credentials: "include" })
                .then(e => e.json())
                .then(data => {
                    if (data.error) {
                        logout();
                    } else {
                        setLogin(data)
                    }
                })
        }
    }, [])

    useEffect(() => {
        if (!login) {
            redirect('/login')
        }
    }, [login])

    const createProject = (event) => {
        event.preventDefault();

        const project = { name, description, active }

        const options = {
            method: 'POST',
            body: JSON.stringify(project),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },

        }

        fetch(API_URL + '/project', options)
            .then(response => response.json())
            .then(data => {
                redirect('/project')
            })
            .catch(thing => console.log(thing))

    }

    return (


        <div className="w-1/2">
            <form onSubmit={createProject} className="bg-white  px-8 pt-6 pb-8 mb-4">
                <h1 className="">Proyecto nuevo</h1>
                <hr />
                <br />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nombre
                    </label>
                    <input
                        onInput={(event) => setName(event.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Nombre" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Descripción
                    </label>
                    <textarea
                        onInput={(event) => setDescription(event.target.value)}
                        value={description}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Descripción" />
                </div>
                <div >
                    <br />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Guardar
                    </button>

                </div>
            </form>

        </div>
    )
}