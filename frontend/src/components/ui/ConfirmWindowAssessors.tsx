import {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

// @ts-ignore
function ConfirmWindowAssessors({id, confirm}) {
    const {store} = useContext(Context)
    return(
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity"></div>
            <div className="animate-in bg-white fade-in-90 slide-in-from-bottom-10 sm:zoom-in-90 sm:slide-in-from-bottom-0 fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 opacity-100 shadow-lg sm:rounded-lg md:w-full">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h2 className="text-lg font-semibold">Вы
                        уверены, что хотите это сделать?</h2><p className="text-sm text-muted-foreground">После того, как вы
                    удалите проект, у вас не будет возможности его восстановить, кроме как добавить его заново.</p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <button type="button" onClick={()=> confirm(false)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 mt-2 sm:mt-0">Отменить
                    </button>
                    <button type="button" onClick={()=> {
                        // @ts-ignore
                        store.deleteAssessors(id)
                        confirm(false)
                    }}
                            className="inline-flex bg-black text-white items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">Продолжить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(ConfirmWindowAssessors);