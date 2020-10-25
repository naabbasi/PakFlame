import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Calendar} from "primereact/calendar";
import CustomerAutoComplete from "../autocomplete/CustomerAutoComplete";
import {Fieldset} from "primereact/fieldset";
import ProductAutoComplete from "../autocomplete/ProductAutoComplete";
import {Dialog} from "primereact/dialog";
import {Message} from "primereact/message";

export default class ProductInvoice extends GenericComponent {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(props.location.search);
        console.log(params.get('invoiceId'));
        this.tempRemainingAmount = 0.0;
        this.tempAdvanceAmount = 0.0;

        this.state = {
            invoice: null,
            invoiceDetails: [],
            invoicePayment: {customerId: '', invoiceNumber: 0, advanceAmount: 0.0, remainingAmount: 0.0, invoiceAmount: 0.0, amount: 0.0, remaining: 0.0},
            products: [],
            invoiceId: params.get('invoiceId') == null ? 0 : params.get('invoiceId'),
            disableButtons: true,
            disableSaveButton: false,
            disableAddItemButton: true,
            invoiceMessage: {
                severity: 'info',
                text: '',
                visible: 'hidden'
            },
            invoicePrintMessage: {
                severity: 'info',
                text: '',
                visible: 'hidden'
            },
            invoicePaymentMessage: {
                severity: 'info',
                text: '',
                visible: 'hidden'
            }
        };

        this.newInvoice = false;
        this.newInvoiceItem = false;

        //Create refs
        this.getProductAutoComplete = React.createRef();
        this.getCustomerAutoComplete = React.createRef();

        this.saveInvoice = this.saveInvoice.bind(this);
        this.onInvoiceSelect = this.onInvoiceSelect.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.print = this.print.bind(this);
        this.getSelectedProduct = this.getSelectedProduct.bind(this);
        this.getSelectedCustomer = this.getSelectedCustomer.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
        this.updateProductInvoicePaymentDialog = this.updateProductInvoicePaymentDialog.bind(this);
        this.updateProductInvoicePaymentCloseDialog = this.updateProductInvoicePaymentCloseDialog.bind(this);
        this.updateProductInvoicePayment = this.updateProductInvoicePayment.bind(this);
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
                    id: data['id'], customerId: data['customerId'], customerName: data['customerName'], createdAt: new Date(data['createdAt']), billNumber: data['billNumber'],
                    partyName: data['partyName'], transport: data['transport'], transportCharges: data['transportCharges'], address: data['address'], readonly: data['readonly'],
                    invoiceAmount: data['invoiceAmount'], invoicePaidAmount: data['invoicePaidAmount'], invoiceRemainingAmount: data['invoiceRemainingAmount'],
                    details: {id: 0, itemName: '', createdAt: '', unit: '', productQuantities: 0, productPrice: 0, amount: 0, productDiscount: 0, totalAmount: 0, customerId: ''},
                },
            });

            this.getCustomerAutoComplete.current.selectCustomer({id: data['customerId'], firstName: data['customerName']})
        } else {
            this.setState({
                disableButtons: false,
                invoice: {
                    id: 0, customerId: '', customerName: '', createdAt: new Date(), billNumber: 0, partyName: '', transport: '', transportCharges: 0, address: '', readonly: false,
                    invoiceAmount: 0, invoicePaidAmount: 0, invoiceRemainingAmount: 0,
                    details: {id: 0, itemName: '', createdAt: '', unit: '', productQuantities: 0, productPrice: 0, amount: 0, productDiscount: 0, totalAmount: 0, customerId: ''},
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
        this.axios.get('/product_invoices/items/' + id)
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

            this.axios.post('/product_invoices', this.state.invoice)
            .then( response => {
                // handle success
                if(response.status === 201){
                    this.setState({invoiceId: response.data['result']['id'],item: {}, disableSaveButton: true, disableAddItemButton: false});
                    this.newInvoice = false;

                    let invoiceMessage = {...this.state.invoiceMessage}
                    invoiceMessage.severity = 'info';
                    invoiceMessage.text = response.data['message'];
                    invoiceMessage.visible = 'visible';
                    this.setState({invoiceMessage: invoiceMessage});
                    window.location = `#/invoices/product_invoice?invoiceId=${response.data['result']['id']}`
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        } else{
            this.axios.put('/product_invoices',this.state.invoice)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({item: {}});
                    let invoiceMessage = {...this.state.invoiceMessage}
                    invoiceMessage.severity = 'info';
                    invoiceMessage.text = response.data;
                    invoiceMessage.visible = 'visible';
                    this.setState({invoiceMessage: invoiceMessage});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    deleteInvoice1() {
        this.axios.delete('/product_invoices', { data: { ...this.state.selectedInvoice}})
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
            this.axios.post('/product_invoices/items', invoiceItem)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        this.setState({item: {}, disableAddItemButton: true});
                        this.newInvoiceItem = false;
                        this.getProductAutoComplete.current.loadAllProducts();
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

            this.axios.put('/product_invoices/items',this.state.invoice)
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
        this.axios.delete(`/product_invoices/items/${itemId}`)
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

    updatePaymentProperty(property, value) {
        let invoicePayment = this.state.invoicePayment;
        invoicePayment[property] = value;
        this.setState({invoicePayment: invoicePayment});
    }

    calculateAmount() {
        let invoice = {...this.state.invoice};
        let productQuantities = invoice.details['productQuantities'];
        let productPrice = invoice.details['productPrice'];
        let amountBeforeProductDiscount = this.Float(productQuantities * productPrice);
        let productDiscount = invoice.details['productDiscount'];

        if(productDiscount === 0){
            invoice.details['amount'] = amountBeforeProductDiscount;
            invoice.details['totalAmount'] = amountBeforeProductDiscount;
        } else {
            let productDiscountAmount = (productDiscount / 100) * amountBeforeProductDiscount;
            console.log("Discounted amount: " + productDiscountAmount)
            invoice.details['amount'] = amountBeforeProductDiscount;
            invoice.details['totalAmount'] = this.Float(amountBeforeProductDiscount - productDiscountAmount);
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
        details['quantities'] = this.Int(details['productQuantities']);
        details['price'] = this.Int(details['productPrice']);
        details['discount'] = this.Int(details['productDiscount']);
        delete details['createdAt'];

        let addInvoiceItem = this.state.products;
        addInvoiceItem.push(details);
        this.setState({
            saveButton: false
        });
        this.resetItemForm();

        this.saveInvoiceItem(details);
    }

    onProductSelect(e){
        console.log(e)
        this.getProductAutoComplete.current.selectItem({itemName: e.data['productName']});
        let invoice = {...this.state.invoice};
        invoice.details['itemName'] = e.data['productName'];
        invoice.details['quantities'] = e.data['productQuantities'];
        invoice.details['productQuantities'] = e.data['productQuantities'];
        invoice.details['price'] = e.data['productQuantities'];
        invoice.details['productPrice'] = e.data['productPrice'];
        invoice.details['discount'] = e.data['productQuantities'];
        invoice.details['productDiscount'] = e.data['productDiscount'];

        setTimeout(()=>{
            this.setState({invoice});
        });
    }

    resetItemForm() {
        let invoice = {...this.state.invoice};
        invoice.details['productQuantities'] = 0;
        invoice.details['productPrice'] = 0;
        invoice.details['productDiscount'] = 0;

        setTimeout(()=>{
            this.setState({invoice});
        });
        this.getProductAutoComplete.current.selectProduct({productName: ''});
    }

    print() {
        if(this.state.invoiceId !== 0) {
            // Make a request for a invoices
            this.axios.get('/product_invoices/print/' + this.state.invoiceId)
            .then( response => {
                // handle success
                if(response.status === 200){
                    console.log("Invoice printed");
                    let invoicePrintMessage = {...this.state.invoicePrintMessage}
                    invoicePrintMessage.severity = 'info';
                    invoicePrintMessage.text = response.data;
                    invoicePrintMessage.visible = 'visible';
                    this.setState({invoicePrintMessage: invoicePrintMessage});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    updateProductInvoicePaymentDialog() {
        console.log(this.state.invoice['customerId'])
        // Make a request for a invoices
        this.axios.get(`/customers/${this.state.invoice['customerId']}`)
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data)
                let invoicePayment = {...this.state.invoicePayment}
                invoicePayment.advanceAmount = response.data['advanceAmount'];
                invoicePayment.remainingAmount = response.data['remainingAmount'];
                invoicePayment.invoiceAmount = this.state.invoice['invoiceRemainingAmount'];
                this.setState({invoicePayment: invoicePayment});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });

        if(this.state.invoiceId !== 0) {
            this.setState({
                displayDialog: true
            });
        }
    }

    updateProductInvoicePaymentCloseDialog() {
        this.setState({
            displayDialog: false
        });
    }

    calculateProductInvoiceAmount() {
        let invoicePayment = this.state.invoicePayment;
        let paidAmount = invoicePayment.amount;
        let remainingInvoiceAmount = 0;

        if(invoicePayment.amount > invoicePayment.invoiceAmount){
            paidAmount = invoicePayment.invoiceAmount;
            invoicePayment.amount = paidAmount;
        }

        invoicePayment.invoiceNumber = this.Int(this.state.invoiceId);
        invoicePayment.customerId = this.state.invoice['customerId'];
        invoicePayment.advanceAmount = this.tempAdvanceAmount;
        invoicePayment.remainingAmount = this.tempRemainingAmount;

        if(invoicePayment.remainingAmount === 0) {
            remainingInvoiceAmount = invoicePayment.invoiceAmount - paidAmount
        } else {
            remainingInvoiceAmount = invoicePayment.remainingAmount - paidAmount
        }

        if(paidAmount !== 0) {
            if(remainingInvoiceAmount === 0) {
                invoicePayment.remainingAmount = remainingInvoiceAmount;
            } else {
                //invoicePayment.remainingAmount = invoicePayment.remainingAmount + remainingInvoiceAmount;
                invoicePayment.remainingAmount = remainingInvoiceAmount;
            }
        }

        if(this.tempAdvanceAmount !== 0) {
            invoicePayment.advanceAmount = this.tempAdvanceAmount - paidAmount;
            invoicePayment.remaining = this.tempAdvanceAmount - paidAmount;
        } else {
            invoicePayment.remaining = remainingInvoiceAmount;
        }

        this.setState({invoicePayment: invoicePayment});
    }

    updateProductInvoicePayment() {
        if(this.state.invoiceId !== 0) {
            // Make a request for a invoices
            this.axios.post('/product_invoices/pay', this.state.invoicePayment)
                .then( response => {
                    // handle success
                    if(response.status === 200){
                        console.log("Invoice payment done");
                        let invoicePaymentMessage = {...this.state.invoicePaymentMessage}
                        invoicePaymentMessage.severity = 'info';
                        invoicePaymentMessage.text = response.data;
                        invoicePaymentMessage.visible = 'visible';
                        this.setState({invoicePaymentMessage: invoicePaymentMessage});
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    getSelectedProduct(product) {
        let invoice = {...this.state.invoice};
        invoice.details['itemId'] = product.id;
        invoice.details['itemName'] = product.productName;
        invoice.details['productName'] = product.productName;
        invoice.details['productQuantities'] = product.productQuantities;
        invoice.details['productPrice'] = product.productPrice;

        setTimeout(()=>{
            this.setState({invoice});
        });

        if(this.state.invoiceId === 0 && this.state.invoice.readonly === false){
            this.setState({selectedItem: product, disableAddItemButton: true});
        } else {
            this.setState({selectedItem: product, disableAddItemButton: false});
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
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Update Payment" icon="pi pi-save" className="p-button-rounded" onClick={this.updateProductInvoicePayment}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.updateProductInvoicePaymentCloseDialog}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        {
                            this.state.invoice &&
                            <div style={{padding: '10px'}}>
                                <Fieldset legend="Product(s) Details">
                                    <legend>Customer Information</legend>
                                    <div className="">
                                    <div className="p-col-12">
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <CustomerAutoComplete disabled={this.state.invoice.readonly} ref={this.getCustomerAutoComplete} onChange={this.getSelectedCustomer}></CustomerAutoComplete>
                                                </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="billNumber" readOnly={this.state.invoice.readonly} maxLength={250} onChange={(e) => {this.updateProperty('billNumber', e.target.value)}}
                                                                   onBlur={(e) => {this.updateProperty('billNumber', this.Float(e.target.value))}} value={this.state.invoice.billNumber}
                                                                   value={this.state.invoice.billNumber}/>
                                                        <label htmlFor="billNumber">Bill Number</label>
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <Calendar id="createdAt" disabled={this.state.invoice.readonly} hideOnDateTimeSelect={true} showTime={true} onChange={(e) => {this.updateProperty('createdAt', e.target.value)}} value={this.state.invoice.createdAt}/>
                                                    <label htmlFor="createdAt">Date</label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-col-12">
                                        <div className="p-grid">
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="partyName" readOnly={this.state.invoice.readonly} maxLength={250} onChange={(e) => {this.updateProperty('partyName', e.target.value)}} value={this.state.invoice.partyName}/>
                                                        <label htmlFor="partyName">Party Name</label>
                                                    </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="transport" readOnly={this.state.invoice.readonly} onChange={(e) => {this.updateProperty('transport', e.target.value)}} value={this.state.invoice.transport}/>
                                                        <label htmlFor="transport">Transport</label>
                                                    </span>
                                            </div>

                                            <div className="p-col-3" style={{padding:'.50em'}}>
                                                    <span className="p-float-label p-fluid">
                                                        <InputText id="transportCharges" readOnly={this.state.invoice.readonly}
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
                                                        <InputText ref="address" readOnly={this.state.invoice.readonly} maxLength={500} onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.invoice.address}/>
                                                        <label htmlFor="address">Address</label>
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12">
                                        <div className="p-col-2" style={{padding:'.50em', float: 'left'}}>
                                            <Button disabled={this.state.disableSaveButton} style={{marginRight: '7px'}} label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveInvoice}/>
                                            <Button disabled={this.state.disableButtons} label="Back" icon="pi pi-arrow-circle-left" className="p-button-rounded p-button-info" onClick={(e)=>{window.location = '#/invoices/all'}}/>
                                        </div>
                                        <div className="p-col-10" style={{padding:'.50em', float: 'right'}}>
                                            <Message style={{visibility: this.state.invoiceMessage.visible}}
                                                     severity={this.state.invoiceMessage.severity}
                                                     text={this.state.invoiceMessage.text}>
                                            </Message>
                                        </div>
                                    </div>
                                </div>
                                </Fieldset>
                                <div className="p-col-12 p-component">
                                    <Fieldset legend="Product Details">
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <ProductAutoComplete ref={this.getProductAutoComplete} onChange={this.getSelectedProduct}></ProductAutoComplete>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="productQuantities" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('productQuantities', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.productQuantities}/>
                                                    <label htmlFor="productQuantities">Product Quantities</label>
                                                </span>
                                            </div>

                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="productPrice" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('productPrice', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.productPrice}/>
                                                    <label htmlFor="productPrice">Product Price</label>
                                                </span>
                                            </div>

                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText id="productDiscount" keyfilter="pint"
                                                               onChange={(e) => {this.updateProperty('productDiscount', this.Int(e.target.value), true)}}
                                                               onBlur={(e) => {this.calculateAmount()}}
                                                               value={this.state.invoice.details.productDiscount}/>
                                                    <label htmlFor="productDiscount">Discount</label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12">
                                            <div className="p-col-4" style={{padding:'.50em'}}>
                                                <Button label="Add" style={{marginRight: this.state.invoice.readonly ? '0px' : '7px', display: this.state.invoice.readonly ? 'none' : 'inline'}} icon="pi pi-plus" className="p-button-rounded" onClick={this.addNewItem}/>
                                                <Button disabled={false} label="Print" icon="pi pi-print" style={{marginRight: '7px'}} className="p-button-rounded" onClick={this.print}/>
                                                <Button disabled={false} label="Payment" icon="pi pi-money-bill" style={{marginRight: '7px'}} className="p-button-rounded" onClick={this.updateProductInvoicePaymentDialog}/>
                                                <Message style={{visibility: this.state.invoicePrintMessage.visible}}
                                                    severity={this.state.invoicePrintMessage.severity}
                                                    text={this.state.invoicePrintMessage.text}>
                                                </Message>
                                            </div>
                                        </div>
                                        <div className="p-grid">
                                            <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                                <DataTable value={this.state.items} paginator={true} rows={25}
                                                           scrollable={true} scrollHeight="200px" responsive={true}
                                                           selectionMode="none" selection={this.state.selectedInventory}
                                                           onSelectionChange={e => this.setState({selectedInventory: e.value})}
                                                           emptyMessage="No record(s) found">

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
                    <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Payment Details"
                            modal={true} footer={dialogFooter} maximizable={true} maximized={false}
                            onShow={() => {
                                let invoicePayment = {...this.state.invoicePayment};
                                invoicePayment.amount = 0.0;
                                this.tempAdvanceAmount = invoicePayment.advanceAmount;
                                this.tempRemainingAmount = invoicePayment.remainingAmount;
                                this.setState({invoicePayment: invoicePayment});
                            }}
                            onHide={() => this.setState({displayDialog: false})}>
                        {
                            this.state.invoicePayment &&
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <div className="p-grid">
                                        <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="advanceAmount" maxLength={255} readOnly={true}
                                                           onChange={(e) => {this.updatePaymentProperty('advanceAmount', this.Float(e.target.value))}}
                                                           onBlur={(e) => {this.updatePaymentProperty('advanceAmount', this.Float(e.target.value))}}
                                                           value={this.state.invoicePayment.advanceAmount}/>
                                                <label htmlFor="advanceAmount">Advance Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="remainingAmount" maxLength={255} readOnly={true}
                                                           onChange={(e) => {this.updatePaymentProperty('remainingAmount', this.Float(e.target.value))}}
                                                           onBlur={(e) => {this.updatePaymentProperty('remainingAmount', this.Float(e.target.value))}}
                                                           value={this.state.invoicePayment.remainingAmount}/>
                                                <label htmlFor="remainingAmount">Remaining Amount</label>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="invoiceAmount" maxLength={255} readOnly={true}
                                                           onChange={(e) => {this.updatePaymentProperty('invoiceAmount', this.Float(e.target.value))}}
                                                           onBlur={(e) => {this.updatePaymentProperty('invoiceAmount', this.Float(e.target.value))}}
                                                           value={this.state.invoicePayment.invoiceAmount}/>
                                                <label htmlFor="advanceAmount">Invoice Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col-6" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="paidAmount" maxLength={255}
                                                           onChange={(e) => {this.updatePaymentProperty('amount', this.Float(e.target.value))}}
                                                           onFocus={(e) => {
                                                               let invoicePayment = {...this.state.invoicePayment};
                                                               //invoicePayment.remainingAmount = this.tempRemainingAmount;
                                                               this.setState({invoicePayment: invoicePayment});
                                                           }}
                                                           onBlur={(e) => {this.calculateProductInvoiceAmount()}}
                                                           value={this.state.invoicePayment.amount}/>
                                                <label htmlFor="paidAmount">Paid Amount</label>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-grid">
                                        <div className="p-col p-fluid" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="invoiceAmount" maxLength={255} readOnly={true}
                                                           onChange={(e) => {this.updatePaymentProperty('remaining', this.Float(e.target.value))}}
                                                           value={this.state.invoicePayment.remaining}/>
                                                <label htmlFor="advanceAmount">Balance Amount</label>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-grid" style={{textAlign: 'center'}}>
                                        <div className="p-col p=fluid">
                                            <Message style={{visibility: this.state.invoicePaymentMessage.visible}}
                                                     severity={this.state.invoicePaymentMessage.severity}
                                                     text={this.state.invoicePaymentMessage.text}>
                                            </Message>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>
                </Navigation>
            </div>
        );
    }
}
