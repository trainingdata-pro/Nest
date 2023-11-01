import React from "react";
import {useMutation} from "react-query";
import ProjectService from "../../services/ProjectService";
import {errorNotification, successNotification, warnNotification} from "../UI/Notify";
import fileDownload from "js-file-download";
import AssessorService from "../../services/AssessorService";
import MyButton from "../UI/MyButton";

const Export = ({setIsExportBlackList, filter}: {
    setIsExportBlackList: React.Dispatch<boolean>,
    filter: string
}) => {
    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const exportBlackList = useMutation([], ({type, items}: any) => AssessorService.exportBlackList(type, items), {
        onSuccess: async data => {
            warnNotification('Загрузка началась')
            setIsExportBlackList(false)
            let hasMoreData = true;
            let filename = ''
            while (hasMoreData) {
                timeout(2000)
                const res = await ProjectService.checkStatus(data.task_id)
                filename = res.filename
                if (res.status === 'SUCCESS') {
                    break
                } else if (res.status === 'FAILURE') {
                    errorNotification('Произошла ошибка при экспортировании')
                    break
                }

            }
            const exportData = await ProjectService.downloadFile(filename)
            fileDownload(new Blob([exportData.data]), filename)
            successNotification('Черный список успешно экспортирован')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })

    const exportData = async (type: string) => {
        if (type === 'csv') {
            const res = await AssessorService.getBlackListAll(filter).then(res => res.results.map(el => el.id))
            exportBlackList.mutate({type: type, items: res})
        } else {
            const res = await AssessorService.getBlackListAll(filter).then(res => res.results.map(el => el.id))
            exportBlackList.mutate({type: type, items: res})
        }
    }
    return (
        <>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Добавление в свободные ресурсы</h1>
            </div>
            <div className='flex flex-col space-y-2 mt-2'>
                <MyButton onClick={() => exportData('csv')}>CSV</MyButton>
                <MyButton onClick={() => exportData('xlsx')}>XLSX</MyButton>
            </div>
        </>
    );
};
export default Export