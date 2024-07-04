import { useEffect, useState } from "react";
import { Entity } from "../../types/Entity";
import "./entity.component.scss"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EntitySettings = {
  entity: Entity,
  onUpdate: (entity: Entity) => void;
  header: string;
}


const EntitySettings: React.FunctionComponent<EntitySettings> = ({ entity, onUpdate, header }) => {
  const [localEntity, setEntity] = useState<Entity>(entity);

  return (
    <div className='entity-container'>
      <span className="header">{header}</span>
      <Label>
        Meno:  <Input value={localEntity.name} onChange={(e) => {
          localEntity.name = e.target.value;
          entity.name = localEntity.name;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        Ulica:  <Input value={localEntity.street} onChange={(e) => {
          localEntity.street = e.target.value;
          entity.street = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        PSČ:  <Input value={localEntity.postalCode} onChange={(e) => {
          localEntity.postalCode = e.target.value;
          entity.postalCode = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        Mesto:  <Input value={localEntity.city} onChange={(e) => {
          localEntity.city = e.target.value;
          entity.city = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        Štát:  <Input value={localEntity.country} onChange={(e) => {
          localEntity.country = e.target.value;
          entity.country = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>

        IČO:  <Input value={localEntity.ico} onChange={(e) => {
          localEntity.ico = e.target.value;
          entity.ico = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        DIČ:  <Input value={localEntity.dic} onChange={(e) => {
          localEntity.dic = e.target.value;
          entity.dic = e.target.value;


          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        IČDPH:  <Input value={localEntity.icDph ?? ""} onChange={(e) => {
          localEntity.icDph = e.target.value;
          entity.icDph = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>

      <Label>
        IBAN:  <Input value={localEntity.iban} onChange={(e) => {
          localEntity.iban = e.target.value;
          entity.iban = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>


      <Label>
        BANKA:  <Input value={localEntity.bank} onChange={(e) => {
          localEntity.bank = e.target.value;
          entity.bank = e.target.value;

          setEntity(structuredClone(localEntity));
          onUpdate(localEntity);
        }} />
      </Label>
    </div>
  )
}

export default EntitySettings;