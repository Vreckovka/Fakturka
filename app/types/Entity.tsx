export type Entity = {
    name: string;
    ico: string;
    dic: string;
    icDph?: string;
    address: Address;
    bankAccount?: BankAccount;
    phoneNumber?: string;
    email?: string;
 }

 export type Address = {
    address: string;
    postalCode: string;
    city: string;
    country: string;
 }

 export type BankAccount = {
    iban: string;
    bankName: string;
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