import React from 'react';
import MyInput from "../UI/MyInput";
import {useForm} from "react-hook-form";
import MyButton from "../UI/MyButton";

interface FormProps{
    last_name: string,
    first_name: string,
    middle_name: string
}
const CheckAssessor = ({setIsOpenCheck}: {
    setIsOpenCheck: React.Dispatch<boolean>
}) => {
    const {register,getValues, handleSubmit} = useForm<FormProps>()
    const submit = () => {
        console.log(getValues())
    }
    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <MyInput register={{...register('last_name')}}/>
                <MyInput register={{...register('first_name')}}/>
                <MyInput register={{...register('middle_name')}}/>
                <MyButton>Проверить</MyButton>
            </form>
        </div>
    );
};

export default CheckAssessor;