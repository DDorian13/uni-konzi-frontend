import React, {Component} from "react";
import TableList from "./parts/TableList";

class SubjectList extends Component {
    constructor() {
        super();
        this.state = {
            response: {}
        }
    }

    handleClick = (row) => {
        const id = row.getAttribute("itemID");
        const url = new URL(window.location);
        url.pathname = window.location.pathname + `/${id}`;
        let keys = [];
        url.searchParams.forEach((value, key) => {
            keys.push(key);
        })
        keys.forEach(key => {
            url.searchParams.delete(key);
        })
        window.location = url;
    }

    render() {
        const headers = ["Tárgykód", "Név"];
        const valuesFrom = ["code", "name"];
        const responseAttribute = "subjects";
        return (
            <div>
                <h2 className={"uniNameInSubjects"}>{this.state.response.name}</h2>
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute={responseAttribute}
                    isPageable={true}
                    forResponse={this}
                    click={this.handleClick}
                />
            </div>
        );
    }
}

export default SubjectList;