import React from 'react';
import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Card} from "primereact/card";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";

export default class Dashboard extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
          quantityAlert: [],
          remainingItemsByQuantities: [],
          excessItemsByQuantities: [],
          totalWarehouse: 0,
          totalCompanies: 0,
          totalInventories: 0,
          totalCustomers: 0,
          totalWorkers: 0
        };
    }

    componentDidMount() {
        // Make a request to fetch top ten quantities
        this.axios.get('/dashboard/quantityAlert')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({quantityAlert: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch top ten quantities
        this.axios.get('/dashboard/items/quantities/asc')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({remainingItemsByQuantities: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch top ten quantities
        this.axios.get('/dashboard/items/quantities/desc')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({excessItemsByQuantities: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch total warehouses
        this.axios.get('/dashboard/entity/warehouses')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({totalWarehouse: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch total warehouses
        this.axios.get('/dashboard/entity/warehouses')
            .then( response => {
                // handle success
                if(response.status === 200){
                    console.log(response.data);
                    this.setState({totalWarehouse: response.data});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });

        // Make a request to fetch total companies
        this.axios.get('/dashboard/entity/companies')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({totalCompanies: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch total customers
        this.axios.get('/dashboard/entity/customers')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({totalCustomers: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        // Make a request to fetch total workers
        this.axios.get('/dashboard/entity/workers')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({totalWorkers: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    render() {
        return (
            <Navigation>
                <div className={"p-col-12"}>
                    <div className="p-grid">
                        <div className={"p-col-3"}>
                            <Card>
                                <a href={"#/warehouses"}>
                                    <h4>Warehouses: {this.state.totalWarehouse}</h4>
                                </a>
                            </Card>
                        </div>

                        <div className={"p-col-3"}>
                            <Card>
                                <a href={"#/companies"}>
                                    <h4>Companies: {this.state.totalCompanies}</h4>
                                </a>
                            </Card>
                        </div>

                        <div className={"p-col-3"}>
                            <Card>
                                <a href={"#/customers"}>
                                    <h4>Customers: {this.state.totalCustomers}</h4>
                                </a>
                            </Card>
                        </div>

                        <div className={"p-col-3"}>
                            <Card>
                                <a href={"#/workers"}>
                                    <h4>Workers: {this.state.totalWorkers}</h4>
                                </a>
                            </Card>
                        </div>

                        <div className={"p-col-4"}>
                            <Card>
                                <DataTable header={
                                    <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
                                        <div style={{float: 'left'}}>Inventory - Quantity Alter</div>
                                    </div>
                                } value={this.state.quantityAlert} rows={25}
                                           scrollable={true} scrollHeight="265px" responsive={true}
                                           selectionMode="none" emptyMessage="No record(s) found">

                                    <Column field="itemName" header="Item Name" sortable={false} style={{textAlign: 'left', width: '70%'}}/>
                                    <Column field="quantities" header="Quantities" sortable={false} style={{textAlign: 'right', width: '30%'}}/>
                                </DataTable>
                            </Card>
                        </div>

                        <div className={"p-col-4"}>
                            <Card>
                                <DataTable header={
                                    <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
                                        <div style={{float: 'left'}}>Inventory - Remaining Items</div>
                                    </div>
                                } value={this.state.remainingItemsByQuantities} rows={25}
                                           scrollable={true} scrollHeight="265px" responsive={true}
                                           selectionMode="none" emptyMessage="No record(s) found">

                                    <Column field="itemName" header="Item Name" sortable={false} style={{textAlign: 'left', width: '70%'}}/>
                                    <Column field="quantities" header="Quantities" sortable={false} style={{textAlign: 'right', width: '30%'}}/>
                                </DataTable>
                            </Card>
                        </div>

                        <div className={"p-col-4"}>
                            <Card>
                                <DataTable header={
                                    <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
                                        <div style={{float: 'left'}}>Inventory - Excessive Items</div>
                                    </div>
                                } value={this.state.excessItemsByQuantities} rows={25}
                                           scrollable={true} scrollHeight="265px" responsive={true}
                                           selectionMode="none" emptyMessage="No record(s) found">
                                    <Column field="itemName" header="Item Name" sortable={false} style={{textAlign: 'left', width: '70%'}}/>
                                    <Column field="quantities" header="Quantities" sortable={false} style={{textAlign: 'right', width: '30%'}}/>
                                </DataTable>
                            </Card>
                        </div>
                    </div>
                </div>
            </Navigation>
        );
    }
}
