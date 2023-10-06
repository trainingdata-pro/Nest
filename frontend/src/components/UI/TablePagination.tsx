import React from 'react';

const TablePagination = ({totalProjects, currentPage, setCurrentPage, totalPages, pageLimit, setPageLimit}:{
    totalProjects: number | undefined,
    currentPage: number,
    setCurrentPage: any,
    totalPages: number,
    pageLimit: number,
    setPageLimit: any
}) => {
    return (
        <div className="flex px-2 justify-between space-y-2 border-t dark:border-neutral-500">
            <div className="flex items-center justify-center text-sm font-medium">
                                     <span className="items-center gap-1 text-[18px]">
                                         Страница {totalProjects !== 0 ? currentPage : 0} из {totalPages}
                                     </span>
            </div>
            <div className="text-[18px] flex items-center space-x-2 mr-2">
                <button
                    className={currentPage === 1 ? "border rounded p-1 text-gray-300 px-2" : "border rounded p-1 px-2"}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}>
                    {'<'}
                </button>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Размер страницы</p>
                    <select
                        className="flex items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-[70px]"
                        value={pageLimit}
                        onChange={e => {
                            setCurrentPage(1)
                            setPageLimit(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className={currentPage === totalPages ? "border rounded p-1 text-gray-300 px-2" : "border rounded p-1 px-2"}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}>{'>'}
                </button>
            </div>
        </div>
    );
};

export default TablePagination;