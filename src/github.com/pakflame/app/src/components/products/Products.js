import React from 'react';
import Navigation from "../layout/Navigation";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {GenericComponent} from "../GenericComponent";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";

export default class Products extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            product: {},
            selectedProduct: {}
        };

        //creating refs
        this.productsDataTable = React.createRef();

        this.addNewProduct = this.addNewProduct.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.closeProductDialog = this.closeProductDialog.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
        this.onProductStatusChange = this.onProductStatusChange.bind(this);
        this.onProductTagsChange = this.onProductTagsChange.bind(this);
    }

    async componentDidMount() {
        //this.productsDataTable.current.props.loading = true;
        console.log(this.productsDataTable.current);
        this.getProducts();
    }

    getProducts() {
        // Make a request for a products
        this.axios.get('/products')
            .then( response => {
                // handle success
                if(response.status === 200){
                    this.setState({products: response.data});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    saveProduct() {
        if(this.NewProduct){
            this.axios.post('/products', this.state.product)
                .then( response => {
                    // handle success
                    if(response.status === 201){
                        this.setState({products: null, selectedProduct:null, product: null, displayDialog:false});
                        this.getProducts();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else{
            this.axios.put('/products',this.state.product)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({products: null, selectedProduct:null, product: null, displayDialog:false});
                        this.getProducts();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteProduct(productId) {
        this.axios.delete(`/products/${productId}`)
            .then( response => {
                // handle success
                if(response.status === 204){
                    this.setState({products: null, selectedProduct:null, product: null, displayDialog:false});
                    this.getProducts();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    addNewProduct() {
        this.NewProduct = true;
        this.setState({
            product: {productName: '', productPrice: 0, productQuantities: 0, productModel: '', productDate: new Date()},
            productType: null, productStatus: null,
            displayDialog: true
        });
    }

    closeProductDialog() {
        this.setState({selectedProduct:null, product: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let product = this.state.product;
        product[property] = value;
        this.setState({product: product});
    }

    onProductSelect(e){
        this.NewProduct = false;
        this.setState({
            displayDialog:true,
            product: Object.assign({}, e.data),
            productStatus: {label: e.data['productStatus'], status: e.data['productStatus']},
            productType: {label: e.data['productType'], category: e.data['productType']},
            productDate: e.data['productDate']
        });
    }

    onProductStatusChange(e) {
        console.log(e.value)
        this.setState({productStatus: e.value});
        this.updateProperty('productStatus', e.value.status);
    }

    onProductTagsChange(e) {
        console.log(e.value)
        this.setState({productType: e.value});
        this.updateProperty('productType', e.value.category);
    }

    render() {
        const itemStatusOptions = [
            {label: 'Available', status: 'Available'},
            {label: 'Out of Stock', status: 'Out of Stock'},
            {label: 'Discontinue', status: 'Discontinue'}
        ];

        const itemTagsOptions = [
            {label: 'Geyser', category: 'Geyser'},
            {label: 'Stove', category: 'Stove'}
        ];

        let header = <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px'}}>
            <div style={{lineHeight: '30px'}}>Product(s) Information</div>
            <span className="p-input-icon-left">
                <i className="pi pi-search"></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Product(s)" size="50"/>
            </span>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" label="Add Product" icon="pi pi-plus" onClick={this.addNewProduct}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveProduct}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeProductDialog}/>
        </div>;

        return <div>
            <Navigation>
                <div className="content-section implementation">
                    <DataTable ref={this.productsDataTable} loading={false} value={this.state.products} paginator={true} rows={20} header={header} footer={footer}
                               scrollable={true} scrollHeight="700px" responsive={true}
                               selectionMode="none" selection={this.state.selectedProduct} onSelectionChange={e => this.setState({selectedProduct: e.value})}
                               globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                        <Column field="productName" header="Product Name" sortable={true} style={{width: '25%'}}/>
                        <Column field="productType" header="Product Type" sortable={true} style={{width: '25%'}}/>
                        <Column field="productModel" header="Product Model" sortable={true} style={{width: '19%'}}/>
                        <Column field="productQuantities" header="Product Quantity" sortable={true} style={{width: '19%'}}/>
                        <Column field="productPrice" header="Product Price" sortable={true} style={{width: '19%'}}/>
                        <Column field="productStatus" header="Product Status" sortable={true} style={{width: '19%'}}/>
                        <Column field="productDate" header="Product Date" body={this.dateFormatter} sortable={true} style={{width: '19%'}}/>
                        <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'products', this.state)} style={{width: '12%'}}/>
                    </DataTable>
                    <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Product Details"
                            modal={true} footer={dialogFooter} maximizable={true} maximized={true}
                            onShow={()=> this.refs['firstName']}
                            onHide={() => this.setState({displayDialog: false})}>
                        {
                            this.state.product &&
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <div className="p-col" style={{padding:'.75em'}}>
                                        <span className="p-float-label p-fluid">
                                            <InputText ref="productName" maxLength={255} onChange={(e) => {this.updateProperty('productName', e.target.value)}} value={this.state.product.productName}/>
                                            <label htmlFor="productName">Product Name</label>
                                        </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                        <span className="p-float-label p-fluid">
                                            <InputText ref="productModel" maxLength={500} onChange={(e) => {this.updateProperty('productModel', e.target.value)}} value={this.state.product.productModel}/>
                                            <label htmlFor="productModel">Product Model</label>
                                        </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                        <span className="p-float-label p-fluid">
                                            <InputText ref="productQuantities" maxLength={500}
                                                       onChange={(e) => {this.updateProperty('productQuantities', e.target.value)}}
                                                       onBlur={(e) => {this.updateProperty('productQuantities', this.Float(e.target.value))}}
                                                       value={this.state.product.productQuantities}/>
                                            <label htmlFor="productQuantities">Product Quantity</label>
                                        </span>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                        <span className="p-float-label p-fluid">
                                            <InputText ref="productPrice" maxLength={11}
                                                       onChange={(e) => {this.updateProperty('productPrice', e.target.value)}}
                                                       onBlur={(e) => {this.updateProperty('productPrice', this.Float(e.target.value))}}
                                                       value={this.state.product.productPrice}/>
                                            <label htmlFor="productPrice">Product Price</label>
                                        </span>
                                    </div>

                                    <div className="p-grid" style={{ paddingTop: '10px'}}>
                                        <div className="p-col-6 p-fluid" style={{padding:'.75em'}}>
                                            <Dropdown value={this.state.productType} options={itemTagsOptions} editable={true} onChange={this.onProductTagsChange} placeholder="Select Category" optionLabel="label"/>
                                        </div>
                                        <div className="p-col-6 p-fluid" style={{padding:'.75em'}}>
                                            <Dropdown value={this.state.productStatus} options={itemStatusOptions} editable={true} onChange={this.onProductStatusChange} placeholder="Select Item Status" optionLabel="label"/>
                                        </div>
                                    </div>

                                    <div className="p-col" style={{padding:'.75em'}}>
                                        <span className="p-float-label p-fluid">
                                            <Calendar id="productDate" hideOnDateTimeSelect={true} showTime={false} onChange={(e) => {this.updateProperty('productDate', e.target.value)}} value={this.state.product.productDate}/>
                                            <label htmlFor="productDate">Date</label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            </Navigation>
        </div>
    }
}
