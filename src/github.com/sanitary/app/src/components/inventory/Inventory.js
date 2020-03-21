import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {AutoComplete} from 'primereact/autocomplete';

import {GenericComponent} from "../GenericComponent";
import {Dropdown} from "primereact/dropdown";
import Navigation from "../layout/Navigation";

export default class Inventory extends GenericComponent {
    constructor() {
        super();
        this.state = {
            companySuggestions: null,
            companies: null
        };

        this.saveInventory = this.saveInventory.bind(this);
        this.deleteInventory = this.deleteInventory.bind(this);
        this.onInventorySelect = this.onInventorySelect.bind(this);
        this.addNew = this.addNew.bind(this);

        /*Company*/
        this.saveCompany = this.saveCompany.bind(this);
        this.deleteCompany = this.deleteCompany.bind(this);
        this.addNewCompany = this.addNewCompany.bind(this);
        this.onItemStatusChange = this.onItemStatusChange.bind(this);
    }

    async componentDidMount() {
        this.getInventories();
    }

    getInventories() {
        // Make a request for a inventories
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
            });
    }

    saveInventory() {
        this.state.newInventory['companyId'] = this.state.company['id'];
        if(this.newItem){
            this.axios.post('/inventories', this.state.newInventory)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    this.setState({inventories: null, newInventory: null, displayItemDialog:false});
                    this.getInventories();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        } else {
            this.axios.put('/inventories',this.state.newInventory)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({inventories: null, selectedInventory: null, newInventory: null, displayItemDialog:false});
                    this.getInventories();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    deleteInventory() {
        this.axios.delete('/inventories', { data: { ...this.state.selectedInventory}})
        .then( response => {
            // handle success
            if(response.status === 204){
                this.setState({inventories: null, selectedInventory: null, newInventory: null, displayItemDialog:false});
                this.getInventories();
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    updateProperty(property, value) {
        let inventory = this.state.newInventory;
        console.log(typeof value);
        console.log(value);
        inventory[property] = value;
        this.setState({newInventory: inventory});
    }

    updateCompanyProperty(property, value) {
        let company = this.state.addCompany;
        company[property] = value;
        this.setState({addCompany: company});
    }

    onInventorySelect(e){
        this.newItem = false;
        console.log(e.data)
        this.setState({
            displayItemDialog:true,
            newInventory: Object.assign({}, e.data),
            itemStatus: {label: e.data['itemStatus'], status: e.data['itemStatus']}
        });

        this.getCompanyById(e.data['companyId']);
    }

    addNew() {
        this.newItem = true;
        this.setState({
            newInventory: {itemName: '', quantities: 0, quantityAlert: 0, purchaseRate: 0, wholesaleRate: 0, retailRate: 0, itemStatus: ''},
            itemStatus: null,
            displayItemDialog: true
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
        this.setState({itemStatus: e.value});
        this.updateProperty('itemStatus', e.value.status);
    }

    /*Company related method*/
    addNewCompany() {
        this.setState({
            addCompany: {id: '', companyName: '', mobileNumber: ''},
            displayCompanyDialog: true
        });
    }

    loadCompanies() {
        this.state.companies = [];
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
            let results = [];

            if (event.query.length === 0) {
                if(this.state.companies.length !== undefined)
                    results = [...this.state.companies];
            } else {
                if(this.state.companies.length !== undefined) {
                    results = this.state.companies.filter((company) => {
                        return company['companyName'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }

            if(results.length === 0 && event.query.length !== 0){
                this.updateCompanyProperty('companyName', event.query);
            } else {
                this.setState({ companySuggestions: results });
            }

        }, 250);
    }

    saveCompany() {
        //Deleting id b/c sending an empty id cause invalid length error
        delete this.state.addCompany['id'];
        this.axios.post('/companies', this.state.addCompany)
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 201){
                this.setState({companies : response.data, displayCompanyDialog: false});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    deleteCompany() {
        this.axios.delete('/companies', { data: { ...this.state.company}})
        .then( response => {
            // handle success
            if(response.status === 204){
                this.setState({displayCompanyDialog: false});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    getCompanyById(companyId) {
        this.axios.get('/companies/' + companyId)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 200){
                    this.setState({
                        company: {companyId: response.data['id'], companyName: response.data['companyName']}
                    });
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    render() {
        const itemStatusOptions = [
            {label: 'Available', status: 'Available'},
            {label: 'Out of Stock', status: 'Out of Stock'},
            {label: 'Discontinue', status: 'Discontinue'}
        ];

        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Inventory Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Item(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" style={{float:'left', marginRight: '5px'}} label="Add Item" icon="pi pi-plus" onClick={this.addNew}/>
            <Button className="p-button-rounded" style={{float:'left'}} label="Add Company" icon="pi pi-plus" onClick={this.addNewCompany}/>
        </div>

        let dialogItemFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveInventory}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteInventory}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeItemDialog.bind(this)}/>
        </div>;

        let dialogCompanyFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveCompany}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteCompany}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeCompanyDialog.bind(this)}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable value={this.state.inventories} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px" responsive={true}
                                   selectionMode="none" selection={this.state.selectedInventory}
                                   onSelectionChange={e => this.setState({selectedInventory: e.value})}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">

                            <Column field="itemName" header="Item Name" sortable={true} />
                            <Column field="quantities" header="Quantity" sortable={true} style={{textAlign: 'right'}}/>
                            <Column field="quantityAlert" header="Quantity Alert" sortable={true} style={{textAlign: 'right'}}/>
                            <Column field="createdAt" header="Purchase Date" body={this.dateFormatter}  sortable={true} style={{textAlign: 'center', overflowWrap: 'break-word'}}/>
                            <Column field="purchaseRate" header="Purchase Rate" sortable={true} style={{textAlign: 'right'}}/>
                            <Column field="wholesaleRate" header="Wholesale Rate" sortable={true} style={{textAlign: 'right'}}/>
                            <Column field="retailRate" header="Retail Rate" sortable={true} style={{textAlign: 'right'}}/>
                            <Column field="itemStatus" header="Status" sortable={true}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'inventory', this.state)} style={{width: '12%'}}/>
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
                                            <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                                <AutoComplete id="companyName" dropdown={true}  field="companyName"
                                                              placeholder="Please Select Company Name"
                                                              readonly={false}
                                                              maxLength={250}
                                                              value={this.state.company} onChange={(e) => this.setState({company:  e.value})}
                                                              suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                <InputText id="itemName" maxLength={250} onChange={(e) => {this.updateProperty('itemName', e.target.value)}} value={this.state.newInventory.itemName}/>
                                                <label htmlFor="itemName">Item Name</label>
                                            </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="quantity" keyfilter="pint" onChange={(e) => {this.updateProperty('quantities', this.Int(e.target.value))}} value={this.state.newInventory.quantities}/>
                                                <label htmlFor="quantity">Quantity</label>
                                            </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="quantityAlert" keyfilter="pint" onChange={(e) => {this.updateProperty('quantityAlert', this.Int(e.target.value))}} value={this.state.newInventory.quantityAlert}/>
                                                <label htmlFor="quantityAlert">Quantity Alert</label>
                                            </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="purchaseRate" keyfilter="num"
                                                               onChange={(e) => {this.updateProperty('purchaseRate', e.target.value)}}
                                                               onBlur={(e) => {this.updateProperty('purchaseRate', this.Float(e.target.value))}}
                                                               value={this.state.newInventory.purchaseRate}/>
                                                    <label htmlFor="purchaseRate">Purchase Rate</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="wholesaleRate" keyfilter="num"
                                                               onChange={(e) => {this.updateProperty('wholesaleRate', e.target.value)}}
                                                               onBlur={(e) => {this.updateProperty('wholesaleRate', this.Float(e.target.value))}}
                                                               value={this.state.newInventory.wholesaleRate}/>
                                                    <label htmlFor="wholesaleRate">Wholesale Rate</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="retailRate" keyfilter="num"
                                                               onChange={(e) => {this.updateProperty('retailRate', e.target.value)}}
                                                               onBlur={(e) => {this.updateProperty('retailRate', this.Float(e.target.value))}}
                                                               value={this.state.newInventory.retailRate}/>
                                                    <label htmlFor="retailRate">Retail Rate</label>
                                                </span>
                                            </div>
                                            <div className="p-col-6 p-fluid" style={{padding:'.75em'}}>
                                                <Dropdown value={this.state.itemStatus} options={itemStatusOptions} onChange={this.onItemStatusChange} placeholder="Select Item Status" optionLabel="label"/>
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
                                        <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                            <AutoComplete id="companyName" dropdown={true}  field="companyName"
                                                          placeholder="Please Select Company Name"
                                                          readonly={false}
                                                          maxLength={250}
                                                          value={this.state.company} onChange={(e) => this.setState({company:  e.value})}
                                                          suggestions={this.state.companySuggestions} completeMethod={this.suggestCompanies.bind(this)} />
                                        </div>
                                    </div>

                                    <div className="p-grid" style={{ paddingTop: '10px'}}>
                                        <div className="p-col" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                <InputText id="mobileNumber" onChange={(e) => {this.updateCompanyProperty('mobileNumber', e.target.value)}} value={this.state.addCompany.mobileNumber}/>
                                                <label htmlFor="mobileNumber">Contact Information</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Dialog>
                    </div>
                </Navigation>
            </div>
        );
    }
}
