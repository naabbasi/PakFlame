import React from 'react';
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Dropdown} from "primereact/dropdown";

export default class Worker extends GenericComponent {

    constructor(props) {
        super(props);
        this.state = {
            eventWorkerData: {},
            askReasonDialog: false,
            workingStatus: ''
        };
        this.saveWorker = this.saveWorker.bind(this);
        this.deleteWorker = this.deleteWorker.bind(this);
        this.closeWorkerDialog = this.closeWorkerDialog.bind(this);
        this.onWorkerSelect = this.onWorkerSelect.bind(this);
        this.onWorkingStatusChange = this.onWorkingStatusChange.bind(this);
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

    saveWorker() {
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

    deleteWorker(workerId) {
        this.axios.delete(`/workers/${workerId}`)
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

    closeWorkerDialog() {
        this.setState({selectedWorker:null, worker: null, displayDialog:false});
    }

    updateProperty(property, value) {
        let worker = this.state.worker;
        worker[property] = value;
        this.setState({worker: worker});
    }

    onWorkerSelect(e){
        this.setState({eventWorkerData: e.data, askReasonDialog: true});
    }

    editWorker(){
        this.newWorker = false;
        this.setState({
            displayDialog:true,
            askReasonDialog: false,
            worker: Object.assign({}, this.state.eventWorkerData),
            workingStatus: {label: this.state.eventWorkerData['workingStatus'], status: this.state.eventWorkerData['workingStatus']}
        });
    }

    addNew() {
        this.newWorker = true;
        this.setState({
            worker: {firstName: '', lastName: '', mobileNumber: '', address: '', workingStatus: ''},
            displayDialog: true
        });
    }

    addNewPaymentForWorker() {
        console.log(this.state.eventWorkerData)
        window.location.hash = `#/workers/details?id=${this.state.eventWorkerData['id']}`;
    }

    onWorkingStatusChange(e) {
        console.log(e.value)
        this.setState({workingStatus: e.value});
        this.updateProperty('workingStatus', e.value.status);
    }

    render() {
        const workingStatusOptions = [
            {label: 'Working', status: 'Working'},
            {label: 'Joining', status: 'Joining'},
            {label: 'Left', status: 'Left'},
            {label: 'Terminate', status: 'Terminate'},
        ];

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
            <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveWorker}/>
            <Button label="Delete" icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={this.deleteWorker}/>
            <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeWorkerDialog}/>
        </div>;

        let askReasonFooterWorker = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} label="Edit Worker" icon="pi pi-plus" onClick={this.editWorker.bind(this)}/>
            <Button style={{float:'left'}} label="Manage Payment" icon="pi pi-plus" onClick={this.addNewPaymentForWorker.bind(this)}/>
        </div>;

        return (
            <div>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable value={this.state.workers} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px"
                                   selectionMode="none" selection={this.state.selectedWorker} onSelectionChange={e => this.setState({selectedWorker: e.value})}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="firstName" header="First Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="lastName" header="Last Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="mobileNumber" header="Mobile #" sortable={true} style={{textAlign: 'center', width: '14%'}}/>
                            <Column field="address" header="Address" sortable={true} style={{textAlign: 'left', width: '25%'}}/>
                            <Column field="workingStatus" header="Status" sortable={true} style={{textAlign: 'center', width: '11%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'workers', this.state, 'Manage')} style={{width: '12%'}}/>
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
                                                <Dropdown value={this.state.workingStatus} options={workingStatusOptions} onChange={this.onWorkingStatusChange} placeholder="Select Worker Status" optionLabel="label"/>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Dialog>
                        <Dialog visible={this.state.askReasonDialog} header="Please confirm"
                                footer={askReasonFooterWorker}
                                onHide={()=>{this.setState({askReasonDialog: false})}}>
                            <div>What do you want to do?</div>
                        </Dialog>
                    </div>
                </Navigation>
            </div>
        );
    }
}
