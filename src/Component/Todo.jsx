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

    const addItem = () => {
        if(inputData){
            if(!toggleBtn){
                setItem(
                    item.map((elem)=>{
                        if(elem.id === editItemId){
                            return {...elem, data:inputData}
                        }
                        return elem;
                    })
                )
                setToggleBtn(true);
                setInputData('');
                setEditItemId(null);
            } else {
                const objdata = { id:new Date().getTime().toString(), data:inputData}
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

                <div className="itemlist">
                {
                    item.map( (elem, idx) => {
                        return (
                            <div className="item" key={elem.id}>
                                <span>{elem.data}</span>
                                <i className="fas fa-edit edit-item" onClick={()=>editItem(elem.id)}></i>
                                <i className="fas fa-times remove-btn" 
                                onClick={()=>deleteItem(elem.id)}></i>
                            </div>
                        )
                    })
                }
                </div>

                <div className="btn">
                    <button className="button remove-all" type="button" data-hover="REMOVE ALL" data-active="I'M ACTIVE" onClick={()=>setItem([])}><span>CHECK LIST</span></button>
                </div>
            </div>
        </>
    )
}

export default Todo
