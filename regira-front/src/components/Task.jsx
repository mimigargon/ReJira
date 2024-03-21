/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Context from '../Context';

const default_task = { name: '', description: '', priority: '', state: 'backlog', task_type: '' };

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
    const [task, setTask] = useState(default_task);
    const [validTask, setValidTask] = useState(false);

    const redirect = useNavigate();
    const { logout, API_URL } = useContext(Context);
    const { projectId } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value })
    }

    const createTask = (e) => {
        e.preventDefault();

        const options = {
            method: "POST",
            body: JSON.stringify(task),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(API_URL + '/task/project/' + projectId, options)
            .then(res => res.json())
            .then(data => {
                (data.error == 'Unauthorized') ? logout() : redirect('/kanban/' + projectId);
            })
            .catch(cosa => console.log(cosa))
    }

    useEffect(() => {
        if (task.name && task.description) {
            setValidTask(true)
        } else {
            setValidTask(false)
        }
    }, [task])

    return (
        <>
            <form className="max-w-lg mx-auto" onSubmit={createTask}>
                <h2 className="text-xl font-semibold mb-4">Create Task</h2>

                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        required
                        name="name"
                        value={task.name}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="block font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="task_type" className="block font-medium text-gray-700 mb-1">Type</label>
                        <select
                            id="task_type"
                            name="task_type"
                            value={task.task_type}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="story">Story</option>
                            <option value="bugs">Bugs</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block font-medium text-gray-700 mb-1">Prioritat</label>
                        <select
                            id="priority"
                            name="priority"
                            value={task.priority}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`bg-blue-500 ${validTask ? 'hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'} text-white font-semibold py-2 px-4 rounded mr-2`}
                        disabled={!validTask}
                    >
                        Desa
                    </button>
                    <button
                        type="button"
                        onClick={() => redirect('/kanban/' + projectId)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

