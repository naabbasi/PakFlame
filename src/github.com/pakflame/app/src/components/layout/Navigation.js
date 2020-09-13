import React from 'react';
import {Menubar} from "primereact/menubar";
import {GenericComponent} from "../GenericComponent";

export default class Navigation extends GenericComponent {
    render() {
        const items = [
            {
                label: 'Dashboard',
                icon:'pi pi-fw pi-users',
                command:()=>{ window.location.hash="dashboard"; },
            },
            {
                label:'Manage Inventory',
                icon:'pi pi-fw pi-folder-open',
                items: [
                    {
                        label:'Warehouses',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="warehouses"; },
                    },
                    {
                        label:'Companies',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="companies"; },
                    },{
                        label:'Inventory',
                        icon:'pi pi-fw pi-folder-open',
                        command:()=>{ window.location.hash="inventory"; }
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
                label: 'Customers',
                icon:'pi pi-fw pi-users',
                command:()=>{ window.location.hash="customers"; },
            },
            {
                label: 'Workers',
                icon:'pi pi-fw pi-users',
                align: 'right',
                command:()=>{ window.location.hash="workers"; }
            },
            /*{
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
            },*/
            {
                label:'Logout',
                icon:'pi pi-fw pi-sign-out',
                command:()=>{ window.location.hash="logout"; }
            }
        ];

        let userInfo = JSON.parse(window.localStorage.getItem("isLoggedIn"));
        return (
            <div>
                <Menubar model={items} responsive={true}>
                    <div style={{float: 'right', lineHeight: '42px', textAlign: 'right', marginRight: '5px'}}>
                        <span className="pi pi-fw pi-bell"></span>
                        <span className="pi pi-fw pi-user"></span>
                        <span>{userInfo == null ? "" : userInfo['firstName']}</span>
                    </div>
                </Menubar>
                {this.props.children}
            </div>
        )
    }
}
