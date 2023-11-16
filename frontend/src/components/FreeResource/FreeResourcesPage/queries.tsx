import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";


export const useSkills = () => {
    return useQuery(['skills'], () => AssessorService.fetchSkills(), {
        select: data => {
            return data.results.map(tag => {
                return {label: tag.title, value: tag.id}
            })
        }
    })
}