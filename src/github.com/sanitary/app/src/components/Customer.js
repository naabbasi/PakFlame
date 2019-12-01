import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "./GenericComponent";
import Navigation from "./layout/Navigation";

export default class Customer extends GenericComponent {
    constructor() {
        super();
        this.state = {
            customers: []
        };
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.close = this.close.bind(this);
        this.onCustomerSelect = this.onCustomerSelect.bind(this);
        this.addNew = this.addNew.bind(this);
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

    save() {
        if(this.newCustomer){
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

    delete() {
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

    close() {
        this.setState({selectedCustomer:null, customer: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let customer = this.state.customer;
        customer[property] = value;
        this.setState({customer: customer});
    }

    onCustomerSelect(e){
        this.newCustomer = false;
        this.setState({
            displayDialog:true,
            customer: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newCustomer = true;
        this.setState({
            customer: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', status: '', amount: 0, remaining: 0, total: 0},
            displayDialog: true
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Customers Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Customer(s)" size="50"/>
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
                        <DataTable id="customerTable" value={this.state.customers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedCustomer} onSelectionChange={e => this.setState({selectedCustomer: e.value})}
                                   onRowSelect={this.onCustomerSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstName" header="First Name" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="lastName" header="Last Name" sortable={true} style={{textAlign: 'left'}}/>
                            <Column field="mobileNumber" header="Mobile Number" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="status" header="Status" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="shopName" header="Shop Name" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="amount" header="Amount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="remaining" header="Remaining Amount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="total" header="Total Amount" sortable={true} style={{textAlign: 'center'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Customer Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.customer &&
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="firstName" onChange={(e) => {this.updateProperty('firstName', e.target.value)}} value={this.state.customer.firstName}/>
                                                <label htmlFor="firstName">First Name</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="lastName" onChange={(e) => {this.updateProperty('lastName', e.target.value)}} value={this.state.customer.lastName}/>
                                                <label htmlFor="lastName">Last Name</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="mobileNumber" onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.customer.mobileNumber}/>
                                                <label htmlFor="mobileNumber">Mobile Number</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="shopName" onChange={(e) => {this.updateProperty('shopName', e.target.value)}} value={this.state.customer.shopName}/>
                                                <label htmlFor="shopName">Shop Name</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="address" onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.customer.address}/>
                                                <label htmlFor="address">Address</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="status" onChange={(e) => {this.updateProperty('status', e.target.value)}} value={this.state.customer.status}/>
                                                <label htmlFor="status">Status</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="amount" keyfilter="num" onChange={(e) => {this.updateProperty('amount', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('amount', this.Float(e.target.value))}}
                                                           value={this.state.customer.amount}/>
                                                <label htmlFor="amount">Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="remaining" keyfilter="num" onChange={(e) => {this.updateProperty('remaining', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('remaining', this.Float(e.target.value))}}
                                                           value={this.state.customer.remaining}/>
                                                <label htmlFor="remaining">Remaining Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="total" keyfilter="num" onChange={(e) => {this.updateProperty('total', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('total', this.Float(e.target.value))}}
                                                           value={this.state.customer.total}/>
                                                <label htmlFor="total">Total Amount</label>
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
