import React from "react";
import TableList from "../parts/TableList";

function TutorOf(props) {

    const headers = ["Tárgykód", "Név"];
    const valuesFrom = ["code", "name"];

    const handleClick = (row) => {
        const id = row.getAttribute("itemID");
        const url = new URL(window.location);
        url.pathname = `/subjects/${id}/pupils`;
        let keys = [];
        url.searchParams.forEach((value, key) => {
            keys.push(key);
        })
        keys.forEach(key => {
            url.searchParams.delete(key);
        })
        window.location = url;
    }

    return (
        <div>
            <h2 className="uniNameInSubjects">Konzultációt tudok tartani</h2>
            <TableList
                headers={headers}
                valuesFrom={valuesFrom}
                isPageable={true}
                click={handleClick}
            />
        </div>
    );
}

export default TutorOf;