import React, {Component} from "react";
import GlobalValues from "../../global/GlobalValues";
import {Table} from "react-bootstrap";
import Pagination from "./Pagination";

class TableList extends Component {
    constructor(props) {
        super(props);
        const { _currentPage, _perPage } = this.getSearchQueries();
        this.state = {
            response: [],
            isLoading: false,
            currentPage: _currentPage,
            perPage: _perPage
        };
    }

    getSearchQueries = () => {
        let _currentPage = new URL(window.location).searchParams.get("page");
        if (_currentPage === null) {
            _currentPage = 1;
        }
        let _perPage = new URL(window.location).searchParams.get("limit");
        if (_perPage === null || _perPage === "") {
            _perPage = 10;
        }
        return { _currentPage, _perPage}
    }

    fetcher = () => {
        this.setState({
            isLoading: true
        });

        const url = new URL(GlobalValues.serverURL + window.location.pathname);
        url.searchParams.set("page", this.state.currentPage);
        url.searchParams.set("limit", this.state.perPage);
        const search = new URL(window.location).searchParams.get("nameLike");
        if (search != null) {
            url.searchParams.set("nameLike", search);
        }

        fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem(GlobalValues.tokenStorageName)
            }
        })
            .then(response => {
                if (response.status === 401) {
                    alert("Nem vagy bejelentkezve!\nJelentkezz be vagy regisztrálj a továbblépéshez!");
                    throw Error("Unauthorized");
                } else if (!response.ok) {
                    throw Error("Something went wrong");
                }
                return response.json();
            })
            .then(response => {
                const { _currentPage, _perPage } = this.getSearchQueries();
                let _response = response;
                if (this.props.hasOwnProperty("responseAttribute") && this.props.responseAttribute !== "") {
                    _response = response[this.props.responseAttribute];
                }
                if (this.props.hasOwnProperty("forResponse")) {
                    this.props.forResponse.setState({ response: response})
                }
                this.setState({
                    response: _response,
                    currentPage: _currentPage,
                    perPage: _perPage,
                    isLoading: false
                });
            })
            .catch(error => {
                console.log(error);
                const url = new URL(window.location);
                url.pathname = "/";
                window.location = url.href;
            });
    }

    componentDidMount() {
        this.fetcher();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage !== this.state.currentPage || prevState.perPage !== this.state.perPage) {
            const url = new URL(window.location);
            url.searchParams.set("page", this.state.currentPage);
            url.searchParams.set("limit", this.state.perPage);
            window.location = url.href;
        }
    }

    render() {
        const clickFunction = this.props.click;
        let items = this.state.response.map(item =>
            <tr
                itemID={item.id}
                onClick={function(event) {clickFunction(event.currentTarget)}}
            >
                {this.props.valuesFrom.map(value => {
                    if (!Array.isArray(item[value])) {
                        if (item[value].hasOwnProperty("name")) {
                            return (<td style={{fontWeight: "bold"}}>{item[value].name}</td>);
                        }
                        return (<td>{item[value]}</td>);
                    } else {
                        const items = item[value].map(listItem => <li>{listItem}</li>)
                        return (
                            <td>
                                <ul>
                                    {items}
                                </ul>
                            </td>
                        );
                    }
                })}
            </tr>
        );
        return (
            <div>
                {this.state.isLoading ?
                    <h3>Loading...</h3>
                    :
                    <div className={"tableList"}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                {this.props.headers.map(header =>
                                    <td>{header}</td>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {items}
                            </tbody>
                        </Table>
                    </div>
                }
                {this.props.isPageable && <Pagination setFor={this} />}
            </div>
        );
    }
}

export default TableList;