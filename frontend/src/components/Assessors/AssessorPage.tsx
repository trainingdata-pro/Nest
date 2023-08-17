import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";

const AssessorPage = () => {
    const id = useParams()["id"]
    const [assessor, setAssessor] = useState<Assessor>()

    useEffect(()=>{
        AssessorService.fetchAssessor(id).then(res => console.log(res.data))
    },[])
    return (
        <div>
            <header className="fixed h-20 w-screen border-b border-gray-200 bg-white">
                <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                    <div
                        className="inline-flex items-center border border-b-black hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                    >
                        <NavLink
                            to='/dashboard/main'>Service Desk</NavLink>
                    </div>
                    <div className="border border-black ml-3 h-10 py-2 px-4">
                        Страница Ассессора
                    </div>
                </div>
            </header>
        </div>
    );
};

export default AssessorPage;