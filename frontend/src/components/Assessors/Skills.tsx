import React, {useEffect, useState} from 'react';
import {Assessor, Skill} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import Select, {MultiValue} from "react-select";
import {SelectProps} from "../ProjectForm";
import {values} from "mobx";

const Skills = ({assessor}: {
    assessor: Assessor
}) => {
    useEffect(() => {
        AssessorService.fetchSkills().then(res => setSkills(res.data.results))
        setSelectValues(generateSelectValues(assessor.skills))
    }, [])
    const [skills, setSkills] = useState<Skill[]>([])
    const [currentSkills, setCurrentSkills] = useState<Skill[]>([...assessor.skills])
    const [selectValues, setSelectValues] = useState<MultiValue<SelectProps>>([])
    const getOptions = (skills: Skill[]) => {
        return skills.map(skill => {return {label: skill.title, value: skill.id}})
    }
    const generateSelectValues = (skills: Skill[]) => {
        return skills.map(skill => {return {label: skill.title, value: skill.id}})
    }
    const getValueFromSelect = (values: MultiValue<SelectProps>) => {
        return values.map(value => {return value.value})
    }

    return (
        <div className='w-full'>
            <Select
                isMulti
                options={getOptions(skills)}
                value={selectValues}
                onChange={(newValue) => setSelectValues(newValue)}
                placeholder='Навыки'
            />
            <button onClick={() => AssessorService.patchAssessor(assessor.id, {skills: getValueFromSelect(selectValues)})}>Сохранить</button>
        </div>
    );
};

export default Skills;