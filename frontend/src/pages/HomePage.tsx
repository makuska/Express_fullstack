import Header from "../components/Header.tsx";
import DataTable from "../components/DataTable.tsx";
import Footer from "../components/Footer.tsx";
import useAuth from "../hooks/useAuth.tsx";

export function HomePage(){
  const {user} = useAuth()
  return (
    <>
      <Header />
      {console.log(user)}
        <div className="body-content">
          <DataTable />
        </div>
      <Footer />
    </>
  )
}