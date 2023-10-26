import React, {Dispatch} from 'react';

const TablePagination = ({totalRows, currentPage, totalPages, setCurrentPage}:{
    totalRows: number,
    currentPage: number,
    totalPages: number,
    setCurrentPage: Dispatch<number>
}) => {
    return (
        <div className="px-2 py-2">
            <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 text-sm text-muted-foreground text-gray-400">
                    Всего строк: {totalRows}
                </div>
                <div className="flex items-center space-x-6" >

                    <div className="inline-block text-sm font-medium">
                                             <span className="flex items-center ">
                                                 <div>Страница <strong>
                                                     {currentPage !== 0 ? currentPage : 0} из {totalPages}
                                                 </strong></div>

                                             </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className={currentPage === 1 ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            {'<<'}
                        </button>
                        <button
                            className={currentPage === 1 ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                            onClick={() => setCurrentPage(currentPage-1)}
                            disabled={currentPage === 1}
                        >
                            {'<'}
                        </button>
                        <button
                            className={currentPage >= totalPages ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                            onClick={() => setCurrentPage(currentPage+1)}
                            disabled={currentPage >= totalPages}
                        >
                            {'>'}
                        </button>
                        <button
                            className={currentPage >= totalPages ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage >= totalPages}
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablePagination;