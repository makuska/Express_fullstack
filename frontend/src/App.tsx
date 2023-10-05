import './App.scss'
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataTable from "./components/DataTable";
import {AuthContext} from "./context/AuthContext.tsx";
import {useAuth} from "./hooks/useAuth.ts";

function App() {
  const { user, setUser } = useAuth();

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <Header />
          <div className="body-content">
            <DataTable />
          </div>
        <Footer />
      </AuthContext.Provider>
    </>
  )
}

export default App
