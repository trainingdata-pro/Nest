import React, {useContext, useState} from "react";

import ConfirmWindowAssessors from "./ConfirmWindowAssessors";
import {Context} from "../../index";

// @ts-ignore
function ActionMenuAssessors({reset}) {
    const {store} = useContext(Context)
    const [confirm, setConfirm] = useState(false)
    return (
        <div className="fixed bottom-10 left-10 w-full max-w-[35rem] space-y-4 rounded-lg border border-gray-200 bg-white py-4 shadow-lg">
            <div className="px-4 text-base font-medium text-gray-900">Применить для выделенных строк:</div>
            {confirm && <ConfirmWindowAssessors confirm={reset} id={store.selectedRow}/>}
            <div className="flex flex-nowrap border-none px-4">
                <button onClick={() => setConfirm(true)}
                        className="inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 rounded-md px-2 py-1.5 text-sm font-normal text-red-500 hover:bg-red-100 hover:text-red-900 w-auto grow-[1] justify-center"
                        type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r1r:"
                        data-state="closed">
                    Удалить
                </button>
            </div>
        </div>)
}

export default ActionMenuAssessors;