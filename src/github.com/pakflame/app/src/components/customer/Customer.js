import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import PaymentComponentModal from "../payment/PaymentComponentModel";
import {Dropdown} from "primereact/dropdown";

export default class Customer extends GenericComponent {
    constructor() {
        super();
        this.state = {
            customers: [],
            askReasonDialog: false,
            orderStatus: ''
        };

        this.saveCustomer = this.saveCustomer.bind(this);
        this.closeCustomerDialog = this.closeCustomerDialog.bind(this);
        this.onCustomerSelect = this.onCustomerSelect.bind(this);
        this.addNewCustomer = this.addNewCustomer.bind(this);
        this.onOrderStatusChange = this.onOrderStatusChange.bind(this);
    }

    async componentDidMount() {
        this.getCustomers();
    }

    getCustomers() {
        // Make a request for a customers
        this.axios.get('/customers')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({customers: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    saveCustomer() {
        if(this.newCustomer){
            delete this.state.customer['id'];
            this.axios.post('/customers', this.state.customer)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    this.setState({customers: null, selectedCustomer:null, customer: null, displayDialog:false});
                    this.getCustomers();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
        else{
            this.axios.put('/customers',this.state.customer)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({customers: null, selectedCustomer:null, customer: null, displayDialog:false});
                    this.getCustomers();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    deleteCustomer(customerId) {
        this.axios.delete(`/customers/${customerId}`)
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 204){
                this.setState({customers: null, selectedCustomer:null, customer: null, displayDialog:false});
                this.getCustomers();
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    closeCustomerDialog() {
        this.setState({selectedCustomer:null, customer: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let customer = this.state.customer;
        customer[property] = value;
        this.setState({customer: customer});
    }

    onCustomerSelect(e){
        this.setState({eventCustomerData: e.data, askReasonDialog: true});
    }

    editCustomer() {
        this.newCustomer = false;
        this.setState({
            displayDialog:true,
            askReasonDialog: false,
            customer: Object.assign({}, this.state.eventCustomerData),
            orderStatus: {label: this.state.eventCustomerData['orderStatus'], status: this.state.eventCustomerData['orderStatus']}
        });
    }

    addNewCustomer() {
        this.newCustomer = true;
        this.setState({
            customer: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', orderStatus: '', advanceAmount: 0, remainingAmount: 0},
            displayDialog: true
        });
    }

    addNewPayment() {
        console.log(this.state.eventCustomerData)
        window.location.hash = `#/customers/details?id=${this.state.eventCustomerData['id']}`;
    }

    onOrderStatusChange(e) {
        console.log(e.value)
        this.setState({orderStatus: e.value});
        this.updateProperty('orderStatus', e.value.status);
    }

    render() {
        const orderStatusOptions = [
            {label: 'In Process', status: 'In Process'},
            {label: 'Delivered', status: 'Delivered'},
            {label: 'Pending', status: 'Pending'},
            {label: 'Cancel', status: 'Cancel'}
        ];

        let header = <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px'}}>
            <div style={{lineHeight: '30px'}}>Customers Information</div>
            <span className="p-input-icon-left">
                <i className="pi pi-search"></i>
                <InputText type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Warehouse(s)" size="50"/>
            </span>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" label="Add Customer" icon="pi pi-plus" onClick={this.addNewCustomer}/>
        </div>;

        let dialogFooter = <div className="p-grid p-align-center" style={{ paddingTop: '10px'}}>
            <div style={{textAlign: 'right', width: '100%'}}>
                <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveCustomer}/>
                <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeCustomerDialog}/>
            </div>
        </div>;

        let askReasonFooter = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" style={{float:'left'}} label="Edit Customer" icon="pi pi-plus" onClick={this.editCustomer.bind(this)}/>
            <Button className="p-button-rounded" style={{float:'left'}} label="Manage Payment" icon="pi pi-plus" onClick={this.addNewPayment.bind(this)}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable id="customerTable" value={this.state.customers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px" responsive={true}
                                   selectionMode="none" selection={this.state.selectedCustomer} onSelectionChange={e => this.setState({selectedCustomer: e.value})}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstName" header="First Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="lastName" header="Last Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="mobileNumber" header="Mobile #" sortable={true} style={{textAlign: 'center', width: '14%'}}/>
                            <Column field="shopName" header="Shop Name" sortable={true} style={{textAlign: 'left', width: '10%'}}/>
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'left', width: '25%'}}/>
                            <Column field="advanceAmount" header="Advance" sortable={true} style={{textAlign: 'right', width: '10%'}}/>
                            <Column field="remainingAmount" header="Remaining" sortable={true} style={{textAlign: 'right', width: '10%'}}/>
                            <Column field="orderStatus" header="Status" sortable={true} style={{textAlign: 'center', width: '11%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'customers', this.state, 'Manage')} style={{width: '12%'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Customer Details" modal={true} maximizable={true} maximized={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.customer &&
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="firstName" maxLength={255} onChange={(e) => {this.updateProperty('firstName', e.target.value)}} value={this.state.customer.firstName}/>
                                                    <label htmlFor="firstName">First Name</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="lastName" maxLength={255} onChange={(e) => {this.updateProperty('lastName', e.target.value)}} value={this.state.customer.lastName}/>
                                                    <label htmlFor="lastName">Last Name</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="mobileNumber" maxLength={11} onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.customer.mobileNumber}/>
                                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="shopName" maxLength={255} onChange={(e) => {this.updateProperty('shopName', e.target.value)}} value={this.state.customer.shopName}/>
                                                    <label htmlFor="shopName">Shop Name</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="address" maxLength={500} onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.customer.address}/>
                                                    <label htmlFor="address">Address</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="advanceAmount" maxLength={11}
                                                               onChange={(e) => {this.updateProperty('advanceAmount', e.target.value)}}
                                                               onBlur={(e) => {this.updateProperty('advanceAmount', this.Float(e.target.value))}}
                                                               value={this.state.customer.advanceAmount}/>
                                                    <label htmlFor="advanceAmount">Advance Amount</label>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="remainingAmount" maxLength={255}
                                                               onChange={(e) => {this.updateProperty('remainingAmount', e.target.value)}}
                                                               onBlur={(e) => {this.updateProperty('remainingAmount', this.Float(e.target.value))}}
                                                               value={this.state.customer.remainingAmount}/>
                                                    <label htmlFor="remainingAmount">Remaining Amount</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <Dropdown value={this.state.orderStatus} options={orderStatusOptions} onChange={this.onOrderStatusChange} placeholder="Select Order Status" optionLabel="label"/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Dialog>
                        <Dialog visible={this.state.askReasonDialog} header="Please confirm"
                                footer={askReasonFooter}
                                onHide={()=>{this.setState({askReasonDialog: false})}}>
                            <div>What do you want to do?</div>
                        </Dialog>
                        <PaymentComponentModal ref={this.paymentRef} type="customer"></PaymentComponentModal>
                    </div>
                </Navigation>
            </div>
        );
    }
}
