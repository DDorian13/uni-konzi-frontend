import React from "react";
import TableList from "../parts/TableList";
import Header from "../parts/Header";

function UsersList() {
    const headers = ["Név", "Email cím", "Jogosultságok"];
    const valuesFrom = ["name", "email", "roles"];

    const handleClick = (row) => {
        const id = row.getAttribute("itemID");
        //window.location.pathname = ....
    }

    return (
        <div>
            <Header/>
            <TableList
                headers={headers}
                valuesFrom={valuesFrom}
                responseAttribute=""
                isPageable={true}
                click={handleClick}
            />
        </div>
    );
}

export default UsersList;