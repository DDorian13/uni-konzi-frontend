import React, {Component} from "react";
import GlobalValues from "../global/GlobalValues";
import Header from "./parts/Header";
import {Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";

class TableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            universities: [],
            isLoading: false,
            currentPage: 1,
            perPage: 10
        };
    }

    fetcher = async () => {
        this.setState({
            isLoading: true
        });

        await fetch(GlobalValues.serverURL +
            `/${this.props.fromUrl}?page=${this.state.currentPage}&limit=${this.state.perPage}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        })
            .then(response => {
                if (!response.ok)
                    throw Error("Went wrong");
                return response.json();
            })
            .then(response => {
                this.setState({
                    universities: response,
                    isLoading: false
                });

            })
            .catch(error => {
                console.log(error);
                window.location.href = "/";
            });
    }

    componentDidMount() {
        this.fetcher();
    }

    handleClick = (plus) => {
        if (plus) {
            this.setState(prevState => {
                return {
                    currentPage: prevState.currentPage + 1
                }
            })
        } else {
            if (this.state.currentPage > 1) {
                this.setState(prevState => {
                    return {
                        currentPage: prevState.currentPage - 1
                    }
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage !== this.state.currentPage || prevState.perPage !== this.state.perPage)
            this.fetcher();
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }


    render() {
        const clickFunction = this.props.click;
        let universities = "";
        universities = this.state.universities.map(university =>
            <tr
                accessKey={university.id}
                onClick={function(event) {clickFunction(event.currentTarget)}}
            >
                {this.props.valuesFrom.map(value =>
                    <td>{university[value]}</td>
                )}
            </tr>
        );
        return (
            <div>
                <Header/>
                {this.state.isLoading ? <h3>Loading...</h3> :
                    <div className={"tableList"}>
                        <Table striped bordered hover
                               style={{background: "rgba(255, 255, 255, 0.7)"}}
                        >
                            <thead>
                            <tr style={{fontWeight: "bold"}}>
                                {this.props.headers.map(header =>
                                    <td>{header}</td>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                                {universities}
                            </tbody>
                        </Table>
                    </div>
                }
                <div className="paginationMain">
                    <Button
                        variant="none"
                        onClick={() => this.handleClick(false)}
                    >
                        &lt; Előző oldal
                    </Button>
                    <span>
                        Oldalanként:
                        <select
                            className="selectPerPage"
                            onChange={this.handleChange}
                            name="perPage"
                            value={this.state.perPage}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </span>
                    <Button
                        variant="none"
                        onClick={() => this.handleClick(true)}
                    >
                        Következő oldal &gt;
                    </Button>
                </div>
            </div>
        );
    }
}

export default TableList;