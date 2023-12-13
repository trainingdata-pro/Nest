import React, {ReactNode} from 'react';
import MiniLoader from "../../../UI/MiniLoader";
import {UseFormHandleSubmit} from "react-hook-form";
import {PersonalTableProps} from "./queries";


interface IForm {
    submit: () => void,
    handleSubmit: UseFormHandleSubmit<PersonalTableProps>,
    children: ReactNode

}
interface CellProps {
    name: string,
    children: React.ReactNode
    isLoading: boolean
}

const Form = ({children, handleSubmit, submit}: IForm) => {
    return (<form className='flex flex-row bg-white basis-full' onSubmit={handleSubmit(submit)}>
        {children}
    </form>)
}
const FormCell = ({name, children, isLoading}: CellProps) => {
    return (
        <div className={`flex flex-col border-r border-black ${name === 'Страна' ? 'basis-1/12' : 'basis-2/12'}`}>
            <label className='text-center font-[18px] border-b border-black bg-[#E7EAFF] py-2'>{name}</label>
            <div className="text-center whitespace-nowrap py-[10px]">
                {isLoading ? <MiniLoader size={15}/> : children}
            </div>
        </div>
    )
}
const FormInput = ({isDisabled, register}: {
    isDisabled: boolean,
    register: any
}) => {
    return <input disabled={isDisabled}
                  className="w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register}/>

}
Form.FormCell = FormCell
Form.FormInput = FormInput

export default Form;