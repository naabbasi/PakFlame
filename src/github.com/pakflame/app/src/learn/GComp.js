import React, {Component} from 'react';
import ItemAutoComplete from "../components/autocomplete/ItemAutoComplete";

export default class GComp extends Component {
    constructor(props) {
        super(props);
        this.getItemAutoComplete = React.createRef();
        this.state = {
            selectedItem: {id: '', itemName: '', itemStatus: '', retailRate: 0, quantities: 0, companyId: ''}
        }

        this.handler = this.handler.bind(this);
    }

    getSelectedITem() {
        this.setState({selectedItem: {
            id: this.getItemAutoComplete.current.refs['itemId'].innerHTML,
            itemName: this.getItemAutoComplete.current.refs['itemName'].innerHTML,
            itemStatus: this.getItemAutoComplete.current.refs['itemStatus'].innerHTML,
            retailRate: this.getItemAutoComplete.current.refs['retailRate'].innerHTML,
            quantities: this.getItemAutoComplete.current.refs['quantities'].innerHTML,
            companyId: this.getItemAutoComplete.current.refs['companyId'].innerHTML,
        }});
    }

    handler(item) {
        console.log("item by parent: ");
        console.log(item);
        this.setState({selectedItem: item});
    }

    render() {
        return <div>
            <ItemAutoComplete ref={this.getItemAutoComplete} onChange={this.handler}></ItemAutoComplete>
            <button onClick={this.getSelectedITem.bind(this)}>Get Selected Item</button>
            <br/><span>{this.state.selectedItem['id']}</span>
            <br/><span>{this.state.selectedItem['itemName']}</span>
            <br/><span>{this.state.selectedItem['itemStatus']}</span>
            <br/><span>{this.state.selectedItem['retailRate']}</span>
            <br/><span>{this.state.selectedItem['quantities']}</span>
            <br/><span>{this.state.selectedItem['companyId']}</span>
        </div>
    }
}
