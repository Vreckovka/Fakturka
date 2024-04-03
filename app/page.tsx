"use client";

import { useEffect, useState } from 'react';
import "./page.scss"
import InvoiceDocument, { InvoiceProps, } from './components/invoice-document.component';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import EntitySettings from './components/entity/entity.component';
import { XMLParser } from 'fast-xml-parser';
import { getPaySquarePost } from './square-pay-request';
import InvoiceItemList from './components/list/invoice-item-list.component';

const maxWidth = 700;
const maxHeight = 1000;

let styles = {
  pdfDocument: {
    maxWidth: `${maxWidth}px`
  }
}

function getLastMonth() {
  var d = new Date(); // current date
  d.setDate(1); // going to 1st of the month
  d.setHours(-1); // going to last hour before this date even started.

  return d;
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
      icDph: "SK2120812749",
      bankAccount: {
        bankName: "",
        iban: ""
      }
    },
    details: {
      creationDate: `${new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString()}`,
      deliveryDate: `${getLastMonth().toLocaleDateString()}`,
      dueDate: `${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}`,
      creator: "Ing. Roman Pecho",
    },
    invoiceItems:
      [
        {
          amout: 0,
          unit: "MH",
          unitPrice: 0,
          name: "Software development services according to valid contract"
        },
      ],
    totalSum: 0
  }

  const [invoiceData, setInvoiceData] = useState<InvoiceProps>(defaultInvoiceData);
  const [squareName, setSquareName] = useState<string | null>();
  const [sqaarePassword, setSqaarePassword] = useState<string | null>();

  const squareNameKey = "squareName";
  const squarePassKey = "squarePass";

  const [isClient, setIsClient] = useState(false)
  const totalSum = invoiceData.invoiceItems.reduce((a, b) => a + b.amout * b.unitPrice, 0);

  useEffect(() => {
    setIsClient(true);

    setSquareName(localStorage.getItem(squareNameKey))
    setSqaarePassword(localStorage.getItem(squarePassKey));
  }, [])


  async function getSquarePayQr() {
    if (!invoiceData.supplier.bankAccount || !invoiceData.supplier.bankAccount.iban) {
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: getPaySquarePost(
        invoiceData.supplier.bankAccount.iban,
        invoiceData.number,
        totalSum,
        squareName ?? "",
        sqaarePassword ?? ""
      )
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

  function saveSquareApi() {
    if (!sqaarePassword) {
      localStorage.removeItem(squarePassKey);
    }
    else {
      localStorage.setItem(squarePassKey, sqaarePassword)
    }

    if (!squareName) {
      localStorage.removeItem(squareNameKey);
    }
    else {
      localStorage.setItem(squareNameKey, squareName)
    }
  }

  return (
    <>

      <>
        <div className='invoice-container'>
          <div className='invoice-data-container'>
            <div className='entities-container'>
              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={{ fontWeight: 600 }}>
                  Číslo faktúry:{' '}
                </label>
                <input type='input' value={invoiceData.number}
                  onChange={(x) => {
                    const copy = { ...invoiceData };
                    copy.number = x.target.value;
                    setInvoiceData(copy);
                  }}></input>
              </div>


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

              <InvoiceItemList items={invoiceData.invoiceItems} onUpdate={(x) => {
                const copy = { ...invoiceData };
                copy.invoiceItems = x;
                setInvoiceData(copy);
              }} />
            </div>


            <div className='final-settings-container generate-qr'>
              <input type='input' value={squareName ?? ""} onChange={(x) => setSquareName(x.target.value)}></input>
              <input type='password' value={sqaarePassword ?? ""} onChange={(x) => setSqaarePassword(x.target.value)}></input>

              <button onClick={() => {
                saveSquareApi();
                getSquarePayQr();

              }} type='button' disabled={!squareName || !sqaarePassword}>
                Generatovať QR
              </button>


              {isClient &&
                <PDFDownloadLink
                  document={<InvoiceDocument {...invoiceData} totalSum={totalSum} />}
                  fileName={`${invoiceData.supplier.name
                    .replaceAll(" ", "_")
                    .replaceAll(".", "")}-${invoiceData.number}`
                    .toLocaleLowerCase()}>
                  Stiahnuť faktúru</PDFDownloadLink>
              }
            </div>

          </div>


          {isClient &&
            <div className="invoice-preview-container">
              <div style={styles.pdfDocument}>
                <PDFViewer height={maxHeight} width={maxWidth}>{<InvoiceDocument {...invoiceData} totalSum={totalSum} />}</PDFViewer>
              </div>
            </div>
          }
        </div>
      </>

    </>
  );
}