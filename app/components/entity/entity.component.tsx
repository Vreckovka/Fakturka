import { useEffect, useState } from "react";
import { Entity } from "../../types/Entity";
import "./entity.component.scss"

export type EntitySettings = {
  entity: Entity,
  onUpdate: (entity: Entity) => void;
  header: string;
}


const EntitySettings: React.FunctionComponent<EntitySettings> = ({ entity, onUpdate, header }) =>
(
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
      PSČ:  <input value={entity.address.postalCode} onChange={(e) => {
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
      Štát:  <input value={entity.address.country} onChange={(e) => {
        entity.address.country = e.target.value;
        onUpdate(entity);
      }} />
    </label>

    <label>
      IČO:  <input value={entity.ico} onChange={(e) => {
        entity.ico = e.target.value;
        onUpdate(entity);
      }} />
    </label>

    <label>
      DIČ:  <input value={entity.dic} onChange={(e) => {
        entity.dic = e.target.value;
        onUpdate(entity);
      }} />
    </label>

    <label>
      IČDPH:  <input value={entity.icDph} onChange={(e) => {
        entity.icDph = e.target.value;
        onUpdate(entity);
      }} />
    </label>
  </div>
)

export default EntitySettings;