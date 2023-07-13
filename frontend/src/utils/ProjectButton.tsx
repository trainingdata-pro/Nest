import React from 'react';

// @ts-ignore
const ProjectActions = ({id}) => {
    return (
        <div data-side="bottom" data-align="end" role="menu" aria-orientation="vertical" data-state="open"
             data-radix-menu-content="" dir="ltr" id="radix-:r6:" aria-labelledby="radix-:r5:"
             className="animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
             data-orientation="vertical">
            <div className="px-2 py-1.5 text-sm font-semibold">Действия</div>
            <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>
            <a role="menuitem"
               className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
               href={`/dashboard/projects/${id}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                     className="mr-2 inline h-4 w-4">
                    <path
                        d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path>
                    <path
                        d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path>
                </svg>
                Редактировать</a>
            <button
                className="inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 rounded-md w-full justify-start px-2 py-1.5 text-sm font-normal text-red-500 hover:bg-red-100 hover:text-red-900"
                type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r39:"
                data-state="closed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                     className="mr-2 inline h-4 w-4">
                    <path fill-rule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clip-rule="evenodd"></path>
                </svg>
                Удалить
            </button>
        </div>
    );
};

export default ProjectActions;