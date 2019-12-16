import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {AutoComplete} from "primereact/autocomplete";

export default class Invoices extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            companySuggestions: null,
            companies: null
        };
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.close = this.close.bind(this);
        this.onInvoiceSelect = this.onInvoiceSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        this.getInvoices();
    }

    getInvoices() {
        // Make a request for a invoices
        this.axios.get('/invoices')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({invoices: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    save() {
        if(this.newInvoice){
            delete this.state.invoice['id'];
            this.axios.post('/invoices', this.state.invoice)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    this.setState({invoices: null, selectedInvoice:null, invoice: null, displayDialog:false});
                    this.getInvoices();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
        else{
            this.axios.put('/invoices',this.state.invoice)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({invoices: null, selectedInvoice:null, invoice: null, displayDialog:false});
                    this.getInvoices();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    delete() {
        this.axios.delete('/', { data: { ...this.state.selectedInvoice}})
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 204){
                this.setState({invoices: null, selectedInvoice:null, invoice: null, displayDialog:false});
                this.getInvoices();
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    close() {
        this.setState({selectedInvoice:null, invoice: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let invoice = this.state.invoice;
        invoice[property] = value;
        this.setState({invoice: invoice});
    }

    onInvoiceSelect(e){
        this.newInvoice = false;
        this.setState({
            displayDialog:true,
            invoice: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newInvoice = true;
        this.setState({
            invoice: {invoiceNumber: 0, itemName: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0},
            displayDialog: true
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
            let results = new Array();

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

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Invoices Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Invoices" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Add" icon="pi pi-plus" onClick={this.addNew}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.save}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.delete}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.close}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable refs="invoiceTable" value={this.state.invoices} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedInvoice} onSelectionChange={e => this.setState({selectedInvoice: e.value})}
                                   onRowSelect={this.onInvoiceSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="invoiceNumber" header="S. #" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="itemName" header="Item Name" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="unit" header="Unit" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="quantities" header="Quantities" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="price" header="Price" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="amount" header="Amount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="discount" header="Discount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="totalAmount" header="Total Amount" sortable={true} style={{textAlign: 'center'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Invoice Details" modal={true} footer={dialogFooter}
                                onHide={() => this.setState({displayDialog: false})}
                                onShow={this.loadCompanies.bind(this)}>
                            {
                                this.state.invoice &&
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
                                                    <InputText id="itemName" maxLength={250} onChange={(e) => {this.updateProperty('itemName', e.target.value)}} value={this.state.invoice.itemName}/>
                                                    <label htmlFor="itemName">Item Name</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="unit" maxLength={250} onChange={(e) => {this.updateProperty('unit', e.target.value)}} value={this.state.invoice.unit}/>
                                                    <label htmlFor="unit">Unit</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="quantities" keyfilter="pint" onChange={(e) => {this.updateProperty('quantities', this.Int(e.target.value))}} value={this.state.invoice.quantities}/>
                                                    <label htmlFor="quantities">Quantities</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="price" keyfilter="pint" onChange={(e) => {this.updateProperty('price', this.Int(e.target.value))}} value={this.state.invoice.price}/>
                                                    <label htmlFor="price">Price</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="amount" keyfilter="pint" onChange={(e) => {this.updateProperty('amount', this.Int(e.target.value))}} value={this.state.invoice.amount}/>
                                                    <label htmlFor="amount">Amount</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="discount" keyfilter="pint" onChange={(e) => {this.updateProperty('discount', this.Int(e.target.value))}} value={this.state.invoice.discount}/>
                                                    <label htmlFor="discount">Discount</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="totalAmount" keyfilter="pint" onChange={(e) => {this.updateProperty('totalAmount', this.Int(e.target.value))}} value={this.state.invoice.totalAmount}/>
                                                    <label htmlFor="totalAmount">Total Amount</label>
                                                </span>
                                            </div>
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
