import React from 'react';

// @ts-ignore
const ConfirmPage = ({close}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity"></div>
            <div className="animate-in bg-white fade-in-90 slide-in-from-bottom-10 sm:zoom-in-90 sm:slide-in-from-bottom-0 fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 opacity-100 shadow-lg sm:rounded-lg md:w-full">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h2 className="text-lg font-semibold">Ссылка активации аккаунта отпралена на корпоративную почту. </h2>
                    <button type="button" onClick={()=> close(false)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 mt-2 sm:mt-0">Закрыть окно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPage;