import Header from "../components/Header/Header";
import {useEffect} from "react";
import AssessorTable from "../components/Table/AssessorsTable";
import AssessorsService from "../services/AssessorsService";
import AddAssessor from "../components/AddAssessor";
import {observer} from "mobx-react-lite";


const TeamPage = () => {

    useEffect(() => {
        AssessorsService.fetchAssessors()
    },[])
    return (<>
            <Header name="Добавить исполнителя" children={<AddAssessor/>}></Header>
            <AssessorTable/>

        </>
    )
};

export default observer(TeamPage);