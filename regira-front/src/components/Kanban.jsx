/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Context from "../Context";
import TaskCard from "./TaskCard";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'TASK_ITEM';

const BOXES = [
    { state: 'backlog', name: 'Backlog' },
    { state: 'in_progress', name: 'In progress' },
    { state: 'review', name: 'Review' },
    { state: 'done', name: "Done" },
    { state: 'closed', name: 'Closed' }
];

// eslint-disable-next-line react-refresh/only-export-components
const Item = ({ deleteItem, data }) => {
    const [{ isDragging }, drag_ref] = useDrag({
        type: ItemType,
        item: { type: ItemType, id: data.id }
    });
    return <TaskCard reference={drag_ref} isDragging={isDragging} data={data} remove={deleteItem} />;

};

const Box = ({ children, box, moveItem }) => {
    const [{ isOver }, drop_ref] = useDrop({
        accept: ItemType,
        drop: (item) => {
            moveItem(item, box.state)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop_ref} className={`bg-slate-100 p-3 min-h-[400px] border ${isOver ? 'border-blue-500' : ''}`}>
            <h2 className="text-xl text-center mb-4" >{box.name}</h2>
            {children}
        </div>
    );
}

export default () => {
    const [project, setProject] = useState([]);
    const [error, setError] = useState('');
    const redirect = useNavigate();
    const [update, setUpdate] = useState(0);

    const { id } = useParams();

    const { logout, API_URL } = useContext(Context);

    const moveItem = (item, state) => {
        const options = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state })
        }

        fetch(API_URL + '/task/' + item.id, options)
            .then(r => r.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();
                else setUpdate(update + 1);
            })
            .catch(err => console.log(err))
    }

    const deleteItem = (item) => {
        const options = {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        fetch(API_URL + '/task/' + item.id, options)
            .then(r => r.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();
                else setUpdate(update + 1);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => { console.log(project) }, [project]);

    useEffect(() => {
        const options = {
            credentials: 'include',
        }

        fetch(API_URL + '/project/' + id + '/task', options)
            .then(resp => resp.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();

                if (data.error) {
                    setError(error)
                } else {
                    setProject(Object.values(data.tasks))
                    console.log(data.tasks)
                }
            })
            .catch(err => {
                console.log(err);
                setError(err)
            })
    }, [update])


    return (
        <>
            <div className="flex justify-between">

                <h1>Project: {project.name}</h1>
                <button className="border p-3 bg-red-200" onClick={() => redirect(`/task/new/${id}`)}>New Task</button>
            </div>
            <hr />
            <br />
            <br />

            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-5 gap-3">
                    {
                        BOXES.map(box => (
                            <Box key={box.state} box={box} moveItem={moveItem}  >
                                {project.filter(e => e.state == box.state).map(e => <Item key={e.id} deleteItem={deleteItem} data={e} />)}
                            </Box>

                        ))
                    }
                </div>
            </DndProvider>



        </>
    )
}

{/*  <Box key={box.state} box={box} moveItem={moveItem}  >
                                {
                                     project.filter(e => e.state == box.state).map(e => <Item key={e.id} deleteItem={deleteItem} data={e} />)
                                }
                            </Box> */}
