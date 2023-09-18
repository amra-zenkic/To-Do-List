import React, { useState } from "react";

const NewToDoBlock = ({ onAddToDo, onCancel, Title, Body, Fun, Id }) => {
  const [title, setTitle] = useState(Title);
  const [body, setBody] = useState(Body);
  const updateExisting = true;
  if(Id === -1) { updateExisting = false }

  const handleAddToDo = () => {
    if(Id === -1) { // we actually have to create new task
      const ToDo = { title, body, deleted: "false" };
      if(title !== '') {
          fetch('http://localhost:8000/to-do/', {
        method: Fun, // its POST, PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ToDo)
      })
      .then(() => {
        console.log("New to-do added");
        // Call the callback function to refresh the to-do list and reset state
        onAddToDo();
      });
      }
    }
    else { // we just have to update wxisting one
      fetch(`http://localhost:8000/to-do/${Id}`, {
        method: 'PATCH', // Use PUT or PATCH based on your server implementation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: Title,
          body: Body
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
    
    
  }

    return (  
        <div className="addNewToDo-container">
            <div className="title-container">
                <h3>Title: </h3>
                <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                />
            </div>
            <div className="body-container">
            <h3>Description: </h3>
            <textarea 
            name="Title of To-Do"
            type="text" 
            required
            value={body}
            onChange={(e) => setBody(e.target.value)} 
            />
            </div>
            <div className="buttons">
        <button onClick={handleAddToDo}>Add This To-Do</button>
        <button onClick={onCancel} className="lastButton">Cancel</button> {/* Use onCancel prop */}
      </div>
            
        </div>
    );
}
 
export default NewToDoBlock;