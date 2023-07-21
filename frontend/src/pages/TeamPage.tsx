import Header from "../components/Header/Header";
import React, {useContext, useEffect, useMemo, useState} from "react";
import AssessorTable from "../components/Table/AssessorsTable";
import AddAssessor from "../components/AddAssessor";
import {observer} from "mobx-react-lite";

import {Context} from "../index";



const TeamPage = () => {
    const {store} = useContext(Context)
    const [data, setData] = useState([])
    useMemo(() => {
        store.fetchAssessors()
    },[])
    useEffect(()=>{
        // @ts-ignore
        setData(store.assessors)
    },[store.assessors])
    const [visible, setVisible] = useState(false)
    return (<>
            <Header name="Добавить исполнителя" setVisible={setVisible}></Header>
            {visible && <AddAssessor setVisible={setVisible}/>}
            <AssessorTable data={data}/>

        </>
    )
};

export default observer(TeamPage);