import Header from "../components/Header.tsx";
import DataTable from "../components/DataTable.tsx";
import Footer from "../components/Footer.tsx";

export function HomePage(){
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