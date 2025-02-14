import React from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {GenericComponent} from "../GenericComponent";

export default class CustomerAutoComplete extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            customerSuggestions: [],
            customers: [],
            customer: null,
            disableCustomerAutoComplete: false,
            customerAutoCompleteLabel: "Please Select Customer Name"
        };

        this.suggestCustomers = this.suggestCustomers.bind(this);
        this.customerTemplate = this.customerTemplate.bind(this);
    }

    componentDidMount() {
        this.axios.get('/customers')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({customers: response.data});
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });

        if(this.props.disabled !== undefined) {
            this.setState({disableCustomerAutoComplete: this.props.disabled});
        }

        if(this.props.label !== undefined) {
            this.setState({customerAutoCompleteLabel: this.props.label});
        }
    }

    customerTemplate(customer) {
        return (
            <div>{customer.firstName} {customer.lastName}</div>
        )
    }

    selectedCustomerTemplate(customer) {
        return customer.firstName + " " + customer.lastName;
    }

    suggestCustomers(event) {
        setTimeout(() => {
            let results = [];

            if (event.query.length === 0) {
                    results = [...this.state.customers];
            } else {
                if(this.state.customers.length !== 0) {
                    results = this.state.customers.filter((customer) => {
                        return customer['firstName'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }
            this.setState({customerSuggestions: results});
        }, 250);
    }

    onSelectCustomer(event) {
        this.setState({customer:  event.value});
        console.log("child: nSelectItem");
        console.log(event.value);
        if(this.props.onChange === undefined) {
            console.log("Please add onChange() handler in parent");
            console.log(`<CustomerAutoComplete ref={this.getItemAutoComplete} onChange={this.handler}></CustomerAutoComplete>`);
            console.log(`handler(customer) {
                this.setState({selectedCustomer: customer});
            }`);
        } else {
            this.props.onChange(event.value);
        }
    }

    selectCustomer(customer) {
        this.setState({customer: customer});
    }

    render() {
        return <div>
            <AutoComplete dropdown={true} disabled={this.state.disableCustomerAutoComplete} field="firstName"
                  placeholder={this.state.customerAutoCompleteLabel}
                  readonly={false}
                  maxLength={250} itemTemplate={this.customerTemplate} selectedItemTemplate={this.selectedCustomerTemplate}
                  value={this.state.customer} onChange={(e) => this.onSelectCustomer(e)}
                  suggestions={this.state.customerSuggestions} completeMethod={this.suggestCustomers.bind(this)}
            />
            <span ref="firstName" style={{display: 'none'}}>{this.state.item ? this.state.item['id'] : 'None'} </span>
            <span ref="itemName" style={{display: 'none'}}>{this.state.item ? this.state.item['itemName'] : 'None'} </span>
            <span ref="itemStatus" style={{display: 'none'}}>{this.state.item ? this.state.item['itemStatus'] : 'None'} </span>
            <span ref="retailRate" style={{display: 'none'}}>{this.state.item ? this.state.item['retailRate'] : 'None'} </span>
            <span ref="quantities" style={{display: 'none'}}>{this.state.item ? this.state.item['quantities'] : 'None'} </span>
            <span ref="companyId" style={{display: 'none'}}>{this.state.item ? this.state.item['companyId'] : 'None'} </span>
        </div>
    }
}
