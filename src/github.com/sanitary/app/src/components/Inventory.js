import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {AutoComplete} from 'primereact/autocomplete';

import {GenericComponent} from "./GenericComponent";

export default class Inventory extends GenericComponent {
    constructor() {
        super();
        this.state = {
            companySuggestions: null
        };
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onInventorySelect = this.onInventorySelect.bind(this);
        this.addNew = this.addNew.bind(this);

        /*Company*/
        this.companies = [{id: 1, companyName: 'Audi'}, {id: 2, companyName: 'BMW'}, {id: 3, companyName: 'Toyota'}, {id: 4, companyName: 'Suzuki'}];
        this.saveCompany = this.saveCompany.bind(this);
        this.updateCompany = this.updateCompany.bind(this);
        this.addNewCompany = this.addNewCompany.bind(this);
    }

    async componentDidMount() {
        // Make a request for a users
        this.axios.get('/inventories')
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 200){
                this.setState({inventories: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    }

    save() {
        let inventories = [...this.state.inventories];
        if(this.newCustomer){
            this.axios.post('/inventories', this.state.inventory)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    inventories.push(response.data);
                    this.setState({inventories: inventories, selectedCustomer:null, inventory: null, displayDialog:false, company: null, displayCompanyDialog: false});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
        }
        else
            inventories[this.findSelectedcustomerIndex()] = this.state.inventory;


    }

    delete() {
        let index = this.findSelectedcustomerIndex();
        this.setState({
            inventories: this.state.inventories.filter((val,i) => i !== index),
            selectedCustomer: null,
            inventory: null,
            displayDialog: false});
    }

    findSelectedcustomerIndex() {
        return this.state.inventories.indexOf(this.state.selectedCustomer);
    }

    updateProperty(property, value) {
        let inventory = this.state.inventory;
        inventory[property] = value;
        this.setState({inventory: inventory});
    }

    onInventorySelect(e){
        this.newCustomer = false;
        this.setState({
            displayDialog:true,
            inventory: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newCustomer = true;
        this.setState({
            inventory: {itemName: '', quantities: 0, quantityAlert: 0, purchaseRate: 0, wholesaleRate: 0, retailRate: 0, itemStatus: ''},
            displayDialog: true
        });
    }

    /*Company related method*/
    addNewCompany() {
        this.axios.get('/companies')
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 200){
                this.setState({
                    companies: response.data,
                    newCompany: {companyName: '', mobileNumber: ''},
                    displayCompanyDialog: true
                });
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    suggestCompanies(event) {
        setTimeout(() => {
            let results;

            if (event.query.length === 0) {
                results = [...this.state.companies];
            } else {
                results = this.state.companies.filter((company) => {
                    return company['companyName'].toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            this.setState({ companySuggestions: results });
        }, 250);
    }

    saveCompany() {
        let company = this.state.newCompany;
        if(company['id'] == undefined){
            console.log('New company' + company);
        } else {
            console.log(company);
        }
    }

    updateCompany() {
        let company = [this.state.newCompany];
        console.log(company);
    }

    closeCompanyDialog() {
        this.setState({companies: null, company: null, displayCompanyDialog: false});
    }

    updateCompanyProperty(property, value) {
        let company = this.state.newCompany;
        company[property] = value;
        this.setState({newCompany: company});
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            Inventory Information
            <div style={{'textAlign':'left'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Item(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left', marginRight: '5px'}} label="Add Item" icon="pi pi-plus" onClick={this.addNew}/>
            <Button style={{float:'left'}} label="Add Company" icon="pi pi-plus" onClick={this.addNewCompany}/>
        </div>

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Delete" icon="pi pi-times" onClick={this.delete}/>
            <Button label="Save" icon="pi pi-check" onClick={this.save}/>
        </div>;

        let dialogCompanyFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Close" icon="pi pi-times" onClick={this.closeCompanyDialog.bind(this)}/>
            <Button label="Update" icon="pi pi-times" onClick={this.updateCompany}/>
            <Button label="Save" icon="pi pi-check" onClick={this.saveCompany}/>
        </div>;

        return (
            <div>
                <div className="content-section implementation">
                    <DataTable value={this.state.inventories} paginator={true} rows={15}  header={header} footer={footer}
                               selectionMode="single" selection={this.state.selectedInventory} onSelectionChange={e => this.setState({selectedInventory: e.value})}
                               onRowSelect={this.onInventorySelect} globalFilter={this.state.globalFilter} emptyMessage="No records found">

                        <Column field="itemName" header="Item Name" sortable={true} />
                        <Column field="quantities" header="Quantity" sortable={true} style={{textAlign: 'right'}}/>
                        <Column field="quantityAlert" header="Quantity Alert" sortable={true} style={{textAlign: 'right'}}/>
                        <Column field="createdAt" header="Purchase Date" sortable={true} />
                        <Column field="purchaseRate" header="Purchase Rate" sortable={true} style={{textAlign: 'right'}}/>
                        <Column field="wholesaleRate" header="Wholesale Rate" sortable={true} style={{textAlign: 'right'}}/>
                        <Column field="retailRate" header="Retail Rate" sortable={true} style={{textAlign: 'right'}}/>
                        <Column field="itemStatus" header="Status" sortable={true}/>
                    </DataTable>

                    <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Inventory Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                        {
                            this.state.inventory &&

                            <div className="p-grid p-fluid">
                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="companyName">Company Name</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <AutoComplete id="companyName" dropdown={true} field="companyName" value={this.state.company} onChange={(e) => this.setState({company: {companyName: e.value}})}
                                                  suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                                  <span>Id: {this.state.company? this.state.company['id'] || this.state.company : 'none'}</span>
                                                  <span>Value: {this.state.company? this.state.company['companyName'] || this.state.company : 'none'}</span>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="itemName">Item Name</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="itemName" onChange={(e) => {this.updateProperty('itemName', e.target.value)}} value={this.state.inventory.itemName}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="quantity">Quantity</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="quantity" onChange={(e) => {this.updateProperty('quantities', e.target.value)}} value={this.state.inventory.quantities}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="quantityAlert">Quantity Alert</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="quantityAlert" onChange={(e) => {this.updateProperty('quantityAlert', e.target.value)}} value={this.state.inventory.quantityAlert}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="purchaseRate">Purchase Rate</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="purchaseRate" onChange={(e) => {this.updateProperty('purchaseRate', e.target.value)}} value={this.state.inventory.purchaseRate}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="wholesaleRate">Wholesale Rate</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="wholesaleRate" onChange={(e) => {this.updateProperty('wholesaleRate', e.target.value)}} value={this.state.inventory.wholesaleRate}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="retailRate">Retail Rate</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="retailRate" onChange={(e) => {this.updateProperty('retailRate', e.target.value)}} value={this.state.inventory.retailRate}/>
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="itemStatus">Retail Rate</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="itemStatus" onChange={(e) => {this.updateProperty('itemStatus', e.target.value)}} value={this.state.inventory.itemStatus}/>
                                </div>
                            </div>
                        }
                    </Dialog>

                    <Dialog visible={this.state.displayCompanyDialog} style={{width: '50%'}} header="Company Details" modal={true} footer={dialogCompanyFooter} onHide={() => this.setState({displayCompanyDialog: false})}>
                        {
                            this.state.newCompany &&
                            <div className="p-grid p-fluid">
                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="companyName">Company Name</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <AutoComplete id="companyName" dropdown={false} field="companyName" value={this.state.newCompany.companyName} onChange={(e) => this.setState({newCompany: e.value})}
                                                  suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                </div>

                                <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="mobileNumber">Contact Number</label></div>
                                <div className="p-col-8" style={{padding:'.5em'}}>
                                    <InputText id="mobileNumber" onChange={(e) => {this.updateCompanyProperty('mobileNumber', e.target.value)}} value={this.state.newCompany.mobileNumber}/>
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            </div>
        );
    }
}
