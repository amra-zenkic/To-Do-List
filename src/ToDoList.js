import React, { useState } from 'react';
import NewToDoBlock from './NewToDoBlock';
import { useEffect } from 'react';

const MoveToDoButton = ({ currId, onMoveToDo, filteredToDos, UP }) => {
  const moveToDo = () => {
    var prevId = filteredToDos[0].id;
    if(UP) {
      for (let i = 1; i < filteredToDos.length; i++) {
        if (currId === filteredToDos[i].id) {
          break;
        }
        prevId = filteredToDos[i].id;
      }
    }
    else {
      for(let i = filteredToDos.length-1; i >= 0; i--) {
        if (currId === filteredToDos[i].id) {
          break;
        }
        prevId = filteredToDos[i].id;
      }
    }
    console.log("prev id", prevId);

    const fetchAndSwapToDos = async () => {
      try {
        const responseCurrent = await fetch(`http://localhost:8000/to-do/${currId}`);
        const responsePrev = await fetch(`http://localhost:8000/to-do/${prevId}`);

        if (!responseCurrent.ok || !responsePrev.ok) {
          throw new Error('Network response was not ok');
        }

        const dataCurrent = await responseCurrent.json();
        const dataPrev = await responsePrev.json();

        const copyOfCurrentToDo = { ...dataCurrent }; // creates a copy of dataCurrent
        dataCurrent.title = dataPrev.title;
        dataCurrent.body = dataPrev.body;
        dataPrev.title = copyOfCurrentToDo.title;
        dataPrev.body = copyOfCurrentToDo.body;
        
        // Update the to-do items on the server 
        fetch(`http://localhost:8000/to-do/${currId}`, {
        method: 'PATCH', // Use PUT or PATCH based on your server implementation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: dataCurrent.title,
          body: dataCurrent.body
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Update the UI or trigger a refresh
          //onAddToDo();
        })
        .catch((error) => {
          console.error('Error updating to-do:', error);
        });

        fetch(`http://localhost:8000/to-do/${prevId}`, {
        method: 'PATCH', // Use PUT or PATCH based on your server implementation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: dataPrev.title,
          body: dataPrev.body
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Update the UI or trigger a refresh
          //onAddToDo();
        })
        .catch((error) => {
          console.error('Error updating to-do:', error);
        });
        

        // Call onMoveToDo with the updated data or IDs
        onMoveToDo(currId, prevId);
      } catch (error) {
        console.error('Error updating to-do:', error);
      }
    };

    fetchAndSwapToDos();
  };

  return UP === true ? (
    <p onClick={moveToDo}>Move To-Do Up</p>
  ) : (
    <p onClick={moveToDo}>Move To-Do Down</p>
  );
  
};

const ToDoList = ({filteredToDos, onAddToDo, onCancel}) => {
  const inHomePage = onCancel === undefined ? false : true; // helps with showing/hiding 'options' on right side
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [editToDo, setEditToDo] = useState(null); // Store the to-do item being edited
  const [isExpanded, setIsExpanded] = useState(false);

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
const [expandedToDoId, setExpandedToDoId] = useState(null);

  const handleExpand = (id) => {
    if (expandedToDoId === id) {
      setExpandedToDoId(null); // Collapse the currently expanded item
    } else {
      setExpandedToDoId(id); // Expand the clicked item
    }
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
            <div className={`toDo-container ${expandedToDoId === toDo.id ? 'expandedVersion' : ''}`} key={toDo.id}>
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
              expandedToDoId === toDo.id ? (
                <p onClick={() => handleExpand(toDo.id)} className='fullBody'>{toDo.body}</p>
              ) : (
                <p>
                  {toDo.body.substr(0, 130)}...{' '}
                  <a href="#" onClick={() => handleExpand(toDo.id)}>
                    <i>Click to expand</i>
                  </a>
                </p>
              )
            ) : (
              <p>{toDo.body}</p>
            )}
          </div>
              <div className="options">
                {inHomePage && (
                  <p onClick={() => handleEdit(toDo.id, toDo.title, toDo.body)}>Edit To-Do</p>
                )}
                {filteredToDos[0].id === toDo.id ? (
                  <p className="disabeledP">Move To-Do Up</p>
                ) : (
                  <MoveToDoButton currId={toDo.id} onMoveToDo={onAddToDo} filteredToDos={filteredToDos} UP={true}/>
                )} 
                {filteredToDos[filteredToDos.length-1].id === toDo.id ? (
                  <p className="disabeledP">Move To-Do Down</p>
                ) : (
                  <MoveToDoButton currId={toDo.id} onMoveToDo={onAddToDo} filteredToDos={filteredToDos} UP={false}/>
                )}
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
