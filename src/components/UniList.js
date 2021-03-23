import React, {Component} from "react";
import TableList from "./parts/TableList";
import Header from "./parts/Header";

class UniList extends Component {
    constructor() {
        super();
        this.state = {}
    }

    handleClick = (row) => {
        const id = row.getAttribute("itemID");
        const url = new URL(window.location);
        url.pathname = "/universities/" + id;
        let keys = [];
        url.searchParams.forEach((value, key) => {
            keys.push(key)
        })
        keys.forEach(key => url.searchParams.delete(key));
        window.location = url;
    }

    render() {
        const headers = ["Egyetem neve", "Ország", "Város"];
        const valuesFrom = ["name", "country", "city"];
        return (
            <div>
                <Header/>
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute=""
                    isPageable={true}
                    click={this.handleClick}
                />
            </div>
        );
    }
}

export default UniList;