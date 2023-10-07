import './App.scss'
import {AuthProvider} from "./hooks/useAuth.tsx";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./routing/AppRouter.tsx";


function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
