import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {useMutation, useQuery} from "react-query";
import ProjectService from "../../services/ProjectService";
import {errorNotification, warnNotification} from "../UI/Notify";
import fileDownload from "js-file-download";
import MyButton from "../UI/MyButton";

// @ts-ignore
const Export = ({setIsExportProjects}) => {
    const exportProjects = useMutation([],({type}: any) => ProjectService.exportProjects(type), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportProjects(false)
            let hasMoreData = true;
            let filename = ''
            while (hasMoreData){
                const res = await ProjectService.checkStatus(data.task_id)
                filename = res.filename
                if (res.status === 'SUCCESS'){
                    break
                }
            }
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(exportData.data, filename)

        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })

    return (
        <>
        <div className='border-b border-black w-full'>
            <h1 className='px-4 py-2'>Добавление в свободные ресурсы</h1>
        </div>
        <div className='flex flex-col space-y-2 mt-2'>
            <MyButton onClick={() => exportProjects.mutate({type: 'csv'})}>CSV</MyButton>
            <MyButton onClick={() => exportProjects.mutate({type: 'xlsx'})}>XLSX</MyButton>
        </div>
        </>
    );
};

export default observer(Export);