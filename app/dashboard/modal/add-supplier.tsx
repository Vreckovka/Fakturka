import EntitySettings from "@/app/components/entity/entity.component";
import { DbEntity, Entity } from "@/app/types/Entity";
import { Button } from "@/components/ui/button";
import { PostgrestError } from "@supabase/supabase-js";
import { FunctionComponent } from "react";

export type AddSupplierProperties = {
    closeModal: () => void;
    insertEntity: (entity: DbEntity) => Promise<PostgrestError | null>;
    entity: DbEntity
}


export const AddSupplier: FunctionComponent<AddSupplierProperties> = ({ closeModal, insertEntity, entity }) => {
    return <div>
        <Button onClick={() => closeModal()}>Close</Button>

        <EntitySettings entity={entity} header='Dodávateľ' onUpdate={() => { }} />

        <Button onClick={async () => {
            const result = await insertEntity(entity);

            if (!result) {
                closeModal()
            }
        }}>Save supplier</Button>
    </div>
}

