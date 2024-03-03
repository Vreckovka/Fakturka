import { useState } from "react";

type EditableColumnProps = {
    onUpdate: (value: string | number) => void
    value: string | number;
}


const EditableColumn: React.FunctionComponent<EditableColumnProps> = ({ value, onUpdate }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [cellValue, setCellValue] = useState<string | number>(value);

    return (
        <>
            {
                isEdit ?
                    <input autoFocus
                        onClick={(x) => { }}
                        value={cellValue}
                        onChange={(x) => {
                            setCellValue(x.target.value)
                        }}
                        onKeyDown={(x) => {
                            if (x.key === "Enter") {
                                setIsEdit(false);
                                onUpdate(cellValue);
                            }
                        }}
                        onBlur={() => {
                            setIsEdit(false);
                            onUpdate(cellValue);
                        }}>
                    </input> :


                    <label onClick={(x) => setIsEdit(true)}>
                        {cellValue}
                    </label>
            }
        </>
    )
};

export default EditableColumn;