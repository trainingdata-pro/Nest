import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {useMutation, useQuery} from "react-query";
import ProjectService from "../../services/ProjectService";
import {errorNotification, successNotification, warnNotification} from "../UI/Notify";
import fileDownload from "js-file-download";
import MyButton from "../UI/MyButton";
import AssessorService from "../../services/AssessorService";

// @ts-ignore
const Export = ({setIsExportProjects, exportType ,project}:{
    setIsExportProjects:React.Dispatch<boolean>,
    exportType: string,
    project: number | string | undefined
}) => {
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    const exportProjects = useMutation([],({type}: any) => ProjectService.exportProjects(type), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportProjects(false)
            let hasMoreData = true;
            let filename = ''
            while (hasMoreData){
                timeout(2000)
                const res = await ProjectService.checkStatus(data.task_id)
                filename = res.filename
                if (res.status === 'SUCCESS'){
                    break
                } else if (res.status === 'FAILURE'){
                    errorNotification('Произошла ошибка при экспортировании проекта')
                    break
                }
            }
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(new Blob([exportData.data]), filename)
            successNotification('')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const exportProjectAssessors = useMutation([],({type, projectId}: any) => AssessorService.exportProjectAssessors(type, projectId), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportProjects(false)
            let hasMoreData = true;
            let filename = ''
            while (hasMoreData){
                timeout(2000)
                const res = await ProjectService.checkStatus(data.task_id)
                filename = res.filename
                if (res.status === 'SUCCESS') {
                    break
                }
            }
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(exportData.data, filename)
            successNotification('анные успешно экспортировались')
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
        <div className='flex flex-col space-y-2 mt-2'>
            <MyButton onClick={() => exportData('csv')}>CSV</MyButton>
            <MyButton onClick={() => exportData('xlsx')}>XLSX</MyButton>
        </div>
        </>
    );
};

export default observer(Export);