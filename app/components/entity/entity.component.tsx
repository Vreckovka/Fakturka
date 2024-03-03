import { useEffect, useState } from "react";
import { Entity } from "../../types/Entity";
import "./entity.component.scss"

export type EntitySettings = {
    entity: Entity,
    onUpdate: (entity: Entity) => void;
    header: string;
}


const EntitySettings: React.FunctionComponent<EntitySettings> = ({entity, onUpdate, header}) =>
{
    const [entityToEdit, setEntityToEdit] = useState<Entity>();

    useEffect(() =>{

    }, [entity])


    return (<>
      <div className='entity-container'>
            <span className="header">{header}</span>
            <label>
              Meno:  <input value={entity.name} onChange={(e) => {
                entity.name = e.target.value;
                onUpdate(entity);
              }} />
            </label>

            <label>
              Ulica:  <input value={entity.address.address} onChange={(e) => {
                entity.address.address = e.target.value;
                onUpdate(entity);
              }} />
            </label>

            <label>
              PSC:  <input value={entity.address.postalCode} onChange={(e) => {
                entity.address.postalCode = e.target.value;
                onUpdate(entity);
              }} />
            </label>

            <label>
              Mesto:  <input value={entity.address.city} onChange={(e) => {
               entity.address.city = e.target.value;
               onUpdate(entity);
              }} />
            </label>

            <label>
              Stat:  <input value={entity.address.country} onChange={(e) => {
                entity.address.country = e.target.value;
                onUpdate(entity);
              }} />
            </label>

            <label>
              ICO:  <input value={entity.ico} onChange={(e) => {
                entity.ico = e.target.value;
                onUpdate(entity);
              }} />
            </label>

            <label>
              DIC:  <input value={entity.dic} onChange={(e) => {
                entity.dic = e.target.value;
                onUpdate(entity);
              }} />
            </label>

          </div></>)
}

export default EntitySettings;