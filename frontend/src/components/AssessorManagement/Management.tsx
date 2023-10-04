import React from 'react';
import Dialog from "../UI/Dialog";
import FreeResourse from "./FreeResourse";

// @ts-ignore
const Management = ({assessorId, isOpen, setIsOpen}) => {
    return (
        <Dialog isOpen={true} setIsOpen={setIsOpen}>
            <FreeResourse assessorId={assessorId}/>
        </Dialog>
    );
};

export default Management;