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
        this.state = {};
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onCustomerSelect = this.onCustomerSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        // Make a request for a users
        this.axios.get('/customers')
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 200){
                this.setState({customers: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    }

    save() {
        let customers = [...this.state.customers];
        if(this.newCustomer){
            this.axios.post('/customers', this.state.customer)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 201){
                    this.setState({customers: response.data, selectedCustomer:null, customer: null, displayDialog:false});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
        }
        else{
            this.axios.put('/customers',this.state.customer)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 200){
                        this.setState({customers: response.data, selectedCustomer:null, customer: null, displayDialog:false});
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
            //this.setState({customers: customers, selectedCustomer:null, customer: null, displayDialog:false});
        }
    }

    delete() {
        this.axios.delete('/customers', { data: { ...this.state.selectedCustomer}})
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 200){
                this.setState({customers: response.data, selectedCustomer:null, customer: null, displayDialog:false});
                let index = this.findSelectedcustomerIndex();
                this.setState({
                    customers: this.state.customers.filter((val,i) => i !== index),
                    selectedCustomer: null,
                    customer: null,
                    displayDialog: false});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    }

    findSelectedcustomerIndex() {
        return this.state.customers.indexOf(this.state.selectedCustomer);
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
            customer: {firstname: '', lastname: '', mobileNumber: '', status: ''},
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
            <Button label="Delete" icon="pi pi-times" onClick={this.delete}/>
            <Button label="Save" icon="pi pi-check" onClick={this.save}/>
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
                            <Column field="firstname" header="First Name" sortable={true} />
                            <Column field="lastname" header="Last Name" sortable={true} />
                            <Column field="mobileNumber" header="Mobile Number" sortable={true} />
                            <Column field="status" header="Status" sortable={true} />
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Customer Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.customer &&

                                <div className="p-grid p-fluid">
                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="firstname">First Name</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="firstname" onChange={(e) => {this.updateProperty('firstname', e.target.value)}} value={this.state.customer.firstname}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="lastname">Last Name</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="lastname" onChange={(e) => {this.updateProperty('lastname', e.target.value)}} value={this.state.customer.lastname}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="mobileNumber">Mobile Number</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="mobileNumber" onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.customer.mobileNumber}/>
                                    </div>

                                    <div className="p-col-4" style={{padding:'.75em'}}><label htmlFor="status">Status</label></div>
                                    <div className="p-col-8" style={{padding:'.5em'}}>
                                        <InputText id="status" onChange={(e) => {this.updateProperty('status', e.target.value)}} value={this.state.customer.status}/>
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
