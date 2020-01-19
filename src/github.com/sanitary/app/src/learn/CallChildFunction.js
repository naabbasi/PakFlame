import React from 'react';

const {forwardRef, useRef, useImperativeHandle, useState} = React;

const CallChildFunction = () => {
    const childRef = useRef();

    return (
        <div>
            <h2>I m parent component</h2>
            <button onClick={()=>{childRef.current.getAlert()}}>Click</button>
            <Child ref={childRef}></Child>
        </div>
    );
};

const Child = forwardRef((props, ref) =>{
    const {value, setValue} = useState("Noman");

    useImperativeHandle(ref, () => ({
       getAlert() {
           alert("Hello, I m called by parent")
       }
    }));

    return <h4>Child Component {value}</h4>
});

export default CallChildFunction;