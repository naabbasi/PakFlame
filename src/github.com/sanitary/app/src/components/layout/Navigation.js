import React, {Component} from 'react';
import {Menubar} from "primereact/menubar";

export default class Navigation extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {
        const items = [
            {
                label: 'Customers',
                icon:'pi pi-fw pi-user',
                command:()=>{ window.location.hash="customers"; }
            },
            {
                label: 'Workers',
                icon:'pi pi-fw pi-user',
                command:()=>{ window.location.hash="workers"; }
            },
            {
                label:'Inventory',
                icon:'pi pi-fw pi-folder-open',
                command:()=>{ window.location.hash="inventory"; }
            },
            {
                label:'Logout',
                icon:'pi pi-fw pi-sign-out',
                command:()=>{ window.location.hash="logout"; }
            }
        ];

        return (
            <div>
                <div style={{width: '20%', float: 'right', lineHeight: '42px', textAlign: 'right', marginRight: '5px'}}>
                    <span className="pi pi-fw pi-user"></span>
                    <span>Abdul Waris</span>
                </div>
                <Menubar model={items}></Menubar>
                {this.props.children}
            </div>
        )
    }
}