import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css"
import Chat from "./Chat"
import Home from "./Home"
function App() {
  return (<Router>
    <Switch>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
</Router>);
}

export default App;
