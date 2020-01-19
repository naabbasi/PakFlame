import React, {Component} from 'react';
import {Menubar} from "primereact/menubar";
import {GenericComponent} from "../GenericComponent";

export default class Navigation extends GenericComponent {
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
                //command:()=>{ window.location.hash="customers"; },
                items: [
                    {
                        label:'Customer',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="customers"; },
                    },{
                        label:'Customer Details',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="customers/details"; }
                    }
                ]
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
                label:'GComp',
                icon:'pi pi-fw pi-folder-open',
                items: [
                    {
                        label:'Auto Complete',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="gcomp"; },
                    },{
                        label:'Call Child Func Frm Parent',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="learn/callchildfunctionfrmparent"; }
                    }
                ]
            },
            {
                label:'Invoices',
                icon:'pi pi-fw pi-folder-open',
                items: [
                    {
                        label:'Show All Invoices',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="invoices/all"; }
                    },
                    {
                        label:'Invoice',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="invoices/invoice"; }
                    }
                ]
            },
            {
                label:'Logout',
                icon:'pi pi-fw pi-sign-out',
                command:()=>{ window.location.hash="logout"; }
            }
        ];

        let userInfo = JSON.parse(window.localStorage.getItem("isLoggedIn"));
        return (
            <div>
                <Menubar model={items}>
                    <div style={{float: 'right', lineHeight: '42px', textAlign: 'right', marginRight: '5px'}}>
                        <span className="pi pi-fw pi-user"></span>
                        <span>{userInfo['firstName']}</span>
                    </div>
                </Menubar>
                {this.props.children}
            </div>
        )
    }
}
