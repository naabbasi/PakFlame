import React from "react";
import {GenericComponent} from "../GenericComponent";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export default class PaymentComponent extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            payment: {},
            payments: [],
            showDialog: false
        };

        this.newPayment = true;
        this.savePayment = this.savePayment.bind(this);
    }

    componentDidMount() {
    }

    updateProperty(property, value) {
        let payment = this.state.payment;
        payment[property] = value;
        this.setState({payment: payment});
    }

    getPaymentsByEntityId(entityId) {
        console.log(`Load payments against entity Id: ${entityId}`);
        // Make a request for a payments
        this.axios.get(`/payments/${entityId}`)
        .then( response => {
            // handle success
            if(response.status === 200){
                let payment = {entityId: entityId, amount: 0, remaining: 0, total: 0, createdAt: new Date()};
                this.setState({payments: response.data, payment: payment});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    savePayment() {
        if(this.newPayment){
            this.axios.post('/payments', this.state.payment)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        this.getPaymentsByEntityId(this.state.payment['entityId']);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        } else{
            this.axios.put('/payments',this.state.payment)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({payments: null, selectedPayment:null, payment: null, displayDialog:false});
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deletePayment(entityName, entityId, paymentId) {
        this.axios.delete(`/payments/${entityId}/${paymentId}`)
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 204){
                this.getPaymentsByEntityId(entityId);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    render() {
        return <div>
            {
                this.state.payment &&
                <div>
                    <div className="p-col-12">
                        <div className="p-grid">
                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="amount" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('amount', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('amount', this.Float(e.target.value))}}
                                               value={this.state.payment.amount}/>
                                    <label htmlFor="amount">{this.props.type === 'customer' ? 'Received Amount' : 'Paid Amount'}</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="remaining" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('remaining', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('remaining', this.Float(e.target.value))}}
                                               value={this.state.payment.remaining}/>
                                    <label htmlFor="remaining">{this.props.type === 'customer' ? 'Receivable Amount' : 'Payable Amount'}</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <InputText id="total" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('total', e.target.value)}}
                                               onBlur={(e) => {this.updateProperty('total', this.Float(e.target.value))}}
                                               value={this.state.payment.total}/>
                                    <label htmlFor="total">Total Amount</label>
                                </span>
                            </div>

                            <div className="p-col-6" style={{padding:'.75em'}}>
                                <span className="p-float-label p-fluid">
                                    <span className="p-float-label p-fluid">
                                        <Calendar showIcon={true} hideOnDateTimeSelect={true} showTime={true} onChange={(e) => {this.updateProperty('createdAt', e.target.value)}} value={this.state.payment.createdAt}/>
                                        <label htmlFor="createdAt">Date</label>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-col-12">
                        <div style={{textAlign: 'right', width: '100%'}}>
                            <Button label="Save Payment" icon="pi pi-save" className="p-button-rounded" onClick={this.savePayment}/>
                            <Button label="Back" className="p-button-rounded" onClick={()=>{
                                if(this.props.type === 'customer'){
                                    window.location.hash = '#/customers';
                                } else if(this.props.type === 'worker'){
                                    window.location.hash = '#/workers';
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="p-col-12">
                        <div className="p-grid">
                            <div className="p-col p-fluid" style={{padding:'.5em'}}>
                                <DataTable value={this.state.payments} paginator={true} rows={25}
                                           scrollable={true} scrollHeight="200px"
                                           selectionMode="none" selection={this.state.selectedInventory}
                                           onSelectionChange={e => this.setState({selectedInventory: e.value})}
                                           onRowSelect={this.onInventorySelect} emptyMessage="No record(s) found">

                                    <Column field="amount" header={this.props.type === 'customer' ? 'Received Amount' : 'Paid Amount'} sortable={true} style={{textAlign: 'right'}}/>
                                    <Column field="remaining" header={this.props.type === 'customer' ? 'Receivable Amount' : 'Payable Amount'} sortable={true} style={{textAlign: 'right'}}/>
                                    <Column field="total" header="Total Amount" sortable={true}/>
                                    <Column field="createdAt" header="Date" body={this.dateFormatter} sortable={true} style={{textAlign: 'right'}}/>
                                    <Column header="Action" body={(rowData, column)=> this.deleteActionColumn(rowData, column, 'payments', this.state)} style={{width: '12%'}}/>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    }
}
