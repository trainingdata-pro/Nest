import React from 'react';
import Icon from "@mdi/react";
import {mdiSort, mdiSortAscending, mdiSortDescending} from "@mdi/js";
import {observer} from "mobx-react-lite";

const Sorting = ({state, func, sortingKey, sortingValue}: { sortingKey: string , func: any, sortingValue: string, state: any}) => {
    if (sortingValue === ''){
        return (
            <div className='cursor-pointer' onClick={() => func({...state, [sortingKey]: sortingKey})}>
                <Icon className="pl-0.5" path={mdiSort} size={1} color={'#64748b'} />
            </div>
        );
    }
    else if (sortingValue.startsWith('-')){
        return (
            <div className='cursor-pointer' onClick={() => func({...state, [sortingKey]: ''})}>
                <Icon className="pl-0.5" path={mdiSortDescending} size={1}
                      color={'#64748b'}/>
            </div>
        );
    } else {
        return (
            <div className='cursor-pointer' onClick={() => func({...state, [sortingKey]: `-${sortingKey}`})}>
                <Icon className="pl-0.5" path={mdiSortAscending} size={1} color={'#64748b'}/>
            </div>
        );
    }
};

export default observer(Sorting);