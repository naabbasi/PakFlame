import React from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {GenericComponent} from "../GenericComponent";

export default class WorkerAutoComplete extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            workerSuggestions: [],
            workers: [],
            worker: null,
            disableWorkerAutoComplete: false,
            workerAutoCompleteLabel: "Please Select Worker Name"
        };

        this.suggestWorkers = this.suggestWorkers.bind(this);
        this.workerTemplate = this.workerTemplate.bind(this);
    }

    componentDidMount() {
        this.axios.get('/workers')
        .then( response => {
            // handle success
            if(response.status === 200){
                console.log(response.data);
                this.setState({workers: response.data});
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });

        if(this.props.disabled !== undefined) {
            this.setState({disableWorkerAutoComplete: this.props.disabled});
        }

        if(this.props.label !== undefined) {
            this.setState({workerAutoCompleteLabel: this.props.label});
        }
    }

    workerTemplate(worker) {
        return (
            <div>{worker.firstName} {worker.lastName}</div>
        )
    }

    selectedWorkerTemplate(worker) {
        return worker.firstName + " " + worker.lastName;
    }

    suggestWorkers(event) {
        setTimeout(() => {
            let results = [];

            if (event.query.length === 0) {
                    results = [...this.state.workers];
            } else {
                if(this.state.workers.length !== 0) {
                    results = this.state.workers.filter((worker) => {
                        return worker['firstName'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }
            this.setState({workerSuggestions: results});
        }, 250);
    }

    onSelectWorker(event) {
        this.setState({worker:  event.value});
        if(this.props.onChange === undefined) {
            console.log("Please add onChange() handler in parent");
            console.log(`<WorkerAutoComplete ref={this.getItemAutoComplete} onChange={this.handler}></WorkerAutoComplete>`);
            console.log(`handler(worker) {
                this.setState({selectedWorker: worker});
            }`);
        } else {
            this.props.onChange(event.value);
        }
    }

    selectWorker(worker) {
        this.setState({worker: worker});
    }

    render() {
        return <div>
            <AutoComplete dropdown={true} disabled={this.state.disableWorkerAutoComplete} field="firstName"
                  placeholder={this.state.workerAutoCompleteLabel}
                  readonly={false}
                  maxLength={250} itemTemplate={this.workerTemplate} selectedItemTemplate={this.selectedWorkerTemplate}
                  value={this.state.worker} onChange={(e) => this.onSelectWorker(e)}
                  suggestions={this.state.workerSuggestions} completeMethod={this.suggestWorkers.bind(this)}
            />
        </div>
    }
}
