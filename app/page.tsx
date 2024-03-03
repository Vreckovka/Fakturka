"use client";

import { useEffect, useState } from 'react';
import "./page.scss"
import InvoiceDocument, { InvoiceProps, } from './components/invoice-document.component';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import EntitySettings from './components/entity/entity.component';
import { XMLParser } from 'fast-xml-parser';
import { getPaySquarePost } from './components/square-pay';

const maxWidth = 700;
const maxHeight = 1000;

let styles = {
  pdfDocument: {
    maxWidth: `${maxWidth}px`
  }
}

export default function Sample() {
  const defaultInvoiceData: InvoiceProps = {
    number: '20240002',
    supplier: {
      name: "Ing. Roman Pecho",
      email: "pecho4@gmail.com",
      phoneNumber: "+421949274495",
      address: {
        country: "Slovensko",
        postalCode: "90042",
        address: "Vodárenská 848/9",
        city: "Dunajská Lužná"
      },
      ico: "54369738",
      dic: "1126850725",
      bankAccount: {
        bankName: "Všeobecná úverová banka",
        iban: "SK6602000000003354119758"
      }
    },
    subbscriber: {
      name: "Panaxeo, s.r.o.",
      address: {
        country: "Slovensko",
        postalCode: "83103",
        address: "Kutuzovova 11",
        city: "Bratislava - Nové Mesto"
      },
      ico: "51712202",
      dic: "2120812749",
      icDph: "SK2120812749"
    },
    details: {
      creationDate: "1.3.2024",
      deliveryDate: "29.2.2024",
      dueDate: "1.4.2024",
      creator: "Ing. Roman Pecho",
    },
    invoiceItems:
      [
        {
          amout: 1705.75,
          unit: "kg",
          unitPrice: 5.25,
          name: "Pomaranče, banány"
        },
        {
          amout: 17,
          unit: "ks",
          unitPrice: 105,
          name: "Biele mäso"
        },
        {
          amout: 150,
          unit: "kg",
          unitPrice: 1.2,
          name: "Piesok"
        },
        {
          amout: 150,
          unit: "hod",
          unitPrice: 32,
          name: "Práca"
        },
      ],
      totalSum: 0
  }

  const [invoiceData, setInvoiceData] = useState<InvoiceProps>(defaultInvoiceData);
  const [isClient, setIsClient] = useState(false)
  const [isGeneratedQr, setIsGeneratedQr] = useState(false)
  const totalSum = invoiceData.invoiceItems.reduce((a, b) => a + b.amout * b.unitPrice, 0);

  useEffect(() => {
    setIsClient(true)
  }, [])


  function getPdf() {
    return <InvoiceDocument {...invoiceData} totalSum={totalSum}/>
  }

  async function getSquarePayQr() {
    if (!invoiceData.supplier.bankAccount) {
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: getPaySquarePost(invoiceData.supplier.bankAccount.iban, invoiceData.number, totalSum)
    };

    const data = await fetch('https://app.bysquare.com/api/generateQR', requestOptions)
      .then(response => response.text());
    const parser = new XMLParser();
    const jObj = parser.parse(data);

    if (!jObj.ImageSetOfQRCodes?.PayBySquare) {
      return;
    }

    let newData = { ...invoiceData };
    newData.squarePayData = `data:image/png;base64,${jObj.ImageSetOfQRCodes.PayBySquare}`;

    setInvoiceData(newData)
  }

  return (
    <>
      {isClient &&
        <>
          <div className='invoice-container'>
            <div className='invoice-data-container'>
              <div className='entities-container'>
                <EntitySettings entity={invoiceData.supplier}
                  onUpdate={(x) => {
                    const copy = { ...invoiceData };
                    copy.supplier = x;
                    setInvoiceData(copy);
                  }
                  }
                  header='Dodávateľ'>
                </EntitySettings>

                <EntitySettings entity={invoiceData.subbscriber}
                  onUpdate={(x) => {
                    const copy = { ...invoiceData };
                    copy.subbscriber = x;
                    setInvoiceData(copy);
                  }
                  }
                  header='Odberateľ'>
                </EntitySettings>
              </div>


              <div className='final-settings-container'>
                <button onClick={() => getSquarePayQr()} type='button'>
                  Generatovať QR
                </button>

                <PDFDownloadLink
                  document={getPdf()}
                  fileName={`${invoiceData.supplier.name.replaceAll(" ", "_")
                    .replaceAll(".", "")}-${invoiceData.number}`.toLocaleLowerCase()}>
                  Stiahnuť faktúru</PDFDownloadLink>
              </div>
            </div>


            <div className="invoice-preview-container">
              <div style={styles.pdfDocument}>
                <PDFViewer height={maxHeight} width={maxWidth}>{getPdf()}</PDFViewer>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}