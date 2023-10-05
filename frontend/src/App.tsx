import './App.scss'
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataTable from "./components/DataTable";
import {AuthProvider} from "./context/AuthProvider.tsx";

function App() {

  return (
    <>
      <AuthProvider.Provider value>
        <Header />
          <div className="body-content">
            <DataTable />
          </div>
        <Footer />
      </AuthProvider.Provider>
    </>
  )
}

export default App
