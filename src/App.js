import React from "react";
import "./App.scss";
import RatesTable from "./components/RatesTable.jsx";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <RatesTable />
      </div>
    );
  }
}

export default App;
