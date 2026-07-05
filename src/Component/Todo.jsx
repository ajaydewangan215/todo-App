import React, {useState, useEffect} from 'react'
import Todoimage from '../images.png'

// to get data from local Storage
const localStorageItem = ()=>{
   const data =  localStorage.getItem('todolist');
   if(data){
       return JSON.parse(data);
   }
   return [];
}

const Todo = () => {
    const [inputData, setInputData] = useState('');
    const [item, setItem] = useState(localStorageItem);
    const [toggleBtn, setToggleBtn] = useState(true);
    const [editItemId, setEditItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const addItem = () => {
        if(inputData.trim()){
            if(!toggleBtn){
                setItem(
                    item.map((elem)=>{
                        if(elem.id === editItemId){
                            return {...elem, data:inputData.trim()}
                        }
                        return elem;
                    })
                )
                setToggleBtn(true);
                setInputData('');
                setEditItemId(null);
            } else {
                const objdata = { id:new Date().getTime().toString(), data:inputData.trim(), completed:false, createdAt:new Date().toLocaleDateString() }
                setItem([...item, objdata]);
                setInputData('');
            }
        }
    }

    const deleteItem = (id) => {
       const data =  item.filter((elem, idx) => {
            return elem.id !== id
        })
        setItem(data);
    }

    const editItem = (id) => {
        const EditId = item.find((elem)=>{
            return elem.id===id
        })
        setToggleBtn(false);
        setInputData(EditId.data);
        setEditItemId(id);
    }

    const toggleComplete = (id) => {
        setItem(item.map((elem)=> elem.id===id ? {...elem, completed: !elem.completed} : elem));
    }

    const filteredItems = item.filter((elem) => {
        const matchesSearch = elem.data.toLowerCase().includes(searchTerm.toLowerCase());
        if(filter === 'active') return matchesSearch && !elem.completed;
        if(filter === 'completed') return matchesSearch && elem.completed;
        return matchesSearch;
    });

    const totalTasks = item.length;
    const completedCount = item.filter((elem) => elem.completed).length;
    const pendingCount = totalTasks - completedCount;

    const clearAllItems = () => {
        const confirmClear = window.confirm('Are you sure you want to remove all tasks?')
        if (confirmClear) {
            setItem([])
        }
    }

    const clearCompletedItems = () => {
        setItem(item.filter((elem) => !elem.completed))
    }

    // Add data to local storage
    useEffect(() => {
        localStorage.setItem('todolist', JSON.stringify(item));        
    }, [item]);

    return (
        <>
            <div className="container">
                <figure>
                    <img src={Todoimage} alt="logo" />
                    <figcaption>Add Your Task</figcaption>
                </figure>

                <div className="input-field">
                    <input type="text" placeholder="Add Here.."
                    value={inputData}
                    onChange={ (e)=>setInputData(e.target.value) } />
                    {
                        toggleBtn ? <i className="fas fa-plus add-btn" title="Add Item" onClick={addItem}></i> : <i className="fas fa-edit add-btn" title="Update Item" onClick={addItem}></i>
                    }
                </div>

                {item.length > 0 && (
                    <>
                        <div className="search-box">
                            <input type="text" placeholder="Search todos.." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
                        </div>

                        <div className="filter-row">
                            <button type="button" className={filter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={()=>setFilter('all')}>All</button>
                            <button type="button" className={filter === 'active' ? 'filter-btn active' : 'filter-btn'} onClick={()=>setFilter('active')}>Active</button>
                            <button type="button" className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'} onClick={()=>setFilter('completed')}>Completed</button>
                        </div>

                        <div className="stats-row">
                            <span>Total Tasks: {totalTasks}</span>
                            <span>Completed Count: {completedCount}</span>
                            <span>Pending Count: {pendingCount}</span>
                        </div>
                    </>
                )}

                <div className="itemlist">
                {
                    filteredItems.length > 0 ? filteredItems.map( (elem, idx) => {
                        return (
                            <div className={`item ${elem.completed ? 'completed' : ''}`} key={elem.id}>
                                                <label className="task-label">
                                    <input type="checkbox" checked={elem.completed} onChange={()=>toggleComplete(elem.id)} />
                                    <span>{elem.data}</span>
                                </label>
                                <i className="fas fa-edit edit-item" onClick={()=>editItem(elem.id)}></i>
                                <i className="fas fa-times remove-btn" 
                                onClick={()=>deleteItem(elem.id)}></i>
                            </div>
                        )
                    }) : <p className="empty-state">No tasks found for this view.</p>
                }
                </div>

                {item.length > 0 && (
                    <div className="btn">
                        <button className="button clear-completed" type="button" onClick={clearCompletedItems}>Clear Completed</button>
                        <button className="button remove-all" type="button" onClick={clearAllItems}><span>Clear All</span></button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Todo
