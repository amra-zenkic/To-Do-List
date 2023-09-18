import React from 'react';
import { useHistory } from 'react-router-dom';
import NewToDoBlock from './NewToDoBlock';


const ToDoList = ({data}) => {
  const filteredToDos = data.filteredToDos; // Change 'toDos' to 'filteredToDos'
  const handleRefreshToDoList = data.handleRefreshToDoList;
  console.log("toDos in Home.js:", filteredToDos);

  const handleCancel = () => {
    // Implement your cancel logic here
    setNewTaskBtnActive(true);
    setAddNewToDo(false);
  };
  
  const handleChangeDeleted = (id, currentDeletedValue) => {
    const updatedDeletedValue = currentDeletedValue === "true" ? "false" : "true";

    fetch(`http://localhost:8000/to-do/${id}`, {
      method: 'PATCH', // Use PUT or PATCH based on your server implementation
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deleted: updatedDeletedValue
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Update the UI or trigger a refresh
        handleRefreshToDoList();
      })
      .catch((error) => {
        console.error('Error updating to-do:', error);
      });
}
const handleEdit = (currId, currTitle, currBody) => {
  <NewToDoBlock  onAddToDo={handleRefreshToDoList} onCancel={handleCancel} Title={currTitle} Body={currBody} Fun={'PATCH'}/>
  fetch(`http://localhost:8000/to-do/${id}`, {
    method: 'PATCH', // Use PUT or PATCH based on your server implementation
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deleted: updatedDeletedValue
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Update the UI or trigger a refresh
      handleRefreshToDoList();
    })
    .catch((error) => {
      console.error('Error updating to-do:', error);
    });
}



    return (  
    <div className="toDos-list">
      
      {filteredToDos.map(toDo => (
        <>
        <div className="toDo-container">
          <div className="checkBox">
          <input type="checkbox" name="check" id="check" onChange={() => handleChangeDeleted(toDo.id, toDo.deleted)} />
          </div>
          
          <div className="blog-preview" key={toDo.id}>
              <h2>{toDo.title}</h2>
              {toDo.body.length > 130 ? (
                <p>{toDo.body.substr(0, 130)}... <a href="#"><i>Click to expand</i></a></p>
              ) : (
              <p>{toDo.body}</p>
              )}
          </div>
          <div className="options">
              <p onClick={() => handleEdit(toDo.id, toDo.title, toDo.body)}>Edit To-Do</p>
              <p>Move To-Do Up</p>
              <p>Move To-Do Down</p>
          </div>
        </div>
        
        </>
      ))}
    </div>
    );
}
 
export default ToDoList;
