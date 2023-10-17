import React from 'react';
import MyInput from "../UI/MyInput";
import {useForm} from "react-hook-form";
import MyButton from "../UI/MyButton";
import Error from "../UI/Error";
import AssessorService from "../../services/AssessorService";
import {errorNotification} from "../UI/Notify";

interface FormProps{
    last_name: string,
    first_name: string,
    middle_name: string
}
const CheckAssessor = ({setIsOpenCheck}: {
    setIsOpenCheck: React.Dispatch<boolean>
}) => {
    const {register,getValues, formState:{
        errors
    }, handleSubmit} = useForm<FormProps>()
    const submit = () => {
        const {last_name, first_name, middle_name} = getValues()
        AssessorService.checkAssessor(last_name, first_name, middle_name).then(res => console.log(res.data)).catch(() => {
            errorNotification('Заполните все поля')
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <section className="flex justify-between my-2 space-x-2 box-border">
                    <div>
                        <MyInput register={{...register('last_name')}} type="text"
                                 name="last_name"
                                 placeholder="Фамилия"/>

                        <Error>{errors.last_name && errors.last_name?.message}</Error>
                    </div>
                    <div>
                        <MyInput
                            register={{...register('first_name')}}
                            type="text"
                            name="first_name"
                            placeholder="Имя"/>
                        <Error>{errors.first_name && errors.first_name?.message}</Error>
                    </div>
                    <div>

                        <MyInput
                            register={{...register('middle_name')}}
                            type="text"
                            name="middle_name"
                            placeholder="Отчество"/>
                        <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                    </div>
                </section>
                <MyButton>Проверить</MyButton>
            </form>
        </div>
    );
};

export default CheckAssessor;