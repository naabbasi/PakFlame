import React from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {GenericComponent} from "../GenericComponent";

export class Product {}

export default class ProductAutoComplete extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            productSuggestions: [],
            products: [],
            product: null
        };

        this.suggestProducts = this.suggestProducts.bind(this);
    }

    componentDidMount() {
        this.loadAllProducts();
    }

    loadAllProducts() {
        this.axios.get('/products')
            .then( response => {
                // handle success
                if(response.status === 200){
                    console.log(response.data);
                    this.setState({products: response.data});
                }
            }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    suggestProducts(event) {
        setTimeout(() => {
            let results = [];

            if (event.query.length === 0) {
                    results = [...this.state.products];
            } else {
                if(this.state.products.length !== 0) {
                    results = this.state.products.filter((product) => {
                        return product['productName'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }
            this.setState({productSuggestions: results});
        }, 250);
    }

    onSelectProduct(event) {
        this.setState({product:  event.value});
        console.log("child: Select Product");
        console.log(event.value);
        if(this.props.onChange === undefined) {
            console.log("Please add onChange() handler in parent");
            console.log(`<ProductsAutoComplete ref={this.getProductAutoComplete} onChange={this.handler}></ProductsAutoComplete>`);
            console.log(`handler(product) {
                this.setState({selectedProduct: product});
            }`);
        } else {
            this.props.onChange(event.value);
        }
    }

    selectProduct(product) {
        this.setState({product: product});
    }

    render() {
        return <div>
            <AutoComplete dropdown={true}  field="productName"
                  placeholder="Please Select Product Name"
                  readonly={false}
                  maxLength={250}
                  value={this.state.product} onChange={(e) => this.onSelectProduct(e)}
                  suggestions={this.state.productSuggestions} completeMethod={this.suggestProducts.bind(this)}
            />
            <span ref="" style={{display: 'none'}}>{this.state.product ? this.state.product['id'] : 'None'} </span>
            <span ref="productName" style={{display: 'none'}}>{this.state.product ? this.state.product['productName'] : 'None'} </span>
            <span ref="productStatus" style={{display: 'none'}}>{this.state.product ? this.state.product['productStatus'] : 'None'} </span>
            <span ref="productType" style={{display: 'none'}}>{this.state.product ? this.state.product['productType'] : 'None'} </span>
        </div>
    }
}
