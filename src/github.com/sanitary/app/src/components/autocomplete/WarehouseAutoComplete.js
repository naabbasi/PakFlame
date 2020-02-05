import React, {Component} from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {GenericComponent} from "../GenericComponent";

export default class WarehouseAutoComplete extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            warehouseSuggestions: [],
            warehouses: [],
            warehouse: null
        };

        this.suggestCustomers = this.suggestCustomers.bind(this);
    }

    componentDidMount() {
        this.axios.get('/warehouses')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({warehouses: response.data});
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    suggestCustomers(event) {
        setTimeout(() => {
            let results = new Array();

            if (event.query.length === 0) {
                    results = [...this.state.warehouses];
            } else {
                if(this.state.warehouses.length !== 0) {
                    results = this.state.warehouses.filter((warehouse) => {
                        return warehouse['name'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }
            this.setState({warehouseSuggestions: results});
        }, 250);
    }

    onSelectWarehouse(event) {
        this.setState({warehouse:  event.value});
        console.log("child: nSelectItem");
        console.log(event.value);
        if(this.props.onChange === undefined) {
            console.log("Please add onChange() handler in parent");
            console.log(`<CustomerAutoComplete ref={this.getItemAutoComplete} onChange={this.handler}></CustomerAutoComplete>`);
            console.log(`handler(warehouse) {
                this.setState({selectedCustomer: warehouse});
            }`);
        } else {
            this.props.onChange(event.value);
        }
    }

    render() {
        return <div>
            <AutoComplete dropdown={true}  field="name"
                  placeholder="Please Select Warehouse"
                  readonly={false}
                  maxLength={250}
                  value={this.state.warehouse} onChange={(e) => this.onSelectWarehouse(e)}
                  suggestions={this.state.warehouseSuggestions} completeMethod={this.suggestCustomers.bind(this)}
            />
        </div>
    }
}
