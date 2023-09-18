import React, { useState, useEffect } from "react";
import ToDoList from "./ToDoList";
import NewToDoBlock from "./NewToDoBlock";
import { Link } from "react-router-dom";

const DoneToDo = () => {
  const [newTaskBtnActive, setNewTaskBtnActive] = useState(true);
  const [addNewToDo, setAddNewToDo] = useState(false);
  const [toDos, setToDos] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  console.log("toDos in Home.js:", toDos);


  useEffect(() => {
    // Fetch data using fetch API or any library you prefer
    fetch('http://localhost:8000/to-do')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setToDos(data);
        setIsPending(false);
      })
      .catch((error) => {
        setError(error);
        setIsPending(false);
      });
  }, []);

  const handleRefreshToDoList = () => {
    // Trigger a refresh of the to-do list by resetting state
    setNewTaskBtnActive(true);
    setAddNewToDo(false);
    setIsPending(true);

    // Refetch the data
    fetch('http://localhost:8000/to-do')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setToDos(data);
        setIsPending(false);
      })
      .catch((error) => {
        setError(error);
        setIsPending(false);
      });
  };


  return (
    <><h1>Done To Do List:</h1>
    {error && <div>{error.message}</div>}
    {isPending ? (
      <div>Loading...</div>
    ) : (
      <>
      <div className="buttonContainer">
        <Link to='/'><button>Get Back to<br />To-Do List</button></Link>
      </div>
      <div className="done">
        <ToDoList filteredToDos={toDos.filter((toDo) => toDo.deleted === "true")} onAddToDo={handleRefreshToDoList} />
      </div>
      </>
    )}

  </>

  );
}

export default DoneToDo;
