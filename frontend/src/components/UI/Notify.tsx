import {toast} from "react-toastify";
const options = {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 5000,
    pauseOnHover: false,
    draggable: true,
}
export const errorNotification = (msg:string) => toast.error(msg, options);
export const successNotification = (msg:string) => toast.success(msg, options);
export const warnNotification = (msg:string) => toast.warn(msg, options);