import './App.scss'
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import DataTable from "./components/DataTable.tsx";

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
