import React from "react";
import TableList from "../parts/TableList";

function PupilOf(props) {

    const headers = ["Tárgykód", "Név"];
    const valuesFrom = ["code", "name"];

    return (
        <div>
            <h2 className="uniNameInSubjects">Konzultációt kérek</h2>
            <TableList
                headers={headers}
                valuesFrom={valuesFrom}
                isPageable={true}
                click={() => {}}
            />
        </div>
    );
}

export default PupilOf;