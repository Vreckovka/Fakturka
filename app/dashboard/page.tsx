"use client"

import { createClient } from "@/app/utils/suppabase/server"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import { cookies } from "../page"
import { PostgrestError, PostgrestSingleResponse, User } from "@supabase/supabase-js"
import Modal from 'react-modal';
import EntitySettings from "../components/entity/entity.component"
import { DbEntity, Entity } from "../types/Entity"
import { AddSupplier } from "./modal/add-supplier"
import Link from "next/link"

export default function Dashboard() {
    const [suppliers, setSuppliers] = useState<DbEntity[] | null>();
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState<boolean>(false);
    const [entity, setEntity] = useState<DbEntity>({} as DbEntity);

    const user = cookies.get('user') as User;

    const supabase = createClient()

    async function addSupplier(entity: DbEntity) {

        console.log(entity)
        if (entity.name) {
            let result: PostgrestSingleResponse<null>;

            if (entity.id) {
                result = await supabase
                    .from('Entity')
                    .update(
                        {
                            user_id: user.id,
                            ...entity
                        }
                    )
                    .eq("id", entity.id)
            }
            else {
                result = await supabase
                    .from('Entity')
                    .insert(
                        {
                            user_id: user.id,
                            ...entity
                        }
                    )
            }



            await getSuppliers();

            console.log(result);

            return result.error;
        }

        return { message: "No name" } as PostgrestError
    }


    async function getSuppliers() {

        const asd = await supabase
            .from('Entity')
            .select()
            .eq("user_id", user?.id)

        setSuppliers(asd.data as DbEntity[]);
    }

    async function removeEntity(id: string) {
        await supabase
            .from('Entity')
            .delete()
            .eq("id", id)

        await getSuppliers();
    }

    useEffect(() => {
        getSuppliers();
    }, [])


    return <>
        <div>
            <ul>
                {
                    suppliers?.map(d => (
                        <li key={d.id}>{`${d.id} ${d.name}`}
                            <Button onClick={() => { setEntity(d); setIsSupplierModalOpen(true) }}>Edit</Button>
                            <Button onClick={() => removeEntity(d.id)}>Delete</Button>

                        </li>
                    )
                    )
                }
            </ul>

        </div>


        <Modal
            isOpen={isSupplierModalOpen}
            contentLabel="Minimal Modal Example"
        >
            <AddSupplier closeModal={() => setIsSupplierModalOpen(false)} insertEntity={addSupplier} entity={structuredClone(entity)} />
        </Modal>

        <Button onClick={() => { setEntity({} as DbEntity); setIsSupplierModalOpen(true) }}>
            Add supplier
        </Button >

        <Link href="/invoice-generator">Vytvoriť faktúru</Link>

    </>
}