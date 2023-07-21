import React from 'react';
import {HiPencilAlt} from "react-icons/hi";
// @ts-ignore
const ProjectActions = ({id}) => {
    return (
        <div className="animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
             data-orientation="vertical">
            <div className="px-2 py-1.5 text-sm font-semibold">Действия</div>
            <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
            <a role="menuitem"
               className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
               href={`/dashboard/projects/${id}`}>
                <HiPencilAlt/> Редактировать</a>
            <button
                className="inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 rounded-md w-full justify-start px-2 py-1.5 text-sm font-normal text-red-500 hover:bg-red-100 hover:text-red-900"
                type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r39:"
                data-state="closed">
                Удалить
            </button>
        </div>
    );
};

export default ProjectActions;