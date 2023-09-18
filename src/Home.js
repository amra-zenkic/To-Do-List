import React, { useState, useEffect } from "react";
import ToDoList from "./ToDoList";
import NewToDoBlock from "./NewToDoBlock";
import { Link } from "react-router-dom";

const Home = () => {
  const [newTaskBtnActive, setNewTaskBtnActive] = useState(true);
  const [addNewToDo, setAddNewToDo] = useState(false);
  const [toDos, setToDos] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  


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

  const handleNewTaskBtn = () => {
    setNewTaskBtnActive(false);
    setAddNewToDo(true);
  };

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

  const handleCancel = () => {
    // Implement your cancel logic here
    setNewTaskBtnActive(true);
    setAddNewToDo(false);
  };

  return (

      <><h1>To Do List:</h1><div className="buttonContainer">
      {newTaskBtnActive && <button className="newTaskBtn" onClick={handleNewTaskBtn}>Add New Task</button>}
      {newTaskBtnActive && <Link to='/DoneToDo'><button className="checkDoneBtn">Check Done<br />To-Do List</button></Link>}

      {addNewToDo && <NewToDoBlock onAddToDo={handleRefreshToDoList} onCancel={handleCancel} Title={''} Body={''} Fun={'POST'} Id={'-1'} />}
      </div>
      {error && <div>{error.message}</div>}
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ToDoList filteredToDos={toDos.filter((toDo) => toDo.deleted === "false")} onAddToDo={handleRefreshToDoList} onCancel={handleCancel} />
      )}

    </>
  );
}

export default Home;
