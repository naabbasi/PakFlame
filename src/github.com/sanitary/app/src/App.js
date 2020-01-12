import React, {Component, lazy, Suspense} from 'react';
import { HashRouter as HashRouter, BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import './App.css';

import {Lightbox} from "primereact/lightbox";
import {Card} from "primereact/card";
import GComp from "./components/GComp";

const Login = lazy(() => import ("./components/user/Login"));
const SignUp = lazy(() => import ("./components/user/SignUp"));
const Customer = lazy(() => import ("./components/Customer"));
const Invoices = lazy(() => import ("./components/invoices/Invoices"));
const Invoice = lazy(() => import ("./components/invoices/Invoice"));
const Worker = lazy(() => import ("./components/Worker"));
const Inventory = lazy(() => import ("./components/Inventory"));
const ItemAutoComplete = lazy(() => import ("./components/autocomplete/ItemAutoComplete"));

function usePageViews() {
    let location = useLocation();
    React.useEffect(() => {
        console.log(location.pathname);
    }, [location]);
}

class NotFound extends Component {
    render() {
        return <div style={{position: 'absolute', width: '100%', height: '100%', textAlign: 'center'}}>
            <h4>Page not found !!!</h4>
            Click here to <a href="/">Home</a>
        </div>
    }
}

const Logout = (()=>{
    window.localStorage.clear();
    window.location.hash = '#/';
    return <div>
    </div>
});

/*const NotFound = ( ()=>{
    return (<div>Noman</div>)
});*/

function App() {
    //usePageViews();
    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={WaitingComponent(Login)}></Route>
                    <Route exact path="/signup" component={WaitingComponent(SignUp)}></Route>
                    <Route exact path="/dashboard" component={WaitingComponent(Login)}></Route>
                    <Route exact path="/customers" component={WaitingComponent(Customer)}></Route>
                    <Route exact path="/workers" component={WaitingComponent(Worker)}></Route>
                    <Route exact path="/gcomp" component={WaitingComponent(GComp)}></Route>
                    <Route path="/inventory" component={WaitingComponent(Inventory)}></Route>
                    <Route path="/invoices/all" component={WaitingComponent(Invoices)}></Route>
                    <Route path="/invoices/invoice" component={WaitingComponent(Invoice)}></Route>
                    <Route path="/logout" component={Logout}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
            </HashRouter>
        </div>
    )
}

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={
            <div style={{top: '25%', color: '#fff', textAlign: 'center', position: 'absolute', width: '100%', height: '100%'}}>
                <Card title="AbuZar Traders" subTitle="Please wait ..." className="ui-card-shadow">
                </Card>
            </div>
        }>
            <Component {...props} />
        </Suspense>
    );
}

export default App;
