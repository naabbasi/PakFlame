import React from 'react';
import {Menubar} from "primereact/menubar";
import {GenericComponent} from "../GenericComponent";

export default class Navigation extends GenericComponent {
    render() {
        const items = [
            {
                label: 'Dashboard',
                icon:'pi pi-fw pi-home',
                command:()=>{ window.location.hash="dashboard"; },
            },
            {
                label:'Manage Inventory',
                icon:'pi pi-fw pi-file',
                items: [
                    {
                        label:'Warehouses',
                        icon:'pi pi-sitemap',
                        command:()=>{ window.location.hash="warehouses"; },
                    },
                    {
                        label:'Companies',
                        icon:'pi pi-fw pi-user',
                        command:()=>{ window.location.hash="companies"; },
                    },{
                        label:'Stock Inventory',
                        icon:'pi pi-fw pi-file',
                        command:()=>{ window.location.hash="inventory"; },
                        items: [
                            {
                                label:'Issue Stock Inventory',
                                command:()=>{ window.location.hash="issue_inventory"; }
                            }
                        ]
                    },{
                        label:'Products',
                        icon:'pi pi-th-large',
                        command:()=>{ window.location.hash="products"; },
                        /*items: [
                            {
                                label:'Geyser',
                                icon:'pi pi-fw pi-folder-open',
                                command:()=>{ window.location.hash="geyser"; }
                            },
                            {
                                label:'Stove',
                                icon:'pi pi-fw pi-folder-open',
                                command:()=>{ window.location.hash="stove"; }
                            }
                        ]*/
                    }
                ]
            },
            {
                label:'Bills',
                icon:'pi pi-shopping-cart',
                items: [
                    {
                        label:'Show All Bills',
                        icon:'pi pi-money-bill',
                        command:()=>{ window.location.hash="invoices/all"; }
                    },
                    {
                        label:'Create Bill',
                        icon:'pi pi-money-bill',
                        command:()=>{ window.location.hash="invoices/product_invoice"; }
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
