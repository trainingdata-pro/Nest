import {useState} from "react";
import {Assessor} from "../../../models/AssessorResponse";


export const useAvailableManagers = ({assessor}: {
    assessor: Assessor
}) => {
    const [selectedManager, setSelectedManager] = useState<number>()
    const [availableManagers, setAvailableManagers] = useState(assessor?.second_manager.map((manager:any) => {
        return {label: `${manager.last_name} ${manager.first_name}`, value: manager.id}}))
    const onChangeManager = (newValue: any) => {
        setSelectedManager(newValue.value)
    }
    const getValueManager = () => {
        return selectedManager ? availableManagers?.find((c:any) => c.value === selectedManager) : ''
    }
    return {selectedManager, availableManagers, onChangeManager, getValueManager}
}