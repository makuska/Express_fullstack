import './App.scss'
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataTable from "./components/DataTable";

function App() {

  return (
    <>
        <Header />
            <div className="body-content">
                <DataTable />
            </div>
        <Footer />
    </>
  )
}

export default App
