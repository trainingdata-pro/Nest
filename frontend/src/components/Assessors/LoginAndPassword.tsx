import {useState, useEffect, useContext} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import AssessorService, {ILoginAndPassword} from "../../services/AssessorService";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

// @ts-ignore
const TableCell = observer(({getValue, row, column, table}) => {
    const {store} = useContext(Context)
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
        if (row.original.tool !== value) {
            AssessorService.patchCredentials(row.original.id, {
                assessor: row.original.assessor.id,
                [column.id]: value
            }).then((res) => console.log(res.data))
        }
    };
    return (
        <textarea
            className={`text-center resize-none ${!store.isEditableLoginAndPassword ? "opacity-50" : ""}`}
            value={value}
            disabled={!store.isEditableLoginAndPassword}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
        />
    );
});
const columnHelper = createColumnHelper<ILoginAndPassword>();
const columns = [
    columnHelper.accessor("tool", {
        header: "Инструмент",
        cell: TableCell,
    }),
    columnHelper.accessor("login", {
        header: "Логин",
        cell: TableCell,
    }),
    columnHelper.accessor("password", {
        header: "Пароль",
        cell: TableCell,
    }),
];
const TableLog = () => {
    const {store} = useContext(Context)
    useEffect(() => {
        AssessorService.fetchCredentials(1).then(res => {
            setData(res.data.results)
            console.log(res.data.results)
        })
    }, []);
    const [data, setData] = useState<ILoginAndPassword[]>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex: number, columnId: string, value: string) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
        },
    });
    return (
        <>
            <div className="rounded-t-[20px] border border-b-gray-400 bg-white">
                <table className="w-full">
                    <thead className="">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="bg-[#E7EAFF] px-[15px] py-[10px]">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={() => store.setEditableLoginAndPassword(!store.isEditableLoginAndPassword)}>{store.isEditableLoginAndPassword ? "Сохранить" : "Редактировать"}</button>
        </>
    );
};

export default observer(TableLog);