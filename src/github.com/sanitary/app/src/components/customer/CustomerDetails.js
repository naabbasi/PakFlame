import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import PaymentComponent from "../payment/PaymentComponent";

export default class CustomerDetails extends GenericComponent {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(props.location.search);
        console.log(params.get('id'));

        this.state = {
            customer: {},
            customerId: params.get('id') == null ? 0 : params.get('id'),
        };

        //Refs
        this.paymentRef = React.createRef();

        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.close = this.close.bind(this);
        this.onPaymentSelect = this.onPaymentSelect.bind(this);
        this.addNewPayment = this.addNewPayment.bind(this);
    }

    async componentDidMount() {
        this.getCustomerById();
    }

    getCustomerById() {
        // Make a request for a customers
        this.axios.get(`/customers/${this.state.customerId}`)
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({customer: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    save() {
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

    onPaymentSelect(e){
        this.setState({eventCustomerData: e.data, askReasonDialog: true});
    }

    addNew() {
        this.newCustomer = true;
        this.setState({
            customer: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', status: '', amount: 0, remaining: 0, total: 0},
            displayDialog: true
        });
    }

    addNewPayment() {
        this.setState({askReasonDialog: false, displayDialog: false})
        this.paymentRef.current.showHidePaymentDialog(true, this.paymentRef.current, this.state.eventCustomerData);
    }

    render() {
        return(
            <Navigation>
                <div className="content-section implementation">
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
                        </div>
                    </div>
                </div>
                <PaymentComponent type="customer" dataId={this.state.customer['id']}></PaymentComponent>
            </Navigation>
        );
    }
}
