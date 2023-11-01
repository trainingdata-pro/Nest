import React, {useContext, useEffect, useState} from 'react';
import {Assessor, Skill} from "../../../models/AssessorResponse";
import AssessorService from "../../../services/AssessorService";
import Select, {MultiValue} from "react-select";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";
import {Context} from "../../../index";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {errorNotification, successNotification} from "../../UI/Notify";

const Skills = ({assessor}: {
    assessor: Assessor
}) => {
    const queryClient = useQueryClient()
    const skills = useQuery(['skills', assessor.id], () => AssessorService.fetchSkills(), {
        onSuccess: () => {}
    })
    useEffect(() => {
        assessor.skills.map(skill => setValue(skill.id.toString(), true))
    }, [])
    const assessorSkills = useMutation(['currentAssessor'], ({assessorSkills}:any) => AssessorService.patchAssessorSkills(assessor.id, assessorSkills), {
        onSuccess: () => {
            successNotification('Навыки обновлены')
            queryClient.invalidateQueries(['currentAssessor'])
        },
        onError: () => {
            errorNotification('Произошла ошибка')
        }
    })
    const {store} = useContext(Context)
    const submit = () => {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            const assessorSkillsList = Object.keys(getValues()).filter(key => getValues()[key] === true)
            assessorSkills.mutate({assessorSkills: assessorSkillsList})
            setIsDisabled(true)
        }
    }
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const {register, setValue, getValues} = useForm()
    return (
        <div className='w-full flex align-middle text-center'>
            <div className='flex-[10%] bg-[#E7EAFF] px-[30px] py-[20px] text-center border-r border-black'>Skills</div>
            <div className='flex flex-[90%] justify-between px-4 bg-white'>
                {skills.data?.results.map(skill => {
                    return (<div key={skill.id} className='my-auto align-middle text-center'>{skill.title} <input
                        type='checkbox' disabled={isDisabled} {...register(skill.id.toString())}/></div>)
                })}
                <button>{(assessor?.manager?.id === store.user_id || assessor?.second_manager?.find(manager => manager.id === store.user_id) !== undefined || store.user_data.is_teamlead) ? ( isDisabled ? <PencilSquareIcon onClick={submit} className="h-6 w-6 text-black cursor-pointer"/> : <CheckIcon onClick={submit} className="h-6 w-6 text-black cursor-pointer"/>): <PencilSquareIcon className="h-6 w-6 text-gray-400"/>}</button>
            </div>

        </div>
    );
};

export default Skills;