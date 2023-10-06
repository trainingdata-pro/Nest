import React, {useEffect, useState} from 'react';
import {Assessor, Skill} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import Select, {MultiValue} from "react-select";
import {SelectProps} from "../Projects/ProjectForm";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";

const Skills = ({assessor}: {
    assessor: Assessor
}) => {
    useEffect(() => {
        AssessorService.fetchSkills().then(res => setSkills(res.data.results))
        assessor.skills.map(skill => setValue(skill.id.toString(), true))
    }, [])
    const submit = () => {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            const assessorSkills = Object.keys(getValues()).filter(key => getValues()[key] === true)
            AssessorService.patchAssessor(assessor.id, {
                skills: assessorSkills
            })
            setIsDisabled(true)
        }
    }
    const [skills, setSkills] = useState<Skill[]>([])
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const {register, handleSubmit, setValue, getValues} = useForm()
    return (
        <div className='w-full flex align-middle text-center'>
            <div className='flex-[10%] bg-[#E7EAFF] px-[30px] py-[20px] text-center border-r border-black'>Skills</div>
            <form className='flex flex-[90%] justify-between px-4 bg-white' onSubmit={handleSubmit(submit)}>
                {skills.map(skill => {
                    return (<div key={skill.id} className='my-auto align-middle text-center'>{skill.title} <input
                        type='checkbox' disabled={isDisabled} {...register(skill.id.toString())}/></div>)
                })}
                <button>{isDisabled ? <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                    <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>}</button>
            </form>

        </div>
    );
};

export default Skills;