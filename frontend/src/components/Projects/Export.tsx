import React from 'react';
import {observer} from "mobx-react-lite";
import {useMutation} from "react-query";
import ProjectService from "../../services/ProjectService";
import {errorNotification, successNotification, warnNotification} from "../UI/Notify";
import fileDownload from "js-file-download";
import MyButton from "../UI/MyButton";
import AssessorService from "../../services/AssessorService";

const Export = ({setIsExportProjects, exportType ,project}:{
    setIsExportProjects:React.Dispatch<boolean>,
    exportType: string,
    project: number | string | undefined
}) => {
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const CheckStatus = async (taskId: string) => {
        let filename = ''
        while (true){
            await timeout(2000)
            const res = await ProjectService.checkStatus(taskId)
            filename = res.filename
            if (res.status === 'SUCCESS'){
                break
            } else if (res.status === 'FAILURE'){
                errorNotification('Произошла ошибка при экспортировании проекта')
                break
            }
        }
        return filename
    }
    const exportProjects = useMutation([],({type}: any) => ProjectService.exportProjects(type), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportProjects(false)
            const filename = await CheckStatus(data.task_id)
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(new Blob([exportData.data]), filename)
            successNotification('Завершенные проекты успешно экспортированы')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const exportProjectAssessors = useMutation([],({type, projectId}: any) => AssessorService.exportProjectAssessors(type, projectId), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportProjects(false)
            const filename = await CheckStatus(data.task_id)
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(exportData.data, filename)
            successNotification('Данные успешно экспортировались')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const exportData = (type: string) => {
        if (exportType === 'projectAssessors') {
            if (type === 'csv') {
                exportProjectAssessors.mutate({type: type, projectId: project})
            } else {
                exportProjectAssessors.mutate({type: type, projectId: project})
            }
        }
        if (exportType === 'completedProjects') {
            if (type === 'csv') {
                exportProjects.mutate({type: type})
            } else {
                exportProjects.mutate({type: type})
            }
        }
    }
    return (
        <>
        <div className='border-b border-black w-full'>
            <h1 className='px-4 py-2'>Экспорт</h1>
        </div>
        <div className='flex flex-col space-y-2 mt-2 min-w-[250px]'>
            <MyButton onClick={() => exportData('csv')}>CSV</MyButton>
            <MyButton onClick={() => exportData('xlsx')}>XLSX</MyButton>
        </div>
        </>
    );
};

export default observer(Export);