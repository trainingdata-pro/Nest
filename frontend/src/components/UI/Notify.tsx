import {toast} from "react-toastify";
import React from "react";
const options = {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 5000,
    pauseOnHover: false,
    draggable: true,
}
export const errorNotification = (msg:string | React.ReactNode) => toast.error(msg, options);
export const successNotification = (msg:string | React.ReactNode) => toast.success(msg, options);
export const warnNotification = (msg:string | React.ReactNode) => toast.warn(msg, options);