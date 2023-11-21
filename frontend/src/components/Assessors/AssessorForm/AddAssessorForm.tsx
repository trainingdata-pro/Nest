import React, {Dispatch, useContext} from 'react';
import {useForm} from "react-hook-form";
import {Context} from "../../../index";
import MyLabel from "../../UI/MyLabel";
import MyInput from "../../UI/MyInput";
import Error from "../../UI/Error";
import Select from "react-select";
import {AtSymbolIcon} from '@heroicons/react/24/solid';
import MyButton from "../../UI/MyButton";
import {useAssessorCountry, useAssessorManager, useAssessorProject, useAssessorStatus} from "./hooks";
import {useCreateAssessor, useFetchAvailableProjects, useFetchManagerProjects} from "./queries";
import {Project} from "../../../models/ProjectResponse";


interface FormProps {
    last_name: string,
    first_name: string
    middle_name: string,
    username: string,
    projects: number,
    manager: number,
    status: string,
    country: string,
    email: string
}

const FormSection = ({children}: { children: React.ReactNode }) => {
    return <div className="mb-2">{children}</div>
}


const AddAssessorForm = ({project, setShowSidebar, isOpenModal}: {
        setShowSidebar: any,
        project: Project | undefined,
    isOpenModal: Dispatch<boolean>
    }) => {
        const {store} = useContext(Context)
        const {availableProjects} = useFetchAvailableProjects()
        const {register, setValue, getValues, formState: {errors}, handleSubmit} = useForm<FormProps>({
            defaultValues: {
                manager: store.user_data.is_teamlead ? project?.manager[0].id : store.user_id,
                projects: project?.id
            }
        })
        const {createAssessor} = useCreateAssessor({setShowSidebar:isOpenModal, getValues:getValues})

        const {fetchTeam, onManagerChange, getManager} = useAssessorManager({setValue})
        const {statusObject, handlerChangeStatus, handlerValueStatus} = useAssessorStatus({setValue})
        const {countryObject, handlerChangeCountry, handlerValueCountry} = useAssessorCountry({setValue})
        const {handlerValueProjects, handlerChangeProjects} = useAssessorProject({
            setValue: setValue,
            availableProjects: availableProjects.isSuccess ? availableProjects.data : []
        })
        const {currentManagerProjects} = useFetchManagerProjects({managerId: getValues('manager') !== 0 ? getValues('manager') : 0})


        function submit() {
            let data = getValues()
            data = {...data, first_name:data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase()}
            data = {...data, last_name:data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1).toLowerCase()}
            data = {...data, middle_name:data.middle_name.charAt(0).toUpperCase() + data.middle_name.slice(1).toLowerCase()}
            if (getValues('email')) {
                createAssessor.mutate({data: data})
            } else {
                const {email, ...rest} = data
                createAssessor.mutate({data: rest})
            }

        }


        return (
            <form className='min-w-[30rem] pt-4' onSubmit={handleSubmit(submit)}>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Фамилия</MyLabel>
                        <Error>{errors.last_name && errors.last_name?.message}</Error>
                    </div>
                    <MyInput placeholder="Фамилия"
                             type="text"
                             className={'pl-[12px]'}
                             register={{
                                 ...register('last_name', {
                                     required: "Обязательное поле",
                                     pattern: {
                                         value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                         message: "Поле должно содержать символы: A-z,А-я"
                                     }
                                 })
                             }}/>

                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Имя</MyLabel>
                        <Error>{errors.first_name && errors.first_name?.message}</Error>
                    </div>
                    <MyInput register={{
                        ...register('first_name', {
                            required: "Обязательное поле",
                            pattern: {
                                value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                message: "Поле должно содержать символы: A-z,А-я"
                            }
                        })
                    }}
                             className={'pl-[12px]'}
                             type="text"
                             placeholder="Имя"
                    />

                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel>Отчество</MyLabel>
                        <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                    </div>
                    <MyInput register={{
                        ...register('middle_name', {
                            pattern: {
                                value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                message: "Поле должно содержать символы: A-z,А-я"
                            }
                        })
                    }} className={'pl-[12px]'} type="text" placeholder="Отчество"
                    />

                </FormSection>
                {store.user_data.is_teamlead && <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Менеджер проекта: </MyLabel>
                        <Error>{errors.manager && errors.manager?.message}</Error>
                    </div>

                    <Select
                        options={fetchTeam.isSuccess ? (project ? fetchTeam.data.filter(manager => project?.manager.find(man => man.id.toString() === manager.value.toString()) !==undefined) : fetchTeam.data) : []}
                        value={getManager()}
                        isDisabled={!store.user_data.is_teamlead}
                        placeholder="Менеджер"
                        isSearchable={false}
                        {...register('manager', {required: 'Обязательное поле'})}
                        onChange={onManagerChange}
                    />

                </FormSection>}
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Ник в ТГ</MyLabel>
                        <Error>{errors.username && errors.username?.message}</Error>
                    </div>
                    <div className='flex relative items-center'>
                        <AtSymbolIcon className="absolute ml-[10px] h-full w-[18px] text-black border-x-black"/>
                        <MyInput register={{
                            ...register('username', {
                                required: "Обязательное поле",
                                pattern: {
                                    value: /^[A-Za-z\d_]{5,32}$/,
                                    message: "Доступные символы:A-z,0-9,_ Длина: 5-32 символа"
                                }
                            })
                        }} type="text" placeholder="Ник в ТГ" className='pl-[32px]'
                        />
                    </div>

                </FormSection>
                <FormSection>
                    <MyLabel>Проект</MyLabel>
                    <Select
                        {...register('projects')}
                        className='text-start'
                        options={getValues('manager') === 0 ? (availableProjects.isSuccess ? availableProjects.data : []) : (currentManagerProjects.isSuccess ? currentManagerProjects.data : [])}
                        isSearchable={false}
                        isDisabled={!!project}
                        value={project ? {label: project.name, value: project.id} : handlerValueProjects()}
                        onChange={handlerChangeProjects}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Статус</MyLabel>
                    <Select
                        {...register('status')}
                        className='text-start'
                        isDisabled={!getValues('projects')}
                        options={statusObject}
                        value={handlerValueStatus()}
                        onChange={handlerChangeStatus}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Страна</MyLabel>
                    <Select
                        {...register('country')}
                        className='text-start'
                        options={countryObject}
                        value={handlerValueCountry()}
                        onChange={handlerChangeCountry}
                    />
                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel>Почта</MyLabel>
                        <Error>{errors.email && errors.email?.message}</Error>
                    </div>
                    <MyInput
                        register={{
                            ...register('email', {
                                pattern: {
                                    value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/,
                                    message: "Неверно указана почта"
                                },
                            })
                        }}
                        className={'pl-[12px]'}
                        placeholder='Почта'
                        type="text"
                    />

                </FormSection>
                <div className="flex justify-between pt-3 space-x-2">
                    <MyButton type='button' onClick={() => setShowSidebar(false)}>Назад</MyButton>
                    <MyButton type='submit'>Сохранить</MyButton>
                </div>
            </form>
        );
    }
;

export default AddAssessorForm;