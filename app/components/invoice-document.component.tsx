/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image, Svg, Line } from '@react-pdf/renderer';
import { Entity, InvoiceDetails, InvoiceItem } from '../types/Entity';
import JsBarcode from 'jsbarcode';


Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
  ],
});

Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTS3USBnSvpkopQaUR-2r7iU.ttf", fontWeight: 300 },
    { src: "https://fonts.gstatic.com/s/opensans/v13/IgZJs4-7SA1XX_edsoXWog.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/poppins/v1/4WGKlFyjcmCFVl8pRsgZ9vesZW2xOQ-xsNqO47m55DA.ttf", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/opensans/v13/MTP_ySUJH_bn48VBG8sNSi3USBnSvpkopQaUR-2r7iU.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/opensans/v13/k3k702ZOKiLJc3WVjuplzC3USBnSvpkopQaUR-2r7iU.ttf", fontWeight: 700 },
  ],
});

const boldWeight = 700;

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
    fontFamily: "Open Sans",
    fontSize: 9,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    letterSpacing: 0.1,
    fontWeight: 400
  },
  title: {
    fontSize: 17,
    marginBottom: 10,
    marginTop: 5,
    textAlign: 'left',
    fontWeight: boldWeight
  },
  subtitle: {
    fontSize: 13,
    fontWeight: boldWeight
  },
  heading: {
    display: "flex",
    flexDirection: "row",
  },
  details: {
    display: "flex",
    flexDirection: "row",
  },
  gappedRow: {
    display: "flex",
    flexDirection: "row",
    gap: 15
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  section: {
    marginVertical: 5
  },
  rowColumn: {
    width: 60
  },
  detailColumn: {
    width: 90
  },
  finalColumn: {
    width: 180
  },
  final: {
    fontSize: 18,
    fontWeight: boldWeight
  }
});

export type InvoiceProps = {
  number: string;
  supplier: Entity;
  subbscriber: Entity;
  details: InvoiceDetails
  invoiceItems: InvoiceItem[]
  squarePayData?: string | null;
  totalSum: number;
}


function getEntity(entity: Entity, header: string) {
  return <>
    <View style={styles.section}>
      <Text style={styles.subtitle}>{header}</Text>
      <Text style={{ fontSize: 11, fontWeight: 500 }}>{entity.name}</Text>
      <Text>{entity.address.address}</Text>
      <Text>{entity.address.postalCode.replace(/[^\dA-Z]/g, '').replace(/(.{3})/g, '$1 ').trim()} {entity.address.city}</Text>
      <Text>{entity.address.country}</Text>
    </View>

    <View style={styles.section}>
      <View style={styles.row} >
        <Text style={styles.rowColumn}>IČO:</Text>
        <Text>{entity.ico}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowColumn}>DIČ:</Text>
        <Text>{entity.dic}</Text>
      </View>

      <View style={styles.row}>
        {entity.icDph ?
          <>
            <Text style={styles.rowColumn}>IČDPH:</Text>
            <Text>{entity.icDph}</Text>
          </> :
          <Text>Nie je platca DPH</Text>}

      </View>
    </View>

    {(entity.bankAccount?.bankName || entity.bankAccount?.iban) &&
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.rowColumn, { fontWeight: boldWeight }]}>IBAN:</Text>
          <Text style={{ fontWeight: boldWeight }}>{
            entity.bankAccount?.iban
              .replace(/(.{4})/g, '$1 ')
              .toLocaleUpperCase()
              .trim()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowColumn}>BANKA:</Text>
          <Text>{entity.bankAccount?.bankName}</Text>
        </View>
      </View>}

  </>
}

export function getLocaleNumber(number: Number) {
  return number.toLocaleString("sk-SK", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

const lineStroke = "#aaaaaa";
const supplierWidht = 280;
const fixedMargin = -20;


const itemNameColumnWidth = 245;
const amountColumnWidth = 50;
const unitColumnWidth = 40;
const unitPriceColumnWidth = 60;
const totalPriceColumnWidth = 80;

function getBarcode(data: string) {
  let canvas;

  canvas = document.createElement('canvas');
  JsBarcode(canvas, data, {
    displayValue: false,
    format: "code39",
    lineColor: "#656565"
  });
  return canvas.toDataURL();
}



const InvoiceDocument: React.FunctionComponent<InvoiceProps> = ({
  number,
  supplier,
  subbscriber,
  details,
  invoiceItems,
  squarePayData,
  totalSum
}) => {

  const totalLocaleSum = getLocaleNumber(totalSum);

  return (
    <Document>
      <Page style={styles.body}>,
        <View>
          <Image src={getBarcode(number)} style={{ width: 130, height: 20, marginLeft: -5 }}></Image>

          <Text style={styles.title} >FAKTÚRA {number}</Text>

          <View>
            <Svg width={10} style={{ position: "absolute", top: 0, left: supplierWidht + fixedMargin - 10, height: "100%" }} >
              <Line x1="0" y1="0" x2="0" y2="99999" strokeWidth={1} stroke={lineStroke} />
            </Svg>
            <View style={styles.heading}>

              <View style={{ width: supplierWidht }}>
                {getEntity(supplier, "Dodávateľ")}
              </View>

              <View style={{ marginLeft: fixedMargin }}>
                {getEntity(subbscriber, "Odberateľ")}

                {squarePayData && <Image src={squarePayData} style={{
                  height: 100,
                  width: 100,
                  left: 180,
                  top: 55,
                  position: "absolute"
                }}></Image>}
              </View>
            </View>

            <Svg height={1} >
              <Line x1="0" y1="0" x2="1800" y2="0" strokeWidth={1} stroke={lineStroke} />
            </Svg>

            <View style={styles.section}>
              <View style={styles.details}>
                <View style={{ width: supplierWidht }}>
                  <View style={[styles.gappedRow]}>
                    <Text style={styles.detailColumn}>Dátum vystavenia:</Text>
                    <Text>{details.creationDate}</Text>
                  </View>

                  <View style={styles.gappedRow}>
                    <Text style={styles.detailColumn}>Dátum dodania: </Text>
                    <Text>{details.deliveryDate}</Text>
                  </View>

                  <View style={styles.gappedRow}>
                    <Text style={styles.detailColumn}>Dátum splatnosti:</Text>
                    <Text>{details.dueDate}</Text>
                  </View>
                </View>

                <View style={{ marginLeft: fixedMargin }}>
                  <View style={[styles.gappedRow]}>
                    <Text style={styles.detailColumn}>Forma úhrady:</Text>
                    <Text>peňažný prevod</Text>
                  </View>

                  <View style={[styles.gappedRow]}>
                    <Text style={[styles.detailColumn, { fontWeight: boldWeight }]}>Variabilný symbol:</Text>
                    <Text style={{ fontWeight: boldWeight }}>{number}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Svg height={10}>
            <Line x1="0" y1="0" x2="1400" y2="0" strokeWidth={1} stroke={lineStroke} />
          </Svg>

          <View style={[styles.section, { marginTop: 10 }]}>

            <View style={[styles.gappedRow, { marginBottom: 5 }]}>
              <Text style={{ width: itemNameColumnWidth, fontWeight: boldWeight }}>Popis položky</Text>
              <Text style={{ width: amountColumnWidth, textAlign: "right", fontWeight: boldWeight }}>Množstvo</Text>
              <Text style={{ width: unitColumnWidth, textAlign: "right", fontWeight: boldWeight }}>MJ</Text>
              <Text style={{ width: unitPriceColumnWidth, textAlign: "right", fontWeight: boldWeight }}>Cena za MJ</Text>
              <Text style={{ width: totalPriceColumnWidth, textAlign: "right", fontWeight: boldWeight }}>Celková cena</Text>
            </View>


            <Svg height={2}>
              <Line x1="0" y1="0" x2="1400" y2="0" strokeWidth={1} stroke={lineStroke} />
            </Svg>

            {
              invoiceItems.map((x, y) => {
                return <View key={y}>
                  <View style={[styles.gappedRow, { marginBottom: 2 }]} >
                    <Text style={{ width: itemNameColumnWidth }}>{x.name}</Text>
                    <Text style={{ width: amountColumnWidth, textAlign: "right" }}>{getLocaleNumber(x.amout)}</Text>
                    <Text style={{ width: unitColumnWidth, textAlign: "right" }}>{x.unit}</Text>
                    <Text style={{ width: unitPriceColumnWidth, textAlign: "right" }}>{getLocaleNumber(x.unitPrice)}</Text>
                    <Text style={{ width: totalPriceColumnWidth, textAlign: "right" }}>{getLocaleNumber(x.unitPrice * x.amout)}</Text>
                  </View>

                  <Svg height={2}>
                    <Line x1="0" y1="0" x2="1400" y2="0" strokeWidth={1} stroke={lineStroke} />
                  </Svg>
                </View>
              })
            }

            <View style={[styles.gappedRow, { marginBottom: 0, fontSize: 11, marginTop: 5 }]}>
              <Text style={{
                width:
                  itemNameColumnWidth +
                  amountColumnWidth +
                  unitColumnWidth +
                  unitPriceColumnWidth +
                  46, textAlign: "right", fontWeight: boldWeight
              }}>Spolu:</Text>
              <Text style={{ width: totalPriceColumnWidth, textAlign: "right", fontWeight: boldWeight }}>{totalLocaleSum}</Text>
            </View>
          </View>
        </View>

        <View style={{ width: "100%", height: 120 }}>
          <Svg height={10} >
            <Line x1="-100" y1="5" x2="2800" y2="5" strokeWidth={1} stroke={lineStroke} />
          </Svg>


          <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            textAlign: "left",
            alignItems: "flex-start",
            marginTop: 5
          }}>
            <View style={[styles.section, { width: 320 }]}>
              <View style={styles.row} >
                <Text style={{ width: 45 }}>Vystavil:</Text>
                <Text>{details.creator}</Text>
              </View>


              {(supplier.phoneNumber || supplier.email) && <View>

                {supplier.phoneNumber && <View style={styles.row} >
                  <Text style={{ width: 45 }}>Telefón:</Text>
                  <Text>{supplier.phoneNumber}</Text>
                </View>}
                {supplier.email && <View style={styles.row} >
                  <Text style={{ width: 45 }}>E-mail:</Text>
                  <Text>{supplier.email}</Text>
                </View>}
              </View>}

            </View>

            <Svg width={1} height={210} style={{ marginTop: -5 }} >
              <Line x1="0" y1="0" x2="0" y2="80" strokeWidth={1} stroke={lineStroke} />
            </Svg>


            <View style={[styles.section, {
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "left"
            }]}>
              <View style={{
                display: "flex",
                flexDirection: "column",
                width: 200,
                justifyContent: "space-between"
              }}>
                <View style={[styles.row, { justifyContent: "space-between" }]}>
                  <Text >Celková suma:</Text>
                  <Text>{totalLocaleSum} EUR</Text>
                </View>
                <View style={[styles.row, { justifyContent: "space-between" }]}>
                  <Text >Uhradené zálohami:</Text>
                  <Text >{getLocaleNumber(0)} EUR</Text>
                </View>
                <View style={[styles.row, { justifyContent: "space-between" }]}>
                  <Text >Zostáva uhradiť:</Text>
                  <Text >{totalLocaleSum} EUR</Text>
                </View>
                <View style={[styles.row, { justifyContent: "space-between" }]}>
                  <Text >K úhrade:</Text>
                </View>
              </View>

              <Text style={styles.final}>{totalLocaleSum} EUR</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>)
};

export default InvoiceDocument