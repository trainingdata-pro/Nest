import React, {HTMLProps} from 'react';

function TableCheckBox({
                           indeterminate,
                           className = '',
                           ...rest
                       }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            name='sel'
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

export default TableCheckBox;