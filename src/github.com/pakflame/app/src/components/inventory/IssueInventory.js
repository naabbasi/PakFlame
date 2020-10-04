import React from 'react';
import axios from 'axios';

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

export default class IssueInventory extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            issueInventories: [],
            issueInventory: {}
        }

        this.newIssueInventory = this.newIssueInventory.bind(this);
        this.saveIssueInventory = this.saveIssueInventory.bind(this);
        this.closeIssueInventoryDialog = this.closeIssueInventoryDialog.bind(this);
    }

    async componentDidMount() {
        this.getIssueInventory();
    }

    getIssueInventory() {
        // Make a request for a issue_inventory
        this.axios.get('/issue_inventory')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({issueInventories: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    saveIssueInventory() {
        if(this.issueInventory){
            delete this.state.issueInventory['id'];
            this.axios.post('/issue_inventory', this.state.issueInventory)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                        this.getIssueInventory();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else{
            this.axios.put('/issue_inventory',this.state.issueInventory)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                        this.getIssueInventory();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteIssueInventory(issuedInventoryId) {
        this.axios.delete(`/issue_inventory/${issuedInventoryId}`)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 204){
                    this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                    this.getIssueInventory();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    closeIssueInventoryDialog() {
        this.setState({issueInventory: null, displayDialog:false});
    }

    newIssueInventory() {
        this.IssueInventory = true;
        this.setState({
            issueInventory: {itemId: '', itemName: '', quantities: 0, workerId: '', companyId: '', issuerId: '', warehouseId: '', clientId: ''},
            displayDialog: true
        });
    }

    updateProperty(property, value) {
        let issueInventory = this.state.issueInventory;
        issueInventory[property] = value;
        this.setState({issueInventory: issueInventory});
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Issued Inventory Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Issued Inventory" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" style={{float:'left'}} label="Issue Inventory" icon="pi pi-plus" onClick={this.newIssueInventory}/>
        </div>;

        let dialogFooter = <div className="p-grid p-align-center" style={{ paddingTop: '10px'}}>
            <div style={{textAlign: 'right', width: '100%'}}>
                <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveIssueInventory}/>
                <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeIssueInventoryDialog}/>
            </div>
        </div>;

        return (
            <>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable id="issueInventoryTable" value={this.state.issueInventories} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px" responsive={true}
                                   selectionMode="none" onSelectionChange={e => this.setState({selectedCustomer: e.value})}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="itemName" header="Item Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="quantities" header="Quantities" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="issuerName" header="Issued By" sortable={true} style={{textAlign: 'center', width: '14%'}}/>
                            <Column field="workerName" header="Received By" sortable={true} style={{textAlign: 'center', width: '10%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'issueInventory', this.state, 'Action')} style={{width: '12%'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Issued Inventory Details" modal={true} maximizable={false} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.issueInventory &&
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="itemName" maxLength={255} onChange={(e) => {this.updateProperty('itemName', e.target.value)}} value={this.state.issueInventory.firstName}/>
                                                    <label htmlFor="itemName">Item Name</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="quantities" maxLength={255} onChange={(e) => {this.updateProperty('quantities', e.target.value)}} value={this.state.issueInventory.lastName}/>
                                                    <label htmlFor="quantities">Quantities</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="issuerId" maxLength={11} onChange={(e) => {this.updateProperty('issuerId', e.target.value)}} value={this.state.issueInventory.issuerId}/>
                                                    <label htmlFor="issuerId">Issue By</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="workerId" maxLength={255} onChange={(e) => {this.updateProperty('workerId', e.target.value)}} value={this.state.issueInventory.workerId}/>
                                                    <label htmlFor="workerId">Worker Name</label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Dialog>
                    </div>
                </Navigation>
            </>
        )
    }
}
