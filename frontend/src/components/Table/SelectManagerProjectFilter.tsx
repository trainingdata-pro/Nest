import React, {useMemo, useState} from 'react';
import Profile from "../Header/Profile";
import Owner from "./Owner";
import ManagerService from "../../services/ManagerService";
import {IManager} from "../../models/ManagerResponse";

const SelectManagerProjectFilter = () => {
    const [managers, setManagers] = useState<IManager[]>([])
    useMemo(() => {
        // @ts-ignore
        ManagerService.fetch_managers().then(res => setManagers(res.data.results))
    },[])
    return (
        <div className="">
            <button className="hover:bg-gray-400/20 items-center rounded-md text-sm font-medium transition-colors border border-input h-10 py-2 px-4 w-[15rem] justify-between capitalize">
                {managers.map(manager => <Owner manager={manager}/>)}
            </button>
        </div>
    );
};

export default SelectManagerProjectFilter;