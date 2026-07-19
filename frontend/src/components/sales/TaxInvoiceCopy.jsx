import { Fragment } from "react";
import { numberToWordsInr } from "../../utils/invoiceCopyData";

const cell = "border border-slate-800 px-1.5 py-0.5 text-[11px] leading-tight text-slate-900";
const th = `${cell} font-semibold bg-slate-50`;

export default function TaxInvoiceCopy({ data, showPrintButton = true }) {
  if (!data) return null;

  const qtyTotal = data.items.reduce((s, it) => s + parseFloat(it.qty || 0), 0);
  const unitLabel = data.items[0]?.unit || "SQM";

  const handlePrint = () => window.print();

  return (
    <div className="tax-invoice-copy mx-auto max-w-[900px] bg-white text-slate-900">
      {showPrintButton && (
        <div className="mb-4 flex gap-2 print:hidden">
          <button type="button" onClick={handlePrint} className="ui-btn-primary text-sm">
            Print Invoice Copy
          </button>
        </div>
      )}

      <div className="border-2 border-slate-800 p-3 print:p-2">
        {/* e-Invoice header row */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2 text-slate-900">
          <div className="text-[10px] w-[35%]">
            {data.eInvoice && (
              <div className="space-y-0.5 text-left">
                <p><span className="font-semibold">IRN :</span> <span className="break-all font-mono text-[9px]">{data.irn || "—"}</span></p>
                <p><span className="font-semibold">Ack No. :</span> {data.ackNo || "—"}</p>
                <p><span className="font-semibold">Ack Date :</span> {data.ackDate || "—"}</p>
              </div>
            )}
          </div>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold tracking-wide uppercase mt-1">{data.title}</h1>
          </div>
          <div className="flex items-start gap-4 w-[40%] justify-end shrink-0">
            {data.eInvoice && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(data.irn || data.meta.invoiceNo || "INV")}`}
                alt="QR Code"
                className="h-12 w-12 border border-slate-400 bg-white p-0.5 shrink-0"
              />
            )}
          </div>
        </div>

        {/* Seller + invoice meta */}
        <table className="w-full border-collapse mb-0">
          <tbody>
            <tr>
              <td className={`${cell} align-top w-[55%]`} rowSpan={7}>
                {/* 1. Seller Info */}
                <div className="flex gap-3 pb-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-slate-300 bg-blue-50 text-[9px] font-bold text-blue-700">
                    LOGO
                  </div>
                  <div className="text-[11px] leading-tight">
                    <p className="text-sm font-bold text-blue-800">{data.seller.name}</p>
                    {data.seller.tagline && <p className="text-[10px] italic text-blue-600">{data.seller.tagline}</p>}
                    <p className="mt-1">{data.seller.address}</p>
                    {data.seller.udyam && <p>{data.seller.udyam}</p>}
                    <p><span className="font-semibold">GSTIN/UIN :</span> {data.seller.gstin}</p>
                    <p><span className="font-semibold">State Name :</span> {data.seller.state}</p>
                    {data.seller.cin && <p><span className="font-semibold">CIN :</span> {data.seller.cin}</p>}
                    {data.seller.email && <p><span className="font-semibold">E-Mail :</span> {data.seller.email}</p>}
                  </div>
                </div>

                {/* 2. Consignee Info */}
                <div className="border-t border-slate-800 pt-2 pb-3 text-[11px] leading-tight">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Consignee (Ship to)</p>
                  <p className="font-bold text-slate-900">{data.consignee.name}</p>
                  <p className="text-slate-800 leading-normal">{data.consignee.address}</p>
                  {data.consignee.contact && <p className="text-slate-800">{data.consignee.contact}</p>}
                  <div className="mt-2 space-y-0.5 text-[11px] text-slate-800">
                    {data.consignee.gstin && (
                      <div className="flex">
                        <span className="w-24 font-semibold shrink-0">GSTIN/UIN</span>
                        <span className="mr-2">:</span>
                        <span>{data.consignee.gstin}</span>
                      </div>
                    )}
                    {data.consignee.state && (
                      <div className="flex">
                        <span className="w-24 font-semibold shrink-0">State Name</span>
                        <span className="mr-2">:</span>
                        <span>{data.consignee.state}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Buyer Info */}
                <div className="border-t border-slate-800 pt-2 text-[11px] leading-tight">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Buyer (Bill to)</p>
                  <p className="font-bold text-slate-900">{data.buyer.name}</p>
                  <p className="text-slate-800 leading-normal">{data.buyer.address}</p>
                  {data.buyer.contact && <p className="text-slate-800">{data.buyer.contact}</p>}
                  <div className="mt-2 space-y-0.5 text-[11px] text-slate-800">
                    {data.buyer.gstin && (
                      <div className="flex">
                        <span className="w-24 font-semibold shrink-0">GSTIN/UIN</span>
                        <span className="mr-2">:</span>
                        <span>{data.buyer.gstin}</span>
                      </div>
                    )}
                    {data.buyer.state && (
                      <div className="flex">
                        <span className="w-24 font-semibold shrink-0">State Name</span>
                        <span className="mr-2">:</span>
                        <span>{data.buyer.state}</span>
                      </div>
                    )}
                    {data.placeOfSupply && (
                     <div className="flex border-t border-slate-800 pt-1 mt-1">
                       <span className="w-24 font-semibold shrink-0">Place of Supply</span>
                       <span className="mr-2">:</span>
                       <span>{data.placeOfSupply}</span>
                     </div>
                   )}
                  </div>
                </div>
              </td>
              <td className={cell}><span className="font-semibold">Invoice No.</span><br />{data.meta.invoiceNo}</td>
              <td className={cell}><span className="font-semibold">e-Way Bill No.</span><br />{data.meta.eWayBillNo || ""}</td>
              <td className={cell}><span className="font-semibold">Dated</span><br />{data.meta.date}</td>
            </tr>
            <tr>
              <td className={cell}><span className="font-semibold">Delivery Note</span><br />{data.meta.deliveryNote || ""}</td>
              <td className={cell} colSpan={2}><span className="font-semibold">Mode/Terms of Payment</span><br />{data.meta.modeTerms}</td>
            </tr>
            <tr>
              <td className={cell}><span className="font-semibold">Reference No. & Date.</span><br />{data.meta.referenceNo || ""}</td>
              <td className={cell} colSpan={2}><span className="font-semibold">Other References</span><br /></td>
            </tr>
            <tr>
              <td className={cell}><span className="font-semibold">Buyer's Order No.</span><br />{data.meta.buyersOrderNo || ""}</td>
              <td className={cell} colSpan={2}><span className="font-semibold">Dated</span><br /></td>
            </tr>
            <tr>
              <td className={cell}><span className="font-semibold">Dispatch Doc No.</span><br />{data.meta.dispatchDocNo || ""}</td>
              <td className={cell} colSpan={2}><span className="font-semibold">Delivery Note Date</span><br /></td>
            </tr>
            <tr>
              <td className={cell}><span className="font-semibold">Dispatched through</span><br />{data.meta.dispatchedThrough || ""}</td>
              <td className={cell} colSpan={2}><span className="font-semibold">Destination</span><br />{data.meta.destination}</td>
            </tr>
            <tr>
              <td className={cell} colSpan={3}><span className="font-semibold">Terms of Delivery</span><br />{data.meta.termsOfDelivery || ""}</td>
            </tr>
          </tbody>
        </table>

        {/* Line items */}
        <table className="w-full border-collapse mt-0">
          <thead>
            <tr>
              <th className={th}>SI No.</th>
              <th className={`${th} w-[40%]`}>Description of Goods</th>
              <th className={th}>HSN/SAC</th>
              <th className={th}>Quantity</th>
              <th className={th}>Rate</th>
              <th className={th}>per</th>
              <th className={th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const hasCgst = (item.cgstAmount || 0) > 0;
              const hasSgst = (item.sgstAmount || 0) > 0;
              const hasIgst = (item.igstAmount || 0) > 0;

              return (
                <Fragment key={item.si}>
                  <tr>
                    <td className={`${cell} text-center align-top`}>{item.si}</td>
                    <td className={cell}><span className="whitespace-pre-wrap font-medium">{item.description}</span></td>
                    <td className={`${cell} text-center align-top`}>{item.hsn}</td>
                    <td className={`${cell} text-right align-top`}>{item.qty}</td>
                    <td className={`${cell} text-right align-top`}>{item.rate}</td>
                    <td className={`${cell} text-center align-top`}>{item.unit}</td>
                    <td className={`${cell} text-right font-medium align-top`}>{item.amount.toFixed(3)}</td>
                  </tr>

                  {hasCgst && (
                    <tr>
                      <td className={cell} />
                      <td className={`${cell} text-right pr-4 font-semibold italic`}>CGST</td>
                      <td className={cell} />
                      <td className={cell} />
                      <td className={`${cell} text-right`}>{(item.cgstPct || 0).toFixed(0)}</td>
                      <td className={`${cell} text-center`}>%</td>
                      <td className={`${cell} text-right font-semibold`}>{item.cgstAmount.toFixed(3)}</td>
                    </tr>
                  )}

                  {hasSgst && (
                    <tr>
                      <td className={cell} />
                      <td className={`${cell} text-right pr-4 font-semibold italic`}>SGST</td>
                      <td className={cell} />
                      <td className={cell} />
                      <td className={`${cell} text-right`}>{(item.sgstPct || 0).toFixed(0)}</td>
                      <td className={`${cell} text-center`}>%</td>
                      <td className={`${cell} text-right font-semibold`}>{item.sgstAmount.toFixed(3)}</td>
                    </tr>
                  )}

                  {hasIgst && (
                    <tr>
                      <td className={cell} />
                      <td className={`${cell} text-right pr-4 font-semibold`}>IGST</td>
                      <td className={cell} />
                      <td className={cell} />
                      <td className={`${cell} text-right`}>{(item.igstPct || 0).toFixed(0)}</td>
                      <td className={`${cell} text-center`}>%</td>
                      <td className={`${cell} text-right font-semibold`}>{item.igstAmount.toFixed(3)}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}

            {data.roundOff !== 0 && (
              <tr>
                <td className={cell} />
                <td className={cell}>
                  <div className="flex justify-between font-semibold">
                    <span>Less :</span>
                    <span>ROUNDED OFF</span>
                  </div>
                </td>
                <td className={cell} />
                <td className={cell} />
                <td className={cell} />
                <td className={cell} />
                <td className={`${cell} text-right font-semibold`}>
                  {data.roundOff < 0 ? `(-)${Math.abs(data.roundOff).toFixed(3)}` : data.roundOff.toFixed(3)}
                </td>
              </tr>
            )}

            <tr>
              <td className={cell} colSpan={3} style={{ fontWeight: 700 }}>Total</td>
              <td className={`${cell} text-right font-bold`}>{qtyTotal.toFixed(2)} {unitLabel}</td>
              <td className={cell} colSpan={2} />
              <td className={`${cell} text-right font-bold text-base`}>₹ {data.grandTotal.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>

        <p className={`${cell} border-t-0`}>
          <span className="font-semibold">Amount Chargeable (in words)</span><br />
          {numberToWordsInr(data.grandTotal)}
        </p>

        {/* Tax summary */}
        <table className="w-full border-collapse">
          <thead>
            {data.cgstTotal > 0 ? (
              <>
                <tr>
                  <th className={th} rowSpan={2}>HSN/SAC</th>
                  <th className={th} rowSpan={2}>Taxable Value</th>
                  <th className={th} colSpan={2}>CGST</th>
                  <th className={th} colSpan={2}>SGST/UTGST</th>
                  <th className={th} rowSpan={2}>Total Tax Amount</th>
                </tr>
                <tr>
                  <th className={th}>Rate</th>
                  <th className={th}>Amount</th>
                  <th className={th}>Rate</th>
                  <th className={th}>Amount</th>
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <th className={th} rowSpan={2}>HSN/SAC</th>
                  <th className={th} rowSpan={2}>Taxable Value</th>
                  <th className={th} colSpan={2}>IGST</th>
                  <th className={th} rowSpan={2}>Total Tax Amount</th>
                </tr>
                <tr>
                  <th className={th}>Rate</th>
                  <th className={th}>Amount</th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {data.items.map((item) => {
              const hasCgst = data.cgstTotal > 0;
              if (hasCgst) {
                const cgstRate = item.cgstPct || 0;
                const cgstAmt = item.cgstAmount || 0;
                const sgstRate = item.sgstPct || 0;
                const sgstAmt = item.sgstAmount || 0;
                const totalTax = cgstAmt + sgstAmt;
                return (
                  <tr key={`tax-${item.si}`}>
                    <td className={`${cell} text-center`}>{item.hsn}</td>
                    <td className={`${cell} text-right`}>{item.amount.toFixed(3)}</td>
                    <td className={`${cell} text-center`}>{cgstRate}%</td>
                    <td className={`${cell} text-right`}>{cgstAmt.toFixed(3)}</td>
                    <td className={`${cell} text-center`}>{sgstRate}%</td>
                    <td className={`${cell} text-right`}>{sgstAmt.toFixed(3)}</td>
                    <td className={`${cell} text-right font-medium`}>{totalTax.toFixed(3)}</td>
                  </tr>
                );
              } else {
                const igstRate = item.igstPct || 0;
                const igstAmt = item.igstAmount || 0;
                return (
                  <tr key={`tax-${item.si}`}>
                    <td className={`${cell} text-center`}>{item.hsn}</td>
                    <td className={`${cell} text-right`}>{item.amount.toFixed(3)}</td>
                    <td className={`${cell} text-center`}>{igstRate}%</td>
                    <td className={`${cell} text-right`}>{igstAmt.toFixed(3)}</td>
                    <td className={`${cell} text-right font-medium`}>{igstAmt.toFixed(3)}</td>
                  </tr>
                );
              }
            })}
            {data.cgstTotal > 0 ? (
              <tr>
                <td className={`${cell} font-bold`}>Total</td>
                <td className={`${cell} text-right font-bold`}>{data.taxableTotal.toFixed(3)}</td>
                <td className={cell} />
                <td className={`${cell} text-right font-bold`}>{data.cgstTotal.toFixed(3)}</td>
                <td className={cell} />
                <td className={`${cell} text-right font-bold`}>{data.sgstTotal.toFixed(3)}</td>
                <td className={`${cell} text-right font-bold`}>{(data.cgstTotal + data.sgstTotal).toFixed(3)}</td>
              </tr>
            ) : (
              <tr>
                <td className={`${cell} font-bold`}>Total</td>
                <td className={`${cell} text-right font-bold`}>{data.taxableTotal.toFixed(3)}</td>
                <td className={cell} />
                <td className={`${cell} text-right font-bold`}>{data.igstTotal.toFixed(3)}</td>
                <td className={`${cell} text-right font-bold`}>{data.igstTotal.toFixed(3)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <p className={`${cell} border-t-0`}>
          <span className="font-semibold">Tax Amount (in words) :</span> {numberToWordsInr(data.cgstTotal > 0 ? (data.cgstTotal + data.sgstTotal) : data.igstTotal)}
        </p>

         {/* Footer */}
        <div className="grid grid-cols-2 gap-0 border border-t-0 border-slate-800">
          {/* Top Row: Declaration & Remarks on Left, Rejection Policy on Right */}
          <div className="p-2 text-[9px] leading-snug flex flex-col justify-between border-r border-slate-800 border-b border-slate-800">
            <div>
              <p className="font-bold mb-1 text-slate-800">Declaration</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-800">
                <li>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</li>
                <li>Interest @ 6.24% per annum will be charged on overdue payments.</li>
                <li>Subject to Hyderabad jurisdiction.</li>
              </ol>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-slate-800">Remarks :</p>
              <p className="text-slate-800">{data.remarks}</p>
            </div>
          </div>
          
          <div className="p-2 text-[9px] leading-snug flex flex-col justify-between border-b border-slate-800">
            <div>
              <p className="font-bold mb-1 text-slate-800">Rejection Policy :</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-800">
                <li>Goods must be inspected upon receipt.</li>
                <li>Claims must be made within 7 days of delivery.</li>
                <li>Returns subject to management approval.</li>
              </ol>
            </div>
          </div>

          {/* Bottom Row: Prepared/Verified on Left, SMRT Signature/Authorised Signatory on Right */}
          <div className="p-2 text-[10px] text-slate-900 font-semibold flex justify-between px-4 items-end border-r border-slate-800 min-h-[65px]">
            <span>Prepared by</span>
            <span>Verified by</span>
          </div>

          <div className="p-2 text-[9px] flex flex-col justify-between min-h-[65px]">
            <div className="text-right pr-2">
              <p className="font-bold text-slate-800">for {data.seller.name}</p>
            </div>
            <div className="text-center text-[10px] text-slate-900 font-semibold mt-auto pt-4">
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-500 mt-2 font-medium print:block">
        This is a Computer Generated Invoice
      </p>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .tax-invoice-copy, .tax-invoice-copy * { visibility: visible; }
          .tax-invoice-copy { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
