import React from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import moment from "moment-timezone";
import {format, utcToZonedTime} from "date-fns-tz";

const CurrentState = ({assessorId, vacationDate}: {
    assessorId: string | number | undefined,
    vacationDate: string | undefined | null
}) => {
    const getCurrentData = (value:string) => {
        const TimeZone = moment.tz.guess()
        const zonedDate = utcToZonedTime(new Date(value), TimeZone)
        return format(zonedDate, 'dd-MM-yyyy',{ timeZone: TimeZone } )
    }
    const {data} = useQuery(['assessorHistory', assessorId], () => AssessorService.fetchAssessorHistory(assessorId, 'state'), {})
    return (
        <table className='border border-black'>
            <thead>
            <tr className="bg-[#E7EAFF]">
                <th className="border-r dark:border-neutral-500 px-[2px] py-[2px]">Статус</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Дата Присвоения статуса</th>
                <th className="px-[5px] py-[20px]">Предположительная дата завершения статуса</th>
            </tr>
            </thead>
            <tbody>
            <tr className="text-center border-t dark:border-neutral-500">
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[2px]">{data && data.results[0]?.new_value}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[2px]">{data && getCurrentData(data.results[0]?.timestamp)}</td>
                <td className="whitespace-nowrap px-[5px] py-[2px]">{vacationDate && getCurrentData(vacationDate)}</td>
            </tr>
            </tbody>
        </table>
    );
};

export default CurrentState;