/* eslint-disable react/display-name */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

const API_URL = 'http://localhost:3000/api';

export default () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const redirect = useNavigate();
    const { login } = useContext(Context);


    useEffect(() => {
        if (!login) {
            redirect('/login')
        }
    }, [login])

    useEffect(() => {
        const options = {
            credentials: 'include'
        }

        fetch(API_URL + '/project', options)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                } else {
                    setProjects(data)
                }
            })
    }, [])

    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
    }

    return (
        <>
            <h1>Lista de proyectos</h1>

            <button className="border p-3 bg-red-200" onClick={() => redirect('/project/new')}>Proyecto nuevo</button>
            <br />
            <br />
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table
                                className="min-w-full text-left text-sm font-light text-surface">
                                <thead
                                    className="border-b border-neutral-200 font-medium">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">#</th>
                                        <th scope="col" className="px-6 py-4">Nombre</th>
                                        <th scope="col" className="px-6 py-4">Descripción</th>
                                        <th scope="col" className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {projects.map(project =>
                                    (<tr key={project.id} className="border-b border-neutral-200">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{project.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{project.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{project.description}</td>
                                        <td className="whitespace-nowrap px-6 py-4"><button className="border p-2 bg-yellow-300" onClick={() => redirect("/kanban/" + project.id)} >Kanban</button></td>
                                    </tr>)
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}