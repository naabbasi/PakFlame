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
            invoice: Object.assign({}, e.data)
        });

        window.location.hash = `#/invoices/invoice?invoiceId=${e.data['id']}`;
    }

    addNew() {
        /*this.newInvoice = true;
        this.setState({
            invoice: {invoiceNumber: 0, itemName: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0},
            displayDialog: true
        });*/
        window.location.href = '#/invoices/invoice';
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

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable refs="invoiceTable" value={this.state.invoices} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedInvoice} onSelectionChange={e => this.setState({selectedInvoice: e.value})}
                                   onRowSelect={this.onInvoiceSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="id" header="S. #" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="customerName" header="Customer Name" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="partyName" header="Party Name" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="transport" header="Transport" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="transportCharges" header="Transport Charges" sortable={true} style={{textAlign: 'center'}}/>
                        </DataTable>
                    </div>
                </Navigation>
            </div>
        );
    }
}
