import './App.css';
import DataTableComponent from './components/DataTableComponent';
import NavBarComponent from './components/NavBarComponents';


function App() {
  return (
    <div className="App ">
      <NavBarComponent />

      <div className="container-xl">
        <DataTableComponent />
      </div>
      
    </div>
  );
}

export default App;
