export type DbEntity = Entity & {
   id: string;
}

export type Entity = {
   name: string;
   ico: string;
   dic: string;
   icDph?: string;
   street: string;
   postalCode: string;
   city: string;
   country: string;
   iban: string;
   bank: string;
   phoneNumber?: string;
   email?: string;
}


export type InvoiceDetails = {
   creationDate: string;
   deliveryDate: string;
   dueDate: string;
   creator: string;
   reciever?: string;
}

export type InvoiceItem = {
   amout: number,
   unit: string,
   unitPrice: number
   name: string;
}