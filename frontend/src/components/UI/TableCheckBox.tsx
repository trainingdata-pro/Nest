import React, {Dispatch, useState} from 'react';
import {TableRowProps} from "semantic-ui-react";
import {Row} from "@tanstack/react-table";


const TableCheckBox = ({selectedRows,type, setSelectedRows, value,table}:{
    selectedRows: any[],
    value: any | Array<any>,
    type: 'single' | 'multi',
    setSelectedRows: Dispatch<any>,
    table: any | undefined

}) => {
    const changeHandler = (event:  React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'multi'){
            if (!Array.isArray(value)) {
                if (event.target.checked) {
                    setSelectedRows([...selectedRows, value])
                } else {
                    setSelectedRows([...selectedRows.filter(row => row.original.id !== value.original.id)])
                }
            }
            else if (Array.isArray(value)) {
                if (event.target.checked) {
                    setSelectedRows(Array.from(new Set([...selectedRows, ...value])))
                } else {
                    setSelectedRows([...selectedRows.filter(row => value.find((selRow:any) => row.original.id === selRow.original.id) === undefined)])
                }
            }
        } else if (type === 'single'){
            if (event.target.checked) {
                setSelectedRows([value])
            }
        }

    }
    const getChecked = () => {
        if (Array.isArray(value)){
            return table.getPreFilteredRowModel().rows.filter((row:any) => selectedRows.find((selRow) => selRow.original?.id === row.original?.id) !== undefined).length === value.length && table.getPreFilteredRowModel().rows.length !== 0
        } else if (typeof value === 'object') {
            return selectedRows.find((row:Row<any>) => row.original.id === value.original.id) !== undefined
        }
    }
    return (
        <input
            type="checkbox"
            className='cursor-pointer'
            onChange={changeHandler}
            name='sel'
            checked={getChecked()}
        />
    )
}

export default TableCheckBox;