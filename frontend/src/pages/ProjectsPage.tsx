import Header from "../components/Header/Header";
import AddProject from "../components/AddProject";
import ProjectTable from "../components/Table/ProjectsTable";
import React, {useState} from "react";

const ProjectsPage = () => {
    const [visible, setVisible] = useState(false)
    return (
        <>
            <Header name="Добавить проект" setVisible={setVisible}></Header>
            {visible && <AddProject setVisible={setVisible}/>}
            <ProjectTable/>
        </>
    )


};

export default ProjectsPage;