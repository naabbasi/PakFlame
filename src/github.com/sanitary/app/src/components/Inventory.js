import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {AutoComplete} from 'primereact/autocomplete';

import {GenericComponent} from "./GenericComponent";
import {Fieldset} from "primereact/fieldset";
import {Dropdown} from "primereact/dropdown";

export default class Inventory extends GenericComponent {
    constructor() {
        super();
        this.state = {
            companySuggestions: null,
            companies: null
        };
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onInventorySelect = this.onInventorySelect.bind(this);
        this.addNew = this.addNew.bind(this);

        /*Company*/
        this.saveCompany = this.saveCompany.bind(this);
        this.updateCompany = this.updateCompany.bind(this);
        this.addNewCompany = this.addNewCompany.bind(this);
        this.onItemStatusChange = this.onItemStatusChange.bind(this);
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

        this.setState({companies : [{id: 1, companyName: 'Audi'}, {id: 2, companyName: 'BMW'}, {id: 3, companyName: 'Toyota'}, {id: 4, companyName: 'Suzuki'}]});
    }

    save() {
        let inventories = [...this.state.inventories];
        if(this.newCustomer){
            this.axios.post('/inventories', this.state.newInventory)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        inventories.push(response.data);
                        this.setState({inventories: inventories, newInventory: null, displayItemDialog:false});
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
            inventories[this.findSelectedcustomerIndex()] = this.state.newInventory;


    }

    delete() {
        let index = this.findSelectedcustomerIndex();
        this.setState({
            inventories: this.state.inventories.filter((val,i) => i !== index),
            newInventory: null,
            displayItemDialog: false});
    }

    findSelectedcustomerIndex() {
        return this.state.inventories.indexOf(this.state.selectedCustomer);
    }

    updateProperty(property, value) {
        let inventory = this.state.newInventory;
        inventory[property] = value;
        this.setState({newInventory: inventory});
    }

    updateCompanyProperty(property, value) {
        let company = this.state.addCompany;
        company[property] = value;
        this.setState({addCompany: company});
    }

    onInventorySelect(e){
        this.newCustomer = false;
        this.setState({
            displayItemDialog:true,
            newInventory: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newCustomer = true;
        this.setState({
            newInventory: {itemName: '', quantities: 0, quantityAlert: 0, purchaseRate: 0, wholesaleRate: 0, retailRate: 0, itemStatus: ''},
            displayItemDialog: true
        });
    }

    addNewCompany() {
        this.setState({
            addCompany: {id: -1, companyName: '', mobileNumber: ''},
            displayCompanyDialog: true
        });
    }

    closeItemDialog() {
        this.setState({displayItemDialog: false});
    }

    closeCompanyDialog() {
        this.setState({displayCompanyDialog: false});
    }

    onItemStatusChange(e) {
        console.log(e.value)
        this.updateProperty('itemStatus', e.value.status);
    }

    /*Company related method*/
    loadCompanies() {
        this.axios.get('/companies')
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 200){
                    this.setState({
                        companies: response.data
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
    }

    updateCompany() {
    }

    render() {
        const itemStatusOptions = [
            {label: 'Available', status: 'Available'},
            {label: 'Out of Stock', status: 'Out of Stock'},
            {label: 'Discontinue', status: 'Discontinue'}
        ];

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

        let dialogItemFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save" icon="pi pi-check" className="p-button-rounded" onClick={this.save}/>
            <Button label="Update" icon="pi pi-times" className="p-button-rounded" onClick={this.delete}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.delete}/>
            <Button label="Close" icon="pi pi-times" className="p-button-rounded" onClick={this.closeItemDialog.bind(this)}/>
        </div>;

        let dialogCompanyFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save" icon="pi pi-save" className="p-button-rounded" onClick={this.saveCompany}/>
            <Button label="Update" icon="pi pi-cloud-upload" className="p-button-rounded" onClick={this.updateCompany}/>
            <Button label="Delete" icon="pi pi-cloud-upload" className="p-button-rounded p-button-danger" onClick={this.updateCompany}/>
            <Button label="Close" icon="pi pi-times" className="p-button-rounded" onClick={this.closeCompanyDialog.bind(this)}/>
        </div>;

        return (
            <div>
                <div className="content-section implementation">
                    <DataTable value={this.state.inventories} paginator={true} rows={10}  header={header} footer={footer}
                               scrollable={true} selectionMode="single" selection={this.state.selectedInventory}
                               onSelectionChange={e => this.setState({selectedInventory: e.value})}
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

                    <Dialog visible={this.state.displayItemDialog} style={{width: '60%'}} header="Inventory Details"
                            modal={true} footer={dialogItemFooter} closable={true} maximizable={false}
                            onHide={() => this.setState({company: null, displayItemDialog: false})}
                            onShow={this.loadCompanies.bind(this)}>
                        {
                            this.state.newInventory &&
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <div className="p-grid">
                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="companyName">Company Name</label></div>
                                        <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                            <AutoComplete id="companyName" dropdown={true}  field="companyName"
                                                          readonly={false}
                                                          maxLength={250}
                                                          value={this.state.company} onChange={(e) => this.setState({company:  e.value})}
                                                          suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="itemName">Item Name</label></div>
                                        <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                            <InputText id="itemName" maxLength={250} onChange={(e) => {this.updateProperty('itemName', e.target.value)}} value={this.state.newInventory.itemName}/>
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="quantity">Quantity</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <InputText id="quantity" onChange={(e) => {this.updateProperty('quantities', e.target.value)}} value={this.state.newInventory.quantities}/>
                                        </div>

                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="quantityAlert">Quantity Alert</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <InputText id="quantityAlert" onChange={(e) => {this.updateProperty('quantityAlert', e.target.value)}} value={this.state.newInventory.quantityAlert}/>
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="purchaseRate">Purchase Rate</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <InputText id="purchaseRate" onChange={(e) => {this.updateProperty('purchaseRate', e.target.value)}} value={this.state.newInventory.purchaseRate}/>
                                        </div>

                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="wholesaleRate">Wholesale Rate</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <InputText id="wholesaleRate" onChange={(e) => {this.updateProperty('wholesaleRate', e.target.value)}} value={this.state.newInventory.wholesaleRate}/>
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="retailRate">Retail Rate</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <InputText id="retailRate" onChange={(e) => {this.updateProperty('retailRate', e.target.value)}} value={this.state.newInventory.retailRate}/>
                                        </div>

                                        <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="itemStatus">Item Status</label></div>
                                        <div className="p-col" style={{padding:'.5em'}}>
                                            <Dropdown value={this.state.itemStatus} options={itemStatusOptions} onChange={this.onItemStatusChange} placeholder="Select a Status" optionLabel="label"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>

                    <Dialog visible={this.state.displayCompanyDialog} style={{width: '60%'}} header="Company Details"
                            modal={true} footer={dialogCompanyFooter} closable={true} maximizable={true}
                            onHide={() => this.setState({company: null, displayCompanyDialog: false})}
                            onShow={this.loadCompanies.bind(this)}>
                        {
                            this.state.addCompany &&
                            <div className="p-col-12">
                                <div className="p-grid">
                                    <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="companyName">Company Name</label></div>
                                    <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                        <AutoComplete id="companyName" dropdown={true}  field="companyName"
                                                      readonly={false}
                                                      maxLength={250}
                                                      value={this.state.company} onChange={(e) => this.setState({company:  e.value})}
                                                      suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-fixed" style={{padding:'.75em', width: '24%'}}><label htmlFor="mobileNumber">Contact Number {this.state.addCompany.companyName}</label></div>
                                    <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                        <InputText id="mobileNumber" onChange={(e) => {this.updateCompanyProperty('mobileNumber', e.target.value)}} value={this.state.addCompany.mobileNumber}/>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            </div>
        );
    }
}
