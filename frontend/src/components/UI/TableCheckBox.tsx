import React, {Dispatch, useState} from 'react';


const TableCheckBox = ({selectedRows, setSelectedRows, value,table}:{
    selectedRows: number[],
    value: number | number [],
    setSelectedRows: Dispatch<any>,
    table: any | undefined

}) => {
    const changeHandler = (event:  React.ChangeEvent<HTMLInputElement>) => {
        if (typeof value === "number"){
            if (event.target.checked) {
                setSelectedRows([...selectedRows, value])
            } else {
                setSelectedRows([...selectedRows.filter(id => id !== value)])
            }
        }
         else {
            if (event.target.checked) {
                setSelectedRows(Array.from(new Set([...selectedRows, ...value])))
            } else {
                setSelectedRows([...selectedRows.filter(row => value.find(id => row === id) === undefined)])
            }
        }
    }
    const getChecked = () => {
        if (typeof value === 'object' && table){
            return table.getPreFilteredRowModel().rows.filter((row:any) => selectedRows.find(id => id === row.original.id) !== undefined).length === value.length
        }
    }
    return (
        <input
            type="checkbox"
            className='cursor-pointer'
            onChange={changeHandler}
            name='sel'
            checked={selectedRows.find((id:number) => id === value) !== undefined || getChecked()}
        />
    )
}

export default TableCheckBox;