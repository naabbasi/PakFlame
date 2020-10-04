import React from 'react';
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
        this.close = this.close.bind(this);
        this.onPaymentSelect = this.onPaymentSelect.bind(this);
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
                this.paymentRef.current.getPaymentsByEntityId(this.state.customer['id'])
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
            customer: {firstName: '', lastName: '', mobileNumber: '', shopName: '', address: '', status: ''},
            displayDialog: true
        });
    }

    render() {
        return(
            <Navigation>
                <div className="content-section implementation">
                    <div>
                        <div className="p-col-12">
                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="firstName" readOnly={true} value={this.state.customer.firstName}/>
                                        <label htmlFor="firstName">First Name</label>
                                    </span>
                                </div>

                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="lastName" readOnly={true} value={this.state.customer.lastName}/>
                                        <label htmlFor="lastName">Last Name</label>
                                    </span>
                                </div>
                            </div>

                            <div className="p-grid" style={{ paddingTop: '10px'}}>
                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="advanceAmount" readOnly={true} maxLength={255} value={this.state.customer.advanceAmount}/>
                                        <label htmlFor="advanceAmount">Advance Amount</label>
                                    </span>
                                </div>

                                <div className="p-col-6" style={{padding:'.75em'}}>
                                    <span className="p-float-label p-fluid">
                                        <InputText ref="remainingAmount" readOnly={true} value={this.state.customer.remainingAmount}/>
                                        <label htmlFor="remainingAmount">Remaining Amount</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PaymentComponent ref={this.paymentRef} type="customer"></PaymentComponent>
                </div>
            </Navigation>
        );
    }
}
