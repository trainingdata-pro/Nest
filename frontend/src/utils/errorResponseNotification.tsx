import {ASSESSOR_INFO_ERRORS, T} from "../assets/consts";
import {errorNotification} from "../components/UI/Notify";
import React from "react";

export const notifyError = (error: T) => {
    const errors = error.response ? error.response.data : {} as typeof error
    const notify = <div>{(Object.keys(errors) as Array<keyof typeof errors>).map(key => <p key={key}>{`${ASSESSOR_INFO_ERRORS[key]}: ${Array.isArray(errors[key]) ? errors[key][0] : errors[key]}`}</p>)}</div>;
    errorNotification(notify)
}