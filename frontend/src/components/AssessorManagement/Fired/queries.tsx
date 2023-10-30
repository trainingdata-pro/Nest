import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";


export const useFetchReason = () => {
    return useQuery(['reasons'], () => AssessorService.fetchReasons())
}