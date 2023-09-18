import Home from "./Home";
import DoneToDo from "./DoneToDo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
 

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <div className="content">
        <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/DoneToDo'>
            <DoneToDo />
          </Route>
        </div>

          
        </Switch>
      </div>
    </Router>
    
   
  );
}

export default App;
