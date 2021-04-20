import React, {Component} from "react";
import TableList from "./parts/TableList";
import {Button} from "react-bootstrap";
import GlobalValues from "../global/GlobalValues";
import NewSubject from "./admin_only/NewSubject";
import DeleteSubject from "./admin_only/DeleteSubject";

class SubjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: ""
        }
    }

    handleClick = (row) => {
        const id = row.getAttribute("itemID");
        const url = new URL(window.location);
        url.pathname = `/subjects/${id}`
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

        const admin = GlobalValues.hasAdminRole(false);

        if (this.props.search) {
            return (
                <div>
                    <TableList
                        headers={headers}
                        valuesFrom={valuesFrom}
                        isPageable={true}
                        click={this.handleClick}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    {admin &&
                    <>
                        <div className="topRowContainer">
                            <h2>{this.state.response.name}</h2>
                            <Button
                                variant="info"
                                onClick={() => document.getElementById("overlayOfNew").style.display="flex"}
                            >
                                Tantárgy hozzáadása...
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => document.getElementById("overlayOfDelete").style.display="flex"}
                            >
                                Tantárgy törlése...
                            </Button>
                        </div>

                        <NewSubject
                            universityId={this.state.response.id}
                        />

                        <DeleteSubject
                            university={this.state.response}
                        />
                    </>
                    }
                    <TableList
                        headers={headers}
                        valuesFrom={valuesFrom}
                        isPageable={true}
                        responseAttribute={responseAttribute}
                        forResponse={this}
                        click={this.handleClick}
                    />
                </div>
            );
        }
    }
}

export default SubjectList;