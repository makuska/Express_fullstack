import DashHeader from "../components/dashboardUser/DashHeader.tsx";
import DashLayout from "../components/dashboardUser/DashLayout.tsx";
import DashFooter from "../components/dashboardUser/DashFooter.tsx";
// import {AuthContext} from "../context/AuthContext.tsx";
// import {useAuth} from "../hooks/useAuth.ts";

function DashboardPage() {
  // const { user, setUser } = useAuth();

  return (
    <>
      {/*<AuthContext.Provider value={{ user, setUser }}>*/}
        <DashHeader />
        <DashLayout />
        <DashFooter />
      {/*</AuthContext.Provider>*/}
    </>
  )
}

export default DashboardPage