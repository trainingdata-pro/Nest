import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {ProjectAssessors} from "../../../models/AssessorResponse";
import {useState} from "react";


export const useFetchProjectAssessors = ({enabled, projectId}: {
    enabled: boolean,
    projectId: number | string | undefined
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {
        isLoading,
        isError
    } = useQuery(['projectAssessors', currentPage, projectId], () => AssessorService.fetchAssessors(currentPage, projectId), {
        enabled: enabled,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
            let newData: ProjectAssessors[] = []
            data1.results.map((assessor: any) => {
                assessor.working_hours = assessor.working_hours.find((wh: any) => wh.project.id.toString() === projectId?.toString())
                assessor.workload_status = assessor.workload_status.find((ws: any) => ws.project.id.toString() === projectId?.toString())?.status
                assessor.projects = assessor.projects.map((project: any) => project.id)
                newData.push({...assessor})
                return 0
            })
            setTableData(newData)
        },
    })
    const [tableData, setTableData] = useState<ProjectAssessors[]>([])

    return {tableData, isLoading, isError, currentPage, setCurrentPage, totalPages, totalRows}
}