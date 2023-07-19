import React, {FC, useContext} from 'react';
import {Context} from "../../index";
import {IManager} from "../../models/ManagerResponse";



// @ts-ignore
const Owner= ({manager}) => {
    const {store} = useContext(Context)
    return (
        <div
            className="items-center border mr-0 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex max-w-fit gap-x-2 bg-white pl-1">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                <span
                    className="flex justify-center h-full w-full items-center rounded-full bg-muted text-foreground">{manager.first_name.charAt(0)}{manager.last_name.charAt(0)}</span>
            </span>
            <p>{manager.last_name} {manager.first_name}</p></div>
    );
};

export default Owner;