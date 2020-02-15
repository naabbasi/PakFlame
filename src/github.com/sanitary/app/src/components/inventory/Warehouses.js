import React from 'react';
import Navigation from "../layout/Navigation";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {GenericComponent} from "../GenericComponent";
import {Dialog} from "primereact/dialog";

export default class Warehouses extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            warehouses: [],
            warehouse: {},
            selectedWarehouse: {}
        };

        this.addNewWarehouse = this.addNewWarehouse.bind(this);
        this.saveWarehouses = this.saveWarehouses.bind(this);
        this.deleteWarehouse = this.deleteWarehouse.bind(this);
        this.closeWarehouseDialog = this.closeWarehouseDialog.bind(this);
        this.onWarehouseSelect = this.onWarehouseSelect.bind(this);
    }

    async componentDidMount() {
        this.getWarehouses();
    }

    getWarehouses() {
        // Make a request for a warehouses
        this.axios.get('/warehouses')
            .then( response => {
                // handle success
                if(response.status === 200){
                    this.setState({warehouses: response.data});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    saveWarehouses() {
        if(this.newWarehouse){
            this.axios.post('/warehouses', this.state.warehouse)
                .then( response => {
                    // handle success
                    if(response.status === 201){
                        this.setState({warehouses: null, selectedWarehouse:null, warehouse: null, displayDialog:false});
                        this.getWarehouses();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else{
            this.axios.put('/warehouses',this.state.warehouse)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({warehouses: null, selectedWarehouse:null, warehouse: null, displayDialog:false});
                        this.getWarehouses();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteWarehouse() {
        this.axios.delete('/warehouses', { data: { ...this.state.selectedWarehouse}})
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 204){
                    this.setState({warehouses: null, selectedWarehouse:null, warehouse: null, displayDialog:false});
                    this.getWarehouses();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    addNewWarehouse() {
        this.newWarehouse = true;
        this.setState({
            warehouse: {name: '', location: '', mobileNumber: '', email: ''},
            displayDialog: true
        });
    }

    editWarehouse(e) {
        this.newWarehouse = false;
        this.setState({
            displayDialog:true,
            warehouse: Object.assign({}, e.data)
        });
    }

    closeWarehouseDialog() {
        this.setState({selectedWarehouse:null, warehouse: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let warehouse = this.state.warehouse;
        warehouse[property] = value;
        this.setState({warehouse: warehouse});
    }

    onWarehouseSelect(e){
        this.newWarehouse = false;
        this.setState({
            displayDialog:true,
            warehouse: Object.assign({}, e.data)
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Warehouses Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Warehouse(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Add" icon="pi pi-plus" onClick={this.addNewWarehouse}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveWarehouses}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteWarehouse}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeWarehouseDialog}/>
        </div>;

        return <div>
            <Navigation>
                <div className="content-section implementation">
                    <DataTable value={this.state.warehouses} paginator={true} rows={25}  header={header} footer={footer}
                               scrollable={true} scrollHeight="700px" responsive={true}
                               selectionMode="single" selection={this.state.selectedWarehouse} onSelectionChange={e => this.setState({selectedWWarehouse: e.value})}
                               onRowSelect={this.onWarehouseSelect}
                               globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                        <Column field="name" header="Warehouse Name" sortable={true} style={{width: '15%'}}/>
                        <Column field="location" header="Location" sortable={true} style={{width: '35%'}}/>
                        <Column field="email" header="Email" sortable={true} style={{width: '25.33%'}}/>
                        <Column field="mobileNumber" header="Mobile #" sortable={true} style={{width: '12%'}}/>
                        <Column field="status" header="Status" sortable={true} style={{textAlign: 'center', width: '11%'}}/>
                        <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'warehouses', this.state)} style={{width: '12%'}}/>
                    </DataTable>
                    <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Warehouse Details"
                            modal={true} footer={dialogFooter}
                            onShow={()=> this.refs['firstName']}
                            onHide={() => this.setState({displayDialog: false})}>
                        {
                            this.state.warehouse &&
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="name" maxLength={255} onChange={(e) => {this.updateProperty('name', e.target.value)}} value={this.state.warehouse.name}/>
                                                <label htmlFor="name">Name</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="location" maxLength={255} onChange={(e) => {this.updateProperty('location', e.target.value)}} value={this.state.warehouse.location}/>
                                                <label htmlFor="location">Location</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="mobileNumber" maxLength={11} onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.warehouse.mobileNumber}/>
                                                <label htmlFor="mobileNumber">Mobile Number</label>
                                            </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="email" maxLength={500} onChange={(e) => {this.updateProperty('email', e.target.value)}} value={this.state.warehouse.email}/>
                                                <label htmlFor="email">Email</label>
                                            </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            </Navigation>
        </div>
    }
}
