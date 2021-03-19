import React, {Component} from "react";
import TableList from "./parts/TableList";
import Header from "./parts/Header";


class SubjectList extends Component {
    constructor() {
        super();
        this.state = {
            response: {}
        }
    }

    render() {
        const headers = ["Tárgykód", "Név"];
        const valuesFrom = ["code", "name"];
        const responseAttribute = "subjects";
        return (
            <div>
                <Header/>
                <h2 className={"uniNameInSubjects"}>{this.state.response.name}</h2>
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute={responseAttribute}
                    isPageable={true}
                    forResponse={this}
                    click={() => console.log("click")}
                />
            </div>
        );
    }
}

export default SubjectList;