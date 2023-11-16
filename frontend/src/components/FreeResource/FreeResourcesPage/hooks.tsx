import {useSkills} from "./queries";
import {Dispatch} from "react";


export const useSkillsFilter = ({skillsFilter, setSkillsFilter}: {
    skillsFilter: number[],
    setSkillsFilter: Dispatch<number[]>
}) => {
    const skills = useSkills()
    const onSkillsChange = (newValue: any) => {
        const tagsId = newValue.map((value: any) => value.value)
        setSkillsFilter(tagsId)
    }
    const getValueSkills = () => {
        if (skillsFilter) {
            return skills.data ? skills.data.filter((tag: any) => skillsFilter.indexOf(tag.value) >= 0) : []
        } else {
            return []
        }
    }

    return {skills, onSkillsChange, getValueSkills}
}