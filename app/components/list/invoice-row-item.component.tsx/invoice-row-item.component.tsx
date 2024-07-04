import { InvoiceItem } from "@/app/types/Entity";
import { useState } from "react";
import "./invoice-row-item.component.scss"
import EditableColumn from "../editable-column/editable-column.component";
import { getLocaleNumber } from "../../invoice-document.component";
import { Button } from "@/components/ui/button";

type InvoiceRowItemProps = {
    invoiceItem: InvoiceItem;
    onRemove: (item: InvoiceItem) => void;
    onUpdate: () => void
}



const InvoiceRowItem: React.FunctionComponent<InvoiceRowItemProps> = ({ invoiceItem, onRemove, onUpdate }) => {
    return (
        <div className="row">
            <Button type="button" onClick={(x) => {
                onRemove(invoiceItem);
            }}>X</Button>

            <div className="column name">
                <EditableColumn value={invoiceItem.name}
                    onUpdate={(value) => {
                        invoiceItem.name = value as string;
                        onUpdate();
                    }} />
            </div>

            <div className="column">
                <EditableColumn value={invoiceItem.amout} type="number"
                    onUpdate={(value) => {
                        invoiceItem.amout = value as number;
                        onUpdate();
                    }} />
            </div>
            <div className="column">
                <EditableColumn value={invoiceItem.unit}
                    onUpdate={(value) => {
                        invoiceItem.unit = value as string;
                        onUpdate();
                    }} />
            </div>
            <div className="column">
                <EditableColumn value={invoiceItem.unitPrice} type="number"
                    onUpdate={(value) => {
                        invoiceItem.unitPrice = value as number;
                        onUpdate();
                    }} />
            </div>

            <div className="column">
                {getLocaleNumber(invoiceItem.amout * invoiceItem.unitPrice)}
            </div>
        </div>)
}

export default InvoiceRowItem;