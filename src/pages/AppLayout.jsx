/* eslint-disable react/prop-types */
import { Outlet } from "react-router";
import PageNav from "../components/PageNav";
function AppLayout({
  selectedOption,
  encodedName,
  setEncodedName,
  setSelectedOption,
  membersList,
  setItems,
}) {
  return (
    <section>
      <PageNav
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        encodedName={encodedName}
        setEncodedName={setEncodedName}
        setItems={setItems}
        membersList={membersList}
      />
      <div className="mt-[12vh]">
        <Outlet />
      </div>
    </section>
  );
}

export default AppLayout;
