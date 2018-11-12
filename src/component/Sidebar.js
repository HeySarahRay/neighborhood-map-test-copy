import Drawer from "@material-ui/core/Drawer";
import React, { Component } from "react";
/**
 *
 * @class Sidebar
 * @extends Component
 */
class Sidebar extends Component {
    state = {
        open: true,
        query: ""
    };
    /**
     *
     * @memberof Sidebar
     */
    updateQuery = newQuery => {
        this.setState({ query: newQuery });
        this.props.filterVenues(newQuery);
    };
    /**
     *
     * @return
     * @memberof Sidebar
     */
    render() {
        return (
            <Drawer
                open={this.props.open}
                style={{ width: "20vw" }}
                onClose={() => this.props.toggleDrawer()}>
                <button className="hamburger" onClick={() => this.props.toggleDrawer()}>
                    <i className="fas fa-bars" />
                </button>
                '
        <div className="filter">
                    <div className="listHeader">Search</div>
                    <div className="filterH">
                        <input
                            className="filterPlaceholderText"
                            type="text"
                            placeholder="Filter Map"
                            name="filter"
                            onChange={e => this.updateQuery(e.target.value)}
                            value={this.state.query}
                        />
                    </div>
                    <ul>
                        {this.props.filtered &&
                            this.props.filtered.map((venue, index) => {
                                return (
                                    <li key={index}>
                                        <button
                                            venue={venue}
                                            onClick={() => this.props.clickListItem(index)}
                                            className="venueList"
                                            key={index}>
                                            {venue.name}
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </div>{" "}
            </Drawer>
        );
    }
}

export default Sidebar;
