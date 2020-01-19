import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";

export default class Worker extends GenericComponent {

    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.close = this.close.bind(this);
        this.onWorkerSelect = this.onWorkerSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        this.getWorkers();
    }

    getWorkers() {
        // Make a request for a workers
        this.axios.get('/workers')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({workers: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    save() {
        if(this.newWorker){
            this.axios.post('/workers', this.state.worker)
            .then( response => {
                // handle success
                if(response.status === 201){
                    this.setState({workers: null, selectedWorker:null, worker: null, displayDialog:false});
                    this.getWorkers();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
        else{
            this.axios.put('/workers',this.state.worker)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 202){
                    this.setState({workers: null, selectedWorker:null, worker: null, displayDialog:false});
                    this.getWorkers();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        }
    }

    delete() {
        this.axios.delete('/workers', { data: { ...this.state.selectedWorker}})
        .then( response => {
            // handle success
            console.log(response);
            if(response.status === 204){
                this.setState({workers: null, selectedWorker:null, worker: null, displayDialog:false});
                this.getWorkers();
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    close() {
        this.setState({selectedWorker:null, worker: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let worker = this.state.worker;
        worker[property] = value;
        this.setState({worker: worker});
    }

    onWorkerSelect(e){
        this.newWorker = false;
        this.setState({
            displayDialog:true,
            worker: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newWorker = true;
        this.setState({
            worker: {firstName: '', lastName: '', mobileNumber: '', address: '', status: '', amount: 0, remaining: 0, total: 0},
            displayDialog: true
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>
            <div style={{float: 'left'}}>Workers Information</div>
            <div style={{'textAlign':'left', float: 'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Worker(s)" size="50"/>
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
                        <DataTable value={this.state.workers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="single" selection={this.state.selectedWorker} onSelectionChange={e => this.setState({selectedWorker: e.value})}
                                   onRowSelect={this.onWorkerSelect}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstName" header="First Name" sortable={true} />
                            <Column field="lastName" header="Last Name" sortable={true} />
                            <Column field="mobileNumber" header="Mobile Number" sortable={true} />
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'center'}} />
                            <Column field="status" header="Status" sortable={true} style={{textAlign: 'center'}} />
                            <Column field="amount" header="Amount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="remaining" header="Remaining Amount" sortable={true} style={{textAlign: 'center'}}/>
                            <Column field="total" header="Total Amount" sortable={true} style={{textAlign: 'center'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Worker Details"
                                modal={true} footer={dialogFooter}
                                onShow={()=> this.refs['firstName']}
                                onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.worker &&
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="firstName" maxLength={255} onChange={(e) => {this.updateProperty('firstName', e.target.value)}} value={this.state.worker.firstName}/>
                                                <label htmlFor="firstName">First Name</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="lastName" maxLength={255} onChange={(e) => {this.updateProperty('lastName', e.target.value)}} value={this.state.worker.lastName}/>
                                                <label htmlFor="lastName">Last Name</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="mobileNumber" maxLength={11} onChange={(e) => {this.updateProperty('mobileNumber', e.target.value)}} value={this.state.worker.mobileNumber}/>
                                                <label htmlFor="mobileNumber">Mobile Number</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="address" maxLength={500} onChange={(e) => {this.updateProperty('address', e.target.value)}} value={this.state.worker.address}/>
                                                <label htmlFor="address">Address</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText ref="status" maxLength={255} onChange={(e) => {this.updateProperty('status', e.target.value)}} value={this.state.worker.status}/>
                                                <label htmlFor="status">Status</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="amount" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('amount', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('amount', this.Float(e.target.value))}}
                                                           value={this.state.worker.amount}/>
                                                <label htmlFor="amount">Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="remaining" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('remaining', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('remaining', this.Float(e.target.value))}}
                                                           value={this.state.worker.remaining}/>
                                                <label htmlFor="remaining">Remaining Amount</label>
                                            </span>
                                        </div>

                                        <div className="p-col" style={{padding:'.75em'}}>
                                            <span className="p-float-label p-fluid">
                                                <InputText id="total" maxLength={10} keyfilter="num" onChange={(e) => {this.updateProperty('total', e.target.value)}}
                                                           onBlur={(e) => {this.updateProperty('total', this.Float(e.target.value))}}
                                                           value={this.state.worker.total}/>
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
