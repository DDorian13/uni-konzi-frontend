import React, {Component} from "react";
import TableList from "./parts/TableList";
import {Button} from "react-bootstrap";
import GlobalValues from "../global/GlobalValues";
import NewUniversity from "./admin_only/NewUniversity";
import DeleteUniversity from "./admin_only/DeleteUniversity";

class UniList extends Component {
    constructor() {
        super();
        this.state = {
            response: "",
            selectedUniversityId: "-1"
        }
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

        const admin = GlobalValues.hasAdminRole(false);

        return (
            <div>
                {admin &&
                    <>
                        <div className="topRowContainer">
                            <Button
                                variant="info"
                                onClick ={() => document.getElementById("overlayOfNew").style.display="flex"}
                            >
                                Egyetem felvétele...
                            </Button>

                            <Button
                                variant="danger"
                                onClick={() => document.getElementById("overlayOfDelete").style.display="flex"}
                            >
                                Egyetem törlése...
                            </Button>
                        </div>

                        <NewUniversity />

                        <DeleteUniversity
                            universities={this.state.response}
                        />
                    </>
                }
                <TableList
                    headers={headers}
                    valuesFrom={valuesFrom}
                    responseAttribute=""
                    forResponse={this}
                    isPageable={true}
                    click={this.handleClick}
                />
            </div>
        );
    }
}

export default UniList;