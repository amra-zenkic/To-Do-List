import React, { useState } from 'react';
import NewToDoBlock from './NewToDoBlock';


const ToDoList = ({filteredToDos, onAddToDo, onCancel}) => {
  const inHomePage = onCancel === undefined ? false : true; // helps with showing/hiding 'options' on right side
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [editToDo, setEditToDo] = useState(null); // Store the to-do item being edited

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
        onAddToDo();
      })
      .catch((error) => {
        console.error('Error updating to-do:', error);
      });
}
const handleEdit = (currId, currTitle, currBody) => {
  console.log(currId, currTitle, currBody);
  setIsEditing(true); // Enable editing mode
  setEditToDo({ id: currId, title: currTitle, body: currBody }); // Store the to-do item being edited
};

const cancelEdit = () => {
  setIsEditing(false); // Disable editing mode
  setEditToDo(null); // Clear the to-do item being edited
};
    return (  
      <div className="toDos-list">
      {filteredToDos.map((toDo) => (
        <div className="newContainer" key={toDo.id}>
          {isEditing && toDo.id === editToDo?.id ? ( // Render edit form for the specific to-do item
            <NewToDoBlock
              onAddToDo={onAddToDo}
              onCancel={cancelEdit}
              Title={editToDo.title}
              Body={editToDo.body}
              Fun='PATCH'
              Id={editToDo.id}
            />
          ) : (
            // Render the to-do item normally
            <>
            <div className="toDo-container" key={toDo.id}>
              <div className="checkBox">
                <input
                  type="checkbox"
                  name="check"
                  id="check"
                  onChange={() => handleChangeDeleted(toDo.id, toDo.deleted)}
                />
              </div>
              <div className="blog-preview" key={toDo.id}>
                <h2>{toDo.title}</h2>
                {toDo.body.length > 130 ? (
                  <p>
                    {toDo.body.substr(0, 130)}...{' '}
                    <a href="#">
                      <i>Click to expand</i>
                    </a>
                  </p>
                ) : (
                  <p>{toDo.body}</p>
                )}
              </div>
              <div className="options">
                {inHomePage && (
                  <p onClick={() => handleEdit(toDo.id, toDo.title, toDo.body)}>Edit To-Do</p>
                )}
                <p>Move To-Do Up</p>
                <p>Move To-Do Down</p>
              </div>
              </div>
            </>
          )}
        
        </div>
      ))}
    </div>

    
    );
}
 
export default ToDoList;
