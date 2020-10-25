import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";

export default class Invoices extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            companySuggestions: null,
            companies: null
        };
        this.save = this.save.bind(this);
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

    deleteInvoice(invoiceId) {
        this.axios.delete(`/invoices/${invoiceId}`)
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

        window.location.hash = `#/invoices/product_invoice?invoiceId=${e.data['id']}`;
    }

    addNew() {
        /*this.newInvoice = true;
        this.setState({
            invoice: {invoiceNumber: 0, itemName: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0},
            displayDialog: true
        });*/
        window.location.href = '#/invoices/product_invoice';
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

    customerInfo(rowData,column, componentState){
        let date = rowData['customerName'];
        return "" + date;
    }

    render() {
        let header = <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px'}}>
            <div style={{lineHeight: '30px'}}>Invoices Information</div>
            <span className="p-float-label p-fluid">
                <InputText id="search" type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Invoices" size="50"/>
                <label htmlFor="search">Search Invoices</label>
            </span>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" label="Add Invoice" icon="pi pi-plus" onClick={this.addNew}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable refs="invoiceTable" value={this.state.invoices} paginator={true} rows={20}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px" responsive={true}
                                   selectionMode="none" selection={this.state.selectedInvoice} onSelectionChange={e => this.setState({selectedInvoice: e.value})}
                                   /*onRowSelect={this.onInvoiceSelect}*/
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="id" header="S. #" sortable={true} style={{textAlign: 'left', width: '6%'}}/>
                            <Column field="createdAt" body={this.dateFormatter} header="Date" sortable={true} style={{textAlign: 'center', width: '12%'}}/>
                            <Column field="customerName" header="Customer Name" body={this.customerInfo} sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="partyName" header="Party Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            {/*<Column field="billNumber" header="Bill #" sortable={true} style={{textAlign: 'left', width: '8%'}}/>*/}
                            <Column field="invoiceAmount" header="Bill Amount" sortable={true} style={{textAlign: 'center', width: '13%'}}/>
                            <Column field="invoicePaidAmount" header="Bill Paid Amount" sortable={true} style={{textAlign: 'center', width: '15%'}}/>
                            <Column field="invoiceRemainingAmount" header="Bill Remaining Amount" sortable={true} style={{textAlign: 'center', width: '15%'}}/>
                            {/*<Column field="transport" header="Transport" sortable={true} style={{textAlign: 'center', width: '12%'}}/>*/}
                            <Column field="transportCharges" header="Transport Charges" sortable={true} style={{textAlign: 'center', width: '10%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'invoices', this.state)} style={{width: '12%'}}/>
                        </DataTable>
                    </div>
                </Navigation>
            </div>
        );
    }
}
