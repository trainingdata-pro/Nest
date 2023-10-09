
import {toast} from "react-toastify";

export const errorNotification = (msg:string) => toast.error(msg, {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 2000,
    pauseOnHover: false,
    draggable: true,
});
export const successNotification = (msg:string) => toast.success(msg, {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 2000,
    pauseOnHover: false,
    draggable: true,
});
export const warnNotification = (msg:string) => toast.warn(msg, {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 2000,
    pauseOnHover: false,
    draggable: true,
});

