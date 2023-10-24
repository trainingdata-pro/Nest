import React, {useState, useEffect, useContext} from "react";
import AssessorService, {ILoginAndPassword} from "../../../services/AssessorService";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useForm} from "react-hook-form";
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/solid";

type AssessorCredentials = {
    assessor: number | string | undefined,
    tool: string,
    login: string,
    password: string
}
const CredentialsRow = ({cred, assessorId, setIsAddCredentials}: {
    cred: ILoginAndPassword,
    assessorId: string | number | undefined,
    setIsAddCredentials: any
}) => {
    const queryClient = useQueryClient();
    const [isDisabled, setIsDisabled] = useState(() => !!cred?.id)
    const {register, getValues} = useForm<AssessorCredentials>({
        defaultValues: {
            assessor: assessorId,
            tool: cred?.tool,
            login: cred?.login,
            password: cred?.password
        }
    })
    const getPatchValues = (data: AssessorCredentials) => {
        if (cred.tool === data.tool){
            const {tool, ...rest} = data
            return rest
        }
        return data
    }
    const patchMutate = useMutation(['credentials', assessorId], () => AssessorService.patchCredentials(assessorId, getPatchValues(getValues())), {
        onSuccess: () => {
            queryClient.invalidateQueries('credentials')
            setIsDisabled(true)
        }
    })
    const postMutate = useMutation(['credentials', assessorId], () => AssessorService.postCredentials(getValues()), {
        onSuccess: () => {
            queryClient.invalidateQueries('credentials')
            setIsDisabled(true)
            setIsAddCredentials(false)
        }
    })
    return <tr className="text-center border-t dark:border-neutral-500">
        <td className='whitespace-nowrap border-r dark:border-neutral-500' ><input className='text-center resize-none mx-1 my-1 block' disabled={isDisabled} {...register('tool')}/></td>
        <td className='whitespace-nowrap border-r dark:border-neutral-500 py-[5px]' ><input className='text-center resize-none mx-1 my-1 block' disabled={isDisabled} {...register('login')}/></td>
        <td className='whitespace-nowrap border-r dark:border-neutral-500 py-[5px]' ><input className='text-center resize-none mx-1 my-1 block' disabled={isDisabled} {...register('password')}/></td>
        {cred?.id ?
            <td className='whitespace-nowrap py-[5px] text-center'>{isDisabled ?
                <PencilSquareIcon onClick={() => setIsDisabled(false)} className="h-6 w-6 text-black cursor-pointer"/> :
                <CheckIcon onClick={() => {
                    patchMutate.mutate()

                }} className="h-6 w-6 text-black cursor-pointer"/>}
            </td> :
            <td className='whitespace-nowrappy-[5px] text-center'>
                <CheckIcon onClick={() => {
                    postMutate.mutate()
                }} className="h-6 w-6 text-black cursor-pointer"/>
            </td>}

    </tr>
}
const TableLog = ({assessorId, assessorName = '', setIsShowLoginAndPassword}: {
    assessorId: number | string | undefined,
    assessorName: string,
    setIsShowLoginAndPassword: any
}) => {
    const {store} = useContext(Context)
    const {data, isLoading} = useQuery(['credentials'], () => AssessorService.fetchCredentials(assessorId), {
        keepPreviousData: true
    })


    const [isAddCredentials, setIsAddCredentials] = useState(false)

        return (
            <>
                <h1>Логины и пароли</h1>
                <h2 className='text-[#5970F6] mb-2'>{assessorName}</h2>
                <div className='rounded-[20px] bg-white overflow-hidden border border-black'>
                <table className="min-w-full text-center">
                    <thead>
                    <tr className="bg-[#E7EAFF]">
                        <th className="border-r dark:border-neutral-500 py-[3px]">Иснтрумент</th>
                        <th className="border-r dark:border-neutral-500 py-[3px]">Логин</th>
                        <th className="border-r dark:border-neutral-500 py-[3px]">Пароль</th>
                        <th></th>
                    </tr>
                    </thead>
                    {isLoading ? <tbody><tr><td colSpan={20}>Загрузка</td></tr></tbody>:
                    <tbody>
                    {data?.results.map(cred => <CredentialsRow setIsAddCredentials={setIsAddCredentials} key={cred.id}
                                                               cred={cred} assessorId={assessorId}/>)}
                    {isAddCredentials && <CredentialsRow assessorId={assessorId} cred={{} as ILoginAndPassword}
                                                         setIsAddCredentials={setIsAddCredentials}/>}
                    </tbody>}
                </table>
                </div>
                <div className='flex justify-between'>
                    <button onClick={() => setIsShowLoginAndPassword(false)} className="bg-[#5970F6] text-white rounded-md mt-2 px-4 py-2">Назад</button>
                    <button className="bg-[#5970F6] text-white rounded-md mt-2 px-4 py-2" onClick={() => setIsAddCredentials(true)}>Добавить данные</button>
                </div>
            </>
        );

};

export default observer(TableLog);