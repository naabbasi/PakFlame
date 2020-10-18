import React from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {GenericComponent} from "../GenericComponent";

export class Item {}

export default class ItemAutoComplete extends GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            itemSuggestions: [],
            items: [],
            item: null
        };

        this.suggestItems = this.suggestItems.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
    }

    componentDidMount() {
        this.loadAllItems();
    }

    loadAllItems() {
        this.axios.get('/inventories')
            .then( response => {
                // handle success
                if(response.status === 200){
                    console.log(response.data);
                    this.setState({items: response.data});
                }
            }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    itemTemplate(item) {
        return (
            <div>{item.itemName} {item.quantities} - {item.itemStatus}</div>
        )
    }

    selectedInventoryItemTemplate(item) {
        return item.itemName;
    }

    suggestItems(event) {
        setTimeout(() => {
            let results = [];

            if (event.query.length === 0) {
                    results = [...this.state.items];
            } else {
                if(this.state.items.length !== 0) {
                    results = this.state.items.filter((item) => {
                        return item['itemName'].toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }
            this.setState({itemSuggestions: results});
        }, 250);
    }

    onSelectItem(event) {
        this.setState({item:  event.value});
        if(this.props.onChange === undefined) {
            console.log("Please add onChange() handler in parent");
            console.log(`<ItemAutoComplete ref={this.getItemAutoComplete} onChange={this.handler}></ItemAutoComplete>`);
            console.log(`handler(item) {
                this.setState({selectedItem: item});
            }`);
        } else {
            this.props.onChange(event.value);
        }
    }

    selectInventoryItem(item) {
        this.setState({item: item});
    }

    render() {
        return <div>
            <AutoComplete dropdown={true}  field="itemName"
                  placeholder="Please Select Item Name"
                  readonly={false}
                  maxLength={250} itemTemplate={this.itemTemplate} selectedItemTemplate={this.selectedInventoryItemTemplate}
                  value={this.state.item} onChange={(e) => this.onSelectItem(e)}
                  suggestions={this.state.itemSuggestions} completeMethod={this.suggestItems.bind(this)}
            />
            <span ref="itemId" style={{display: 'none'}}>{this.state.item ? this.state.item['id'] : 'None'} </span>
            <span ref="itemName" style={{display: 'none'}}>{this.state.item ? this.state.item['itemName'] : 'None'} </span>
            <span ref="itemStatus" style={{display: 'none'}}>{this.state.item ? this.state.item['itemStatus'] : 'None'} </span>
            <span ref="retailRate" style={{display: 'none'}}>{this.state.item ? this.state.item['retailRate'] : 'None'} </span>
            <span ref="quantities" style={{display: 'none'}}>{this.state.item ? this.state.item['quantities'] : 'None'} </span>
            <span ref="companyId" style={{display: 'none'}}>{this.state.item ? this.state.item['companyId'] : 'None'} </span>
        </div>
    }
}
