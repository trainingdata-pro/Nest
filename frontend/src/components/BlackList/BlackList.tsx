import React, {useState} from 'react';
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import Dialog from "../UI/Dialog";
import Export from "./Export";
import MyButton from "../UI/MyButton";
import Loader from "../UI/Loader";
import Table from "../UI/Table";
import {useFetchBlacklist} from "./queries";
import {useBlacklistColumns} from "./columns";

const BlackList = () => {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const {columns, sorting, getSortingString} = useBlacklistColumns()
    const [isExportBlackList, setIsExportBlackList] = useState(false)

    const {
        blacklist,
        currentPage,
        setCurrentPage,
        totalPages,
        totalRows,
        pageLimit,
        setPageLimit
    } = useFetchBlacklist({globalFilter: globalFilter, sorting: sorting, sortingString: getSortingString()})

    return (
        <>
            <Dialog isOpen={isExportBlackList} setIsOpen={setIsExportBlackList}>
                <Export setIsExportBlackList={setIsExportBlackList} filter={globalFilter}/>
            </Dialog>
            <div className=''>
                <div className="flex justify-between space-x-2 items-center mb-2">
                    <div className="relative">
                        <input className='border border-black rounded-[8px] px-[8px] py-[5px] pr-[30px]'
                               placeholder='Поиск по ФИО' value={globalFilter}
                               onChange={(event) => setGlobalFilter(event.target.value)}/>
                        <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>

                    </div>
                    <MyButton onClick={() => setIsExportBlackList(true)}>Экспорт данных</MyButton>
                </div>
                <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                    {blacklist.isFetching ? <Loader height={'h-[calc(100vh-150px)]'}/> : <Table data={blacklist.isSuccess ? blacklist.data.results : []} columns={columns} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                                                                                setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit} pages={true}/>}
                </div>
            </div>
        </>
    );
};

export default BlackList;