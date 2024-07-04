import { InvoiceItem } from "@/app/types/Entity";
import "./invoice-item-list.component.scss"
import { useState } from "react";
import InvoiceRowItem from "./invoice-row-item.component.tsx/invoice-row-item.component";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


type InvoiceItemListProps = {
    items: InvoiceItem[];
    onUpdate: (items: InvoiceItem[]) => void
}



const InvoiceItemList: React.FunctionComponent<InvoiceItemListProps> = ({ items, onUpdate }) => {
    const [isItemNameEdit, setIsItemNameEdit] = useState<boolean>(false);


    return (
        <div className="item-list-container">
            <div className="list-header-container">
                <div className="list-header">
                    <Label>Popis položky</Label>
                    <Label>Množstvo</Label>
                    <Label>MJ</Label>
                    <Label>Cena za MJ</Label>
                    <Label>Celková cena</Label>
                </div>

            </div>

            {items.map((invoiceItem, y) => {
                return <InvoiceRowItem invoiceItem={invoiceItem} key={y}
                    onUpdate={() => onUpdate(items)}
                    onRemove={(item) => {
                        const index = items.indexOf(invoiceItem);

                        if (index > -1) {
                            items.splice(index, 1);
                            onUpdate(items);
                        }
                    }} />
            })}

            <Button className="new-item" type="button" onClick={(x) => {
                items.push({ amout: 0, name: "Nová", unit: "xy", unitPrice: 0 });
                onUpdate(items);
            }}>+ Pridaj položku</Button>
        </div>
    )
}

export default InvoiceItemList;