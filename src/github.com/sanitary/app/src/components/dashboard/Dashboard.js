import React from 'react';
import {GenericComponent} from "../GenericComponent";

export default class Dashboard extends GenericComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a href={"/customers"}>Customers</a>
            </div>
        );
    }
}
