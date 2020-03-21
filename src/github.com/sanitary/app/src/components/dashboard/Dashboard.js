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
          remainingItemsByQuantities: [],
          excessItemsByQuantities: []
        };
    }

    componentDidMount() {
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
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Inventories - Remaining Items</div>
        </div>;

        return (
            <Navigation>
                <div className={"p-col-12"}>
                    <div className="p-grid">
                        <div className={"p-col-6"}>
                            <Card>
                                <DataTable header={header} value={this.state.remainingItemsByQuantities} rows={25}
                                           scrollable={false} scrollHeight="200px" responsive={true}
                                           selectionMode="none" emptyMessage="No record(s) found">

                                    <Column field="itemName" header="Item Name" sortable={false} style={{textAlign: 'left', width: '70%'}}/>
                                    <Column field="quantities" header="Quantities" sortable={false} style={{textAlign: 'right', width: '30%'}}/>
                                </DataTable>
                            </Card>
                        </div>

                        <div className={"p-col-6"}>
                            <Card>
                                <DataTable header={
                                    <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
                                        <div style={{float: 'left'}}>Inventories - Excessive Items</div>
                                    </div>
                                } value={this.state.excessItemsByQuantities} rows={25}
                                           scrollable={false} scrollHeight="200px"
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
