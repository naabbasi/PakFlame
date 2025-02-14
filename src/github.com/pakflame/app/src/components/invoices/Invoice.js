import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Calendar} from "primereact/calendar";
import ItemAutoComplete from "../autocomplete/ItemAutoComplete";
import CustomerAutoComplete from "../autocomplete/CustomerAutoComplete";
import {Fieldset} from "primereact/fieldset";

export default class Invoice extends GenericComponent {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(props.location.search);
        console.log(params.get('invoiceId'));

        this.state = {
            invoice: null,
            invoiceDetails: [],
            items: [],
            invoiceId: params.get('invoiceId') == null ? 0 : params.get('invoiceId'),
            disableButtons: true,
            disableSaveButton: false,
            disableAddItemButton: true
        };

        this.newInvoice = false;
        this.newInvoiceItem = false;

        //Create refs
        this.getItemAutoComplete = React.createRef();
        this.getCustomerAutoComplete = React.createRef();

        this.saveInvoice = this.saveInvoice.bind(this);
        this.onInvoiceSelect = this.onInvoiceSelect.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.print = this.print.bind(this);
        this.getSelectedItem = this.getSelectedItem.bind(this);
        this.getSelectedCustomer = this.getSelectedCustomer.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
    }

    async componentDidMount() {
        if(this.state.invoiceId !== 0) {
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
                disableButtons: false,
                disableSaveButton: false,
                invoice: {
                    id: data['id'], customerId: data['customerId'], customerName: data['customerName'], createdAt: new Date(data['createdAt']),
                    partyName: data['partyName'], transport: data['transport'], transportCharges: data['transportCharges'], address: data['address'], readonly: data['readonly'],
                    details: {id: 0, itemName: '', createdAt: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0, customerId: ''},
                },
            });

            this.getCustomerAutoComplete.current.selectCustomer({id: data['customerId'], firstName: data['customerName']})
        } else {
            this.setState({
                disableButtons: false,
                invoice: {
                    id: 0, customerId: '', customerName: '', createdAt: new Date(), partyName: '', transport: '', transportCharges: 0, address: '', readonly: false,
                    details: {id: 0, itemName: '', createdAt: '', unit: '', quantities: 0, price: 0, amount: 0, discount: 0, totalAmount: 0, customerId: ''},
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
        this.axios.get('/invoices/items/' + id)
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

            this.axios.post('/invoices', this.state.invoice)
            .then( response => {
                // handle success
                if(response.status === 201){
                    this.setState({invoiceId: response.data['result']['id'],item: {}, disableSaveButton: true, disableAddItemButton: false});
                    this.newInvoice = false;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        } else{
            this.axios.put('/invoices',this.state.invoice)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({item: {}});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    deleteInvoice1() {
        this.axios.delete('/invoices', { data: { ...this.state.selectedInvoice}})
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 204){
                    this.setState({invoices: null, selectedInvoice:null, invoice: null, displayDialog:false});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    saveInvoiceItem(invoiceItem) {
        if(this.newInvoiceItem){
            delete invoiceItem['id'];
            this.axios.post('/invoices/items', invoiceItem)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        this.setState({item: {}, disableAddItemButton: true});
                        this.newInvoiceItem = false;
                        this.getItemAutoComplete.current.loadAllItems();
                        this.getInvoiceDetailsById(this.state.invoiceId);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        } else{
            console.log(this.state.invoice);

            let itemDetails = this.state.items;
            this.state.invoiceDetails = itemDetails;
            this.state.invoice.invoiceDetails = [];

            for(let row = 0; row < itemDetails.length; row++) {
                this.state.invoice.invoiceDetails.push(itemDetails[row]);
            }

            this.axios.put('/invoices/items',this.state.invoice)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({invoices: null, selectedInvoice:null, invoice: null, displayDialog:false});
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteInvoiceItem(itemId) {
        this.axios.delete(`/invoices/items/${itemId}`)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 204){
                    this.getInvoiceDetailsById(this.state.invoiceId);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
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

    calculateAmount() {
        let invoice = {...this.state.invoice};
        let quantities = invoice.details['quantities'];
        let price = invoice.details['price'];
        let amountBeforeDiscount = this.Float(quantities * price);
        let discount = invoice.details['discount'];

        if(discount === 0){
            invoice.details['amount'] = amountBeforeDiscount;
            invoice.details['totalAmount'] = amountBeforeDiscount;
        } else {
            let discountAmount = (discount / 100) * amountBeforeDiscount;
            console.log("Discounted amount: " + discountAmount)
            invoice.details['amount'] = amountBeforeDiscount;
            invoice.details['totalAmount'] = this.Float(amountBeforeDiscount - discountAmount);
        }

        this.setState({invoice});
    }

    onInvoiceSelect(e){
        this.newInvoice = false;
        this.setState({
            invoice: Object.assign({}, e.data)
        });
    }

    addNewItem() {
        this.newInvoiceItem = true;
        let details = {...this.state.invoice.details};
        console.log("Adding new item in invoice");
        console.log(details);
        console.log(this.state.invoiceId);
        details['invoiceNumber'] = this.Int(this.state.invoiceId);
        delete details['createdAt'];
        let addInvoiceItem = this.state.items;
        addInvoiceItem.push(details);
        this.setState({
            saveButton: false
        });
        this.resetItemForm();

        this.saveInvoiceItem(details);
    }

    onItemSelect(e){
        console.log(e)
        this.getItemAutoComplete.current.selectInventoryItem({itemName: e.data['itemName']});
        let invoice = {...this.state.invoice};
        invoice.details['itemName'] = e.data['itemName'];
        invoice.details['quantities'] = e.data['quantities'];
        invoice.details['price'] = e.data['price'];
        invoice.details['discount'] = e.data['discount'];

        setTimeout(()=>{
            this.setState({invoice});
        });
    }

    resetItemForm() {
        let invoice = {...this.state.invoice};
        invoice.details['quantities'] = 0;
        invoice.details['price'] = 0;
        invoice.details['discount'] = 0;

        setTimeout(()=>{
            this.setState({invoice});
        });
        this.getItemAutoComplete.current.selectInventoryItem({itemName: ''});
    }

    print() {
        if(this.state.invoiceId !== 0) {
            // Make a request for a invoices
            this.axios.get('/invoices/print/' + this.state.invoiceId)
            .then( response => {
                // handle success
                if(response.status === 200){
                    console.log("Invoice printed")
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    getSelectedItem(item) {
        let invoice = {...this.state.invoice};
        invoice.details['itemId'] = item.id;
        invoice.details['itemName'] = item.itemName;
        invoice.details['quantities'] = item.quantities;
        invoice.details['price'] = item.retailRate;

        setTimeout(()=>{
            this.setState({invoice});
        });

        if(this.state.invoiceId === 0 && this.state.invoice.readonly === false){
            this.setState({selectedItem: item, disableAddItemButton: true});
        } else {
            this.setState({selectedItem: item, disableAddItemButton: false});
        }

        this.calculateAmount();
    }

    getSelectedCustomer(customer) {
        console.log("selected customer");
        console.log(customer);
        let invoice = {...this.state.invoice}
        if(customer.id === undefined){
            delete invoice['customerId'];
            invoice['customerName'] = customer.firstName === undefined ? customer : customer.firstName;
        } else {
            invoice['customerId'] = customer.id;
            invoice['customerName'] = customer.firstName;
            invoice['partyName'] = customer.shopName;
        }

        this.setState({
            selectedCustomer: customer,
            invoice: invoice
        });
    }

    render() {
        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        {
                            this.state.invoice &&
                            <div style={{padding: '10px'}}>
                                <Fieldset legend="Item(s) Details">
                                    <legend>Customer Information</legend>
                                    <div className="">
                                    <div className="p-col-12">
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <CustomerAutoComplete ref={this.getCustomerAutoComplete} onChange={this.getSelectedCustomer}></CustomerAutoComplete>
                                                </span>
                                            </div>

                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <Calendar id="createdAt" hideOnDateTimeSelect={true} showTime={true} onChange={(e) => {this.updateProperty('createdAt', e.target.value)}} value={this.state.invoice.createdAt}/>
                                                    <label htmlFor="createdAt">Date</label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-col-12">
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="partyName" maxLength={250} onChange={(e) => {this.updateProperty('partyName', e.target.value)}} value={this.state.invoice.partyName}/>
                                                        <label htmlFor="partyName">Party Name</label>
                                                    </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="transport" onChange={(e) => {this.updateProperty('transport', e.target.value)}} value={this.state.invoice.transport}/>
                                                        <label htmlFor="transport">Transport</label>
                                                    </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="transportCharges"
                                                                   onChange={(e) => {this.updateProperty('transportCharges', e.target.value)}}
                                                                   onBlur={(e) => {this.updateProperty('transportCharges', this.Float(e.target.value))}} value={this.state.invoice.transportCharges}/>
                                                        <label htmlFor="transportCharges">Transport Charges</label>
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12">
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText ref="address" maxLength={500} onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.invoice.address}/>
                                                        <label htmlFor="address">Address</label>
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col p-clearfix" style={{padding:'.50em'}}>
                                            <Button disabled={this.state.disableSaveButton} label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveInvoice}/>
                                            <Button disabled={this.state.disableButtons} label="Back" icon="pi pi-arrow-circle-left" className="p-button-rounded p-button-info" onClick={(e)=>{window.location = '#/invoices/all'}}/>
                                        </div>
                                    </div>
                                </div>
                                </Fieldset>
                                <div className="p-col-12 p-component">
                                    <Fieldset legend="Item(s) Details">
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <ItemAutoComplete ref={this.getItemAutoComplete} onChange={this.getSelectedItem}></ItemAutoComplete>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="quantities" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('quantities', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.quantities}/>
                                                    <label htmlFor="quantities">Quantities</label>
                                                </span>
                                            </div>

                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="price" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('price', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.price}/>
                                                    <label htmlFor="price">Price</label>
                                                </span>
                                            </div>

                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="discount" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('discount', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.discount}/>
                                                    <label htmlFor="discount">Discount</label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <Button label="Add" disabled={this.state.disableAddItemButton} icon="pi pi-plus" className="p-button-rounded" onClick={this.addNewItem}/>
                                                <Button disabled={false} label="Print" icon="pi pi-print" className="p-button-rounded" onClick={this.print}/>
                                            </div>
                                        </div>
                                        <div className="p-grid">
                                            <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                                <DataTable value={this.state.items} paginator={true} rows={25}
                                                           scrollable={true} scrollHeight="200px" responsive={true}
                                                           selectionMode="none" selection={this.state.selectedInventory}
                                                           onSelectionChange={e => this.setState({selectedInventory: e.value})}
                                                           onRowSelect={this.onItemSelect} emptyMessage="No record(s) found">

                                                    <Column field="itemName" header="Item Name" sortable={true} style={{textAlign: 'left', width: '25%'}}/>
                                                    {/*<Column field="unit" header="Unit" sortable={true} style={{textAlign: 'right'}}/>*/}
                                                    <Column field="quantities" header="Qty" sortable={true} style={{textAlign: 'right', width: '12%'}}/>
                                                    <Column field="price" header="Price" sortable={true} style={{textAlign: 'right', width: '12%'}}/>
                                                    <Column field="amount" header="Amount" sortable={true} style={{textAlign: 'right', width: '12%'}}/>
                                                    <Column field="discount" header="Discount" sortable={true} style={{textAlign: 'right', width: '12%'}}/>
                                                    <Column field="totalAmount" header="Total Amount" sortable={true} style={{textAlign: 'right', width: '12%'}}/>
                                                    <Column header="Action" body={(rowData, column)=> this.deleteActionColumn(rowData, column, 'invoice', this.state)} style={{width: '12%'}}/>
                                                </DataTable>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                        }
                    </div>
                </Navigation>
            </div>
        );
    }
}
