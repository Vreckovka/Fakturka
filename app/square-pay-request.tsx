
export function getPaySquarePost(
    account: string,
    vs: string,
    amount: number | string,
    name: string,
    pass: string
) {
    const data = `
    <BySquareXmlDocuments xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Username>${name}</Username>
        <Password>${pass}</Password>
        <CountryOptions>
            <Slovak>true</Slovak>
            <Czech>false</Czech>
        </CountryOptions>
        <Documents>  
            <Pay xsi:type="Pay" xmlns="http://www.bysquare.com/bysquare">
                    <Payments>
                        <Payment>
                            <PaymentOptions>paymentorder</PaymentOptions>
                            <Amount>${amount}</Amount>
                            <CurrencyCode>EUR</CurrencyCode>
                            <PaymentDueDate xsi:nil="true" />
                            <BankAccounts>
                                <BankAccount>
                                    <IBAN>${account}</IBAN>
                                    <PayableAmount>720</PayableAmount>
                                </BankAccount>
                            </BankAccounts>
                            <VariableSymbol>${vs}</VariableSymbol>
                        </Payment>
                </Payments>
                <InvoiceID>${vs}</InvoiceID>
            </Pay> 
        </Documents>
    </BySquareXmlDocuments>`

    return data;
}