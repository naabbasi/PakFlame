import React from 'react';
import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";

export default class Dashboard extends GenericComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navigation>
                <div>
                    <a href={"#/customers"}>Customers</a>
                </div>
            </Navigation>
        );
    }
}
