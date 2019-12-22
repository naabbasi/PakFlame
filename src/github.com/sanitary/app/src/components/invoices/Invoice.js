import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {AutoComplete} from "primereact/autocomplete";
import {Calendar} from "primereact/calendar";
import {Accordion, AccordionTab} from "primereact/accordion";

export default class Invoice extends GenericComponent {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(props.location.search);
        console.log(params.get('invoiceId'));

        this.state = {
            invoice: null,
            invoiceDetails: [],
            items: [],
            invoiceId: params.get('invoiceId') == null ? 0 : params.get('invoiceId')
        };

        this.saveInvoice = this.saveInvoice.bind(this);
        this.delete = this.delete.bind(this);
        this.close = this.close.bind(this);
        this.onInvoiceSelect = this.onInvoiceSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        if(this.state.invoiceId != 0) {
            this.newInvoice = false;
            this.getInvoiceById(this.state.invoiceId);
        } else {
            this.newInvoice = true;
            this.resetOrLoadForm(null);
        }
    }

    resetOrLoadForm(data) {
        if(data) {
            this.getInvoiceDetailsById(data['id']);
            this.setState({
                invoice: {
                    invoiceNumber: data['id'], customerName: data['customerName'], createAt: new Date(data['createdAt']), partyName: data['partyName'], transport: data['transport'], transportCharges: data['transportCharges'],
                    details: {invoiceNumber: 0, itemName: 'My Item', createAt: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0},
                },
            });
        } else {
            this.setState({
                invoice: {
                    invoiceNumber: 0, customerName: 'Noman Ali', createAt: '', partyName: 'Abbasi.co', transport: 'mazda', transportCharges: 0,
                    details: {invoiceNumber: 0, itemName: 'My Item', createAt: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0},
                },
            });
        }
    }

    getInvoiceById(id) {
        // Make a request for a invoices
        this.axios.get('/invoices/' + id)
        .then( response => {
            // handle success
            if(response.status === 200){
                this.resetOrLoadForm(response.data);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    getInvoiceDetailsById(id) {
        this.axios.get('/invoices/details/' + id)
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({items: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    saveInvoice() {
        if(this.newInvoice){
            delete this.state.invoice['id'];
            delete this.state.invoice['invoiceNumber'];
            //delete this.state.invoice['details'];

            let itemDetails = this.state.items;
            this.state.invoiceDetails = itemDetails;
            let details = {...this.state.invoiceDetails};
            this.state.invoice.invoiceDetails = new Array();

            for(let row = 0; row < itemDetails.length; row++) {
                this.state.invoice.invoiceDetails.push(itemDetails[row]);
            }

            // this.setState({details});
            this.axios.post('/invoices/details', this.state.invoice)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    this.setState({item: []});
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

    updateProperty(property, value, child) {
        if (child === undefined) {
            let invoice = this.state.invoice;
            invoice[property] = value;
            this.setState({invoice: invoice});
        } else {
            let invoice = {...this.state.invoice};
            invoice.details[property] = value;
            this.setState({invoice});
        }

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
        let details = {...this.state.invoice.details};
        let addItemDetails = this.state.items;
        addItemDetails.push(details)
        this.setState({items: addItemDetails});
        console.log(this.state.items)
    }

    render() {
        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        {
                            this.state.invoice &&
                            <div>
                                <Accordion multiple={false}>
                                    <AccordionTab header={this.state.invoiceId == 0 ? "Sale Invoice" : "Sale Invoice # " + this.state.invoiceId}>
                                        <div className="p-datatable-header">
                                            <div className="p-col-12 p-component">
                                                <div className="p-col-12">
                                                    <div className="p-grid">
                                                        <div className="p-col" style={{padding:'.75em'}}>
                                                            <span className="p-float-label p-fluid">
                                                                <InputText id="customerName" maxLength={250} onChange={(e) => {this.updateProperty('customerName', e.target.value)}} value={this.state.invoice.customerName}/>
                                                                <label htmlFor="customerName">Customer Name</label>
                                                            </span>
                                                        </div>

                                                        <div className="p-col" style={{padding:'.75em'}}>
                                                            <span className="p-float-label p-fluid">
                                                                <Calendar id="createAt" hideOnDateTimeSelect={true} showTime={true} onChange={(e) => {this.updateProperty('createAt', e.target.value)}} value={this.state.invoice.createAt}/>
                                                                <label htmlFor="createAt">Date</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-col-12">
                                                    <div className="p-grid">
                                                        <div className="p-col" style={{padding:'.75em'}}>
                                                            <span className="p-float-label p-fluid">
                                                                <InputText id="partyName" maxLength={250} onChange={(e) => {this.updateProperty('partyName', e.target.value)}} value={this.state.invoice.partyName}/>
                                                                <label htmlFor="partyName">Party Name</label>
                                                            </span>
                                                        </div>

                                                        <div className="p-col-3" style={{padding:'.75em'}}>
                                                            <span className="p-float-label p-fluid">
                                                                <InputText id="transport" onChange={(e) => {this.updateProperty('transport', e.target.value)}} value={this.state.invoice.transport}/>
                                                                <label htmlFor="transport">Transport</label>
                                                            </span>
                                                        </div>

                                                        <div className="p-col-3" style={{padding:'.75em'}}>
                                                            <span className="p-float-label p-fluid">
                                                                <InputText id="transportCharges"
                                                                           onChange={(e) => {this.updateProperty('transportCharges', e.target.value)}}
                                                                           onBlur={(e) => {this.updateProperty('transportCharges', this.Float(e.target.value))}} value={this.state.invoice.transportCharges}/>
                                                                <label htmlFor="transportCharges">Transport Charges</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTab>
                                    <AccordionTab header="Invoice Details">
                                        <div className="p-col-12 p-component">
                                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                                <div className="p-col" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="itemName" maxLength={250} onChange={(e) => {this.updateProperty('itemName', e.target.value, true)}} value={this.state.invoice.details.itemName}/>
                                                        <label htmlFor="itemName">Item Name</label>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="unit" maxLength={250} onChange={(e) => {this.updateProperty('unit', e.target.value, true)}} value={this.state.invoice.details.unit}/>
                                                        <label htmlFor="unit">Unit</label>
                                                    </span>
                                                </div>

                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="quantities" keyfilter="pint" onChange={(e) => {this.updateProperty('quantities', this.Int(e.target.value), true)}} value={this.state.invoice.details.quantities}/>
                                                        <label htmlFor="quantities">Quantities</label>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="price" keyfilter="pint" onChange={(e) => {this.updateProperty('price', this.Int(e.target.value), true)}} value={this.state.invoice.details.price}/>
                                                        <label htmlFor="price">Price</label>
                                                    </span>
                                                </div>

                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="amount" keyfilter="pint" onChange={(e) => {this.updateProperty('amount', this.Int(e.target.value), true)}} value={this.state.invoice.details.amount}/>
                                                        <label htmlFor="amount">Amount</label>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="discount" keyfilter="pint" onChange={(e) => {this.updateProperty('discount', this.Int(e.target.value), true)}} value={this.state.invoice.details.discount}/>
                                                        <label htmlFor="discount">Discount</label>
                                                    </span>
                                                </div>

                                                <div className="p-col-6" style={{padding:'.75em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="totalAmount" keyfilter="pint" onChange={(e) => {this.updateProperty('totalAmount', this.Int(e.target.value), true)}} value={this.state.invoice.details.totalAmount}/>
                                                        <label htmlFor="totalAmount">Total Amount</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.75em'}}>
                                                <Button label="Add" icon="pi pi-plus" className="p-button-rounded" onClick={this.addNew}/>
                                                <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveInvoice}/>
                                                <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.delete}/>
                                            </div>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                                <div className="p-col-12">
                                    <div className="p-grid">
                                        <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                            <DataTable value={this.state.items} paginator={true} rows={25}
                                                       scrollable={true} scrollHeight="200px"
                                                       selectionMode="single" selection={this.state.selectedInventory}
                                                       onSelectionChange={e => this.setState({selectedInventory: e.value})}
                                                       onRowSelect={this.onInventorySelect} emptyMessage="No record(s) found">

                                                <Column field="itemName" header="Item Name" sortable={true} />
                                                <Column field="unit" header="Unit" sortable={true} style={{textAlign: 'right'}}/>
                                                <Column field="quantities" header="Quantities" sortable={true} style={{textAlign: 'right'}}/>
                                                <Column field="price" header="Price" sortable={true} style={{textAlign: 'right'}}/>
                                                <Column field="amount" header="Amount" sortable={true} style={{textAlign: 'right'}}/>
                                                <Column field="discount" header="Discount" sortable={true} style={{textAlign: 'right'}}/>
                                                <Column field="totalAmount" header="Total Amount" sortable={true}/>
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Navigation>
            </div>
        );
    }
}
