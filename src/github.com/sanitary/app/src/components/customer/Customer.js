import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import PaymentComponentModal from "../payment/PaymentComponentModel";

export default class Customer extends GenericComponent {
    constructor() {
        super();
        this.state = {
            customers: [],
            askReasonDialog: false
        };

        this.saveCustomer = this.saveCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.closeCustomerDialog = this.closeCustomerDialog.bind(this);
        this.onCustomerSelect = this.onCustomerSelect.bind(this);
        this.addNewCustomer = this.addNewCustomer.bind(this);
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

    deleteCustomer() {
        this.axios.delete('/customers', { data: { ...this.state.selectedCustomer}})
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
            customer: Object.assign({}, this.state.eventCustomerData)
        });
    }

    addNewCustomer() {
        this.newCustomer = true;
        this.setState({
            customer: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', status: ''},
            displayDialog: true
        });
    }

    addNewPayment() {
        console.log(this.state.eventCustomerData)
        window.location.hash = `#/customers/details?id=${this.state.eventCustomerData['id']}`;
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Customers Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Customer(s)" size="50"/>
            </div>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Add Customer" icon="pi pi-plus" onClick={this.addNewCustomer}/>
        </div>;

        let dialogFooter = <div className="p-grid p-align-center" style={{ paddingTop: '10px'}}>
            <div style={{textAlign: 'right', width: '100%'}}>
                <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveCustomer}/>
                <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteCustomer}/>
                <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeCustomerDialog}/>
            </div>
        </div>;

        let askReasonFooter = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Edit Customer" icon="pi pi-plus" onClick={this.editCustomer.bind(this)}/>
            <Button style={{float:'left'}} label="Manage Payment" icon="pi pi-plus" onClick={this.addNewPayment.bind(this)}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable id="customerTable" value={this.state.customers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedCustomer} onSelectionChange={e => this.setState({selectedCustomer: e.value})}
                                   onRowSelect={this.onCustomerSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstName" header="First Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="lastName" header="Last Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="mobileNumber" header="Mobile #" sortable={true} style={{textAlign: 'center', width: '12%'}}/>
                            <Column field="status" header="Status" sortable={true} style={{textAlign: 'center', width: '11%'}}/>
                            <Column field="shopName" header="Shop Name" sortable={true} style={{textAlign: 'center', width: '10%'}}/>
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'center', width: '25%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column)} style={{width: '12%'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Customer Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
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
                                            <div className="p-col" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="status" maxLength={255} onChange={(e) => {this.updateProperty('status', e.target.value)}} value={this.state.customer.status}/>
                                                    <label htmlFor="status">Status</label>
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
