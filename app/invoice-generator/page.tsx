"use client";

import { useEffect, useRef, useState } from 'react';
import "./page.scss"
import InvoiceDocument, { InvoiceProps, } from '../components/invoice-document.component';
import { PDFDownloadLink, PDFViewer, } from '@react-pdf/renderer';
import EntitySettings from '../components/entity/entity.component';
import { XMLParser } from 'fast-xml-parser';
import { getPaySquarePost } from '../square-pay-request';
import InvoiceItemList from '../components/list/invoice-item-list.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

const maxWidth = 700;
const maxHeight = 1000;

let styles = {
  pdfDocument: {
    maxWidth: `${maxWidth}px`
  }
}

function getLastMonth() {
  let d = new Date();
  d.setDate(1);
  d.setHours(-1);

  return d;
}

function getInvoiceNumber(): string {

  try {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let formattedMonth = month.toString().padStart(4, '0');

    return `${year}${formattedMonth}`;
  }
  catch {
    return "20250001"
  }
}

export default function Sample() {
  const defaultInvoiceData: InvoiceProps = {
    number: getInvoiceNumber(),
    supplier: {
      name: "IPE s.r.o.",
      email: "pecho4@gmail.com",
      phoneNumber: "+421949274495",
      country: "Slovensko",
      postalCode: "95633",
      street: "Pod stanicou 607/5",
      city: "Chynorany",
      ico: "55660665",
      dic: "2122056794",
      bank: "Tatra banka, a.s.",
      iban: "SK9511000000002945154892"
    },
    subbscriber: {
      name: "PDI Technologies Slovakia, s.r.o.",
      country: "Slovensko",
      postalCode: "04011",
      street: "Gemerská 3",
      city: "Košice",
      ico: "45924686",
      dic: "2023132738",
      icDph: "SK2023132738",
      bank: "Tatra banka, a.s.",
      iban: "SK4811000000002924846945"
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
          unitPrice: 30,
          name: "Software and technology building and design, analysis"
        },
      ],
    totalSum: 0
  }

  const [invoiceData, setInvoiceData] = useState<InvoiceProps>(defaultInvoiceData);
  const [squareName, setSquareName] = useState<string | null>();
  const [sqaarePassword, setSqaarePassword] = useState<string | null>();
  // const [file, setFile] = useState<PDFFile>();


  // function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
  //   const { files } = event.target;

  //   if (files && files[0]) {
  //     setFile(files[0] || null);
  //   }
  // }



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
    if (!invoiceData.supplier || !invoiceData.supplier.iban) {
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: getPaySquarePost(
        invoiceData.supplier.iban,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function titleCase(str: string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  function getSignature(text: string) {
    const tCtx = canvasRef.current?.getContext("2d");

    text = titleCase(text);

    if (tCtx) {
      tCtx.canvas.width = 230;
      tCtx.canvas.height = 20;

      tCtx.font = "40px Come unto Me";
      tCtx.fillText(text, 0, 20);
      const data = tCtx.canvas.toDataURL();

      return data;

    }
  }

  const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
  };


  function getInvoiceDocument() {
    return <InvoiceDocument {...invoiceData} totalSum={totalSum} />
  }



  return (
    <>
      {/* <canvas ref={canvasRef}></canvas > */}

      {/* <div className="Example__container__load">
        <Label htmlFor="file">Load from file:</Label>{' '}
        <input onChange={onFileChange} type="file" />
      </div> */}
      <>
        <div className='invoice-container'>
          <div className='invoice-data-container'>
            <div className='entities-container'>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Label style={{ fontWeight: 600 }}>
                  Číslo faktúry:{' '}
                </Label>
                <Input type='input' value={invoiceData.number}
                  onChange={(x) => {
                    const copy = { ...invoiceData };
                    copy.number = x.target.value;
                    setInvoiceData(copy);
                  }} />
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
              <Input type='input' value={squareName ?? ""} onChange={(x) => setSquareName(x.target.value)} />
              <Input type='password' value={sqaarePassword ?? ""} onChange={(x) => setSqaarePassword(x.target.value)} />

              <Button onClick={() => {
                saveSquareApi();
                getSquarePayQr();

              }} type='button' disabled={!squareName || !sqaarePassword}>
                Generatovať QR
              </Button>


              {isClient &&

                <PDFDownloadLink
                  className='download-invoice bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
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
                <PDFViewer height={maxHeight} width={maxWidth}>{getInvoiceDocument()}</PDFViewer>
              </div>

              {/* <div className="Example">
                <header>
                  <h1>react-pdf sample page</h1>
                </header>
                <div className="Example__container">
                  <div className="Example__container__load">
                    <Label htmlFor="file">Load from file:</Label>{' '}
                    <input onChange={onFileChange} type="file" />
                  </div>
                  <div className="Example__container__document" >
                    <Document file={file} options={options}>
                      {Array.from(new Array(1), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={maxWidth}
                        />
                      ))}
                    </Document>
                  </div>
                </div>
              </div> */}
            </div>
          }
        </div>
      </>
    </>
  );
}
