import React from 'react';

import {GenericComponent} from "../GenericComponent";
import Navigation from "../layout/Navigation";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import ItemAutoComplete from "../autocomplete/ItemAutoComplete";
import WorkerAutoComplete from "../autocomplete/WorkerAutoComplete";

export default class IssueInventory extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            issueInventories: [],
            issueInventory: {}
        }

        this.newIssueInventory = this.newIssueInventory.bind(this);
        this.saveIssueInventory = this.saveIssueInventory.bind(this);
        this.closeIssueInventoryDialog = this.closeIssueInventoryDialog.bind(this);

        this.getSelectedIssueItem = this.getSelectedIssueItem.bind(this);
        this.getSelectedWorker = this.getSelectedWorker.bind(this);
        this.getSelectedIssuer = this.getSelectedIssuer.bind(this);

        //create reference
        this.issueItemAutoComplete = React.createRef();
        this.workerAutoComplete = React.createRef();
        this.issuerAutoComplete = React.createRef();
    }

    async componentDidMount() {
        this.getIssueInventory();
    }

    getIssueInventory() {
        // Make a request for a issue_inventory
        this.axios.get('/issue_inventory')
        .then( response => {
            // handle success
            if(response.status === 200){
                this.setState({issueInventories: response.data});
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    saveIssueInventory() {
        if(this.IssueInventory){
            delete this.state.issueInventory['id'];
            this.axios.post('/issue_inventory', this.state.issueInventory)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 201){
                        this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                        this.getIssueInventory();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else{
            this.axios.put('/issue_inventory',this.state.issueInventory)
                .then( response => {
                    // handle success
                    console.log(response);
                    if(response.status === 202){
                        this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                        this.getIssueInventory();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    deleteIssueInventory(issuedInventoryId) {
        this.axios.delete(`/issue_inventory/${issuedInventoryId}`)
            .then( response => {
                // handle success
                console.log(response);
                if(response.status === 204){
                    this.setState({issueInventories: null, issueInventory: null, displayDialog:false});
                    this.getIssueInventory();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    closeIssueInventoryDialog() {
        this.setState({issueInventory: null, displayDialog:false});
    }

    newIssueInventory() {
        this.IssueInventory = true;
        this.setState({
            issueInventory: {itemId: '', itemName: '', quantities: 0, workerId: '', workerName: '', issuerId: '', issuerName: '', companyId: ''},
            displayDialog: true
        });
    }

    updateProperty(property, value) {
        let issueInventory = this.state.issueInventory;
        issueInventory[property] = value;
        this.setState({issueInventory: issueInventory});
    }

    getSelectedIssueItem(item) {
        let issueInventory = {...this.state.issueInventory};
        issueInventory['itemId'] = item.id;
        issueInventory['itemName'] = item.itemName;
        issueInventory['quantities'] = item.quantities;
        issueInventory['companyId'] = item.companyId;

        setTimeout(()=>{
            this.setState({issueInventory});
        });
    }

    getSelectedWorker(worker) {
        let issueInventory = {...this.state.issueInventory};
        issueInventory['workerId'] = worker.id;
        issueInventory['workerName'] = worker.firstName;

        setTimeout(()=>{
            this.setState({issueInventory});
        });
    }

    getSelectedIssuer(issuer) {
        let issueInventory = {...this.state.issueInventory};
        issueInventory['issuerId'] = issuer.id;
        issueInventory['issuerName'] = issuer.firstName;

        setTimeout(()=>{
            this.setState({issueInventory});
        });
    }

    onIssuedInventorySelect(e){
        this.issueItemAutoComplete = React.createRef();
        this.issuerAutoComplete = React.createRef();
        this.workerAutoComplete = React.createRef();

        setTimeout(()=>{
            this.setState({
                displayDialog:true,
                issueInventory: Object.assign({}, e.data)
            });

            this.issueItemAutoComplete.current.selectInventoryItem(this.state.issueInventory);
            this.issuerAutoComplete.current.selectWorker({firstName: e.data['issuerName']});
            this.workerAutoComplete.current.selectWorker({firstName: e.data['workerName']});
        },1000);
    }

    render() {
        let header = <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px'}}>
            <div style={{lineHeight: '30px'}}>Issued Inventory Information</div>
            <span className="p-input-icon-left">
                <i className="pi pi-search"></i>
                <InputText type="search" maxLength={255} onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Issued Inventory" size="50"/>
            </span>
        </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button className="p-button-rounded" label="Issue Inventory" icon="pi pi-plus" onClick={this.newIssueInventory}/>
        </div>;

        let dialogFooter = <div className="p-grid p-align-center" style={{ paddingTop: '10px'}}>
            <div style={{textAlign: 'right', width: '100%'}}>
                <Button label="Save/Update" icon="pi pi-save" className="p-button-rounded" onClick={this.saveIssueInventory}/>
                <Button label="Close" icon="pi pi-sign-out" className="p-button-rounded" onClick={this.closeIssueInventoryDialog}/>
            </div>
        </div>;

        return (
            <>
                <Navigation>
                    <div className="content-section implementation">
                        <DataTable id="issueInventoryTable" value={this.state.issueInventories} paginator={true} rows={25}  header={header} footer={footer}
                                   scrollable={true} scrollHeight="700px" responsive={true}
                                   selectionMode="none" onSelectionChange={e => this.setState({selectedCustomer: e.value})}
                                   globalFilter={this.state.globalFilter} emptyMessage="No record(s) found">
                            <Column field="itemName" header="Item Name" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="quantities" header="Quantities" sortable={true} style={{textAlign: 'left', width: '15%'}}/>
                            <Column field="issuerName" header="Issued By" sortable={true} style={{textAlign: 'center', width: '14%'}}/>
                            <Column field="workerName" header="Received By" sortable={true} style={{textAlign: 'center', width: '10%'}}/>
                            <Column header="Action" body={(rowData, column)=> this.actionColumn(rowData, column, 'issueInventory', this.state)} style={{width: '12%'}}/>
                        </DataTable>

                        <Dialog visible={this.state.displayDialog} style={{width: '50%'}} header="Issued Inventory Details"
                                modal={true} maximizable={true} maximized={true} footer={dialogFooter}
                                onHide={() => this.setState({displayDialog: false})}>
                            {
                                this.state.issueInventory &&
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                               <span className="p-float-label p-fluid">
                                                   {/*prop value is being used b/c component on dialog doesn't have ref.
                                                   refs are not available b/c component is on diloag and being initialized while opening dialog*/}
                                                    <ItemAutoComplete ref={this.issueItemAutoComplete} onChange={this.getSelectedIssueItem}></ItemAutoComplete>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <InputText ref="quantities" maxLength={255}
                                                               onChange={(e) => {this.updateProperty('quantities', this.Int(e.target.value), true)}}
                                                               value={this.state.issueInventory.quantities}/>
                                                    <label htmlFor="quantities">Quantities</label>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-grid" style={{ paddingTop: '10px'}}>
                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <WorkerAutoComplete ref={this.issuerAutoComplete} onChange={this.getSelectedIssuer}></WorkerAutoComplete>
                                                </span>
                                            </div>

                                            <div className="p-col-6" style={{padding:'.75em'}}>
                                                <span className="p-float-label p-fluid">
                                                    <WorkerAutoComplete ref={this.workerAutoComplete} onChange={this.getSelectedWorker}></WorkerAutoComplete>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Dialog>
                    </div>
                </Navigation>
            </>
        )
    }
}
