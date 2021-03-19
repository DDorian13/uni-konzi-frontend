import React, {Component} from "react";
import Button from "react-bootstrap/Button"

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleClick = (plus) => {
        if (plus) {
            this.props.setFor.setState(prevState => {
                return {
                    currentPage: (Number)(prevState.currentPage) + 1
                }
            })
        } else {
            if (this.props.setFor.state.currentPage > 1) {
                this.props.setFor.setState(prevState => {
                    return {
                        currentPage: prevState.currentPage - 1
                    }
                })
            }
        }
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        this.props.setFor.setState({
            [name]: value,
            currentPage: 1
        });
    }

    render() {
        return (
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
                            value={this.props.setFor.state.perPage}
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
        );
    }
}

export default Pagination;