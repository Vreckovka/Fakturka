import { useState } from "react";
import { getLocaleNumber } from "../../invoice-document.component";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type EditableColumnProps = {
    onUpdate: (value: string | number) => void
    value: string | number;
    type?: "number"
}


const EditableColumn: React.FunctionComponent<EditableColumnProps> = ({ value, onUpdate, type }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [cellValue, setCellValue] = useState<string | number>(value);

    return (
        <>
            {
                isEdit ?
                    <Input autoFocus
                        onClick={(x) => { }}
                        value={cellValue}
                        onChange={(x) => {
                            let vale = x.target.value;
                            if (type === "number") {
                                vale = vale.replace(",", ".");
                            }
                            setCellValue(vale)
                        }}
                        onKeyDown={(x) => {
                            if (x.key === "Enter") {
                                setIsEdit(false);
                                onUpdate(cellValue);
                            }
                        }}
                        onBlur={() => {
                            onUpdate(cellValue);
                            setIsEdit(false);
                        }}>
                    </Input> :


                    (type === "number") ? < Label onClick={(x) => setIsEdit(true)}>
                        {getLocaleNumber(cellValue as number)}
                    </Label > : < Label onClick={(x) => setIsEdit(true)}>
                        {cellValue}
                    </Label >

            }
        </>
    )
};

export default EditableColumn;