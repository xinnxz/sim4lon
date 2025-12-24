import{j as jsxRuntimeExports}from"./jsx-runtime.mvtouYz0.js";import{r as reactExports}from"./index.DcciWILN.js";import{S as SafeIcon,B as Button}from"./SafeIcon.CAGsavDo.js";import{C as Card,a as CardContent}from"./card.D0gylVsf.js";import{B as Badge}from"./badge.DZiJ6zSB.js";import{S as Separator}from"./separator.bhOikD5L.js";import{T as Tabs,a as TabsList,b as TabsTrigger}from"./tabs.BmAU3oNV.js";import{ordersApi,paymentApi,companyProfileApi}from"./api.Dr7hS9Y8.js";import{f as formatCurrency}from"./currency.DQ9ceiwM.js";import{t as toast}from"./index.fAd_ikgp.js";import{u as useAppSettings}from"./useAppSettings.DmDEw9Dm.js";import"./index.PIAPtHoh.js";import"./index.ubNQCTBn.js";import"./index.BpQ989z7.js";import"./index.DQDOfy24.js";import"./index.BStXkqMp.js";import"./index.YpXgcoRz.js";import"./index.Dovp0-D8.js";import"./index.Drh0kMGk.js";import"./index.CdmyERTi.js";function NotaPembayaranPage(){const[documentType,setDocumentType]=reactExports.useState("nota"),[data,setData]=reactExports.useState(null),[isLoading,setIsLoading]=reactExports.useState(!0),[error,setError]=reactExports.useState(null),[isPrinting,setIsPrinting]=reactExports.useState(!1),[companyProfile,setCompanyProfile]=reactExports.useState(null),{settings:appSettings}=useAppSettings();reactExports.useEffect(()=>{if(typeof window>"u")return;const params=new URLSearchParams(window.location.search),orderId=params.get("id")||params.get("orderId"),type=params.get("type");if((type==="invoice"||type==="nota")&&setDocumentType(type),!orderId){setError("Order ID tidak ditemukan"),setIsLoading(!1);return}fetchData(orderId)},[]);const fetchData=async orderId=>{try{setIsLoading(!0);const[order,payment,profile]=await Promise.all([ordersApi.getById(orderId),paymentApi.getOrderPayment(orderId).catch(()=>null),companyProfileApi.get().catch(()=>null)]);profile&&setCompanyProfile(profile);const pangkalan=order.pangkalans,items=order.order_items.map(item=>({name:item.label||`LPG ${item.lpg_type}`,quantity:item.qty,unitPrice:Number(item.price_per_unit),subtotal:Number(item.sub_total||item.price_per_unit*item.qty)})),subtotal=items.reduce((sum,item)=>sum+item.subtotal,0),taxAmount=items.reduce((sum,item)=>{const itemTax=order.order_items.find(oi=>(oi.label||oi.lpg_type)===item.name)?.tax_amount||0;return sum+Number(itemTax)},0),isPaidFromStatus=["DIPROSES","DIKIRIM","SELESAI"].includes(order.current_status),isPaid=payment?.is_paid||isPaidFromStatus;setData({orderId:order.id,orderCode:order.code||`ORD-${order.id.slice(0,4).toUpperCase()}`,orderDate:new Date(order.created_at).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),customerName:pangkalan?.name||"Unknown",customerAddress:pangkalan?.address||"",customerPhone:pangkalan?.phone||"",customerEmail:pangkalan?.email||"",contactPerson:pangkalan?.pic_name||"",items,subtotal,taxRate:appSettings.ppnRate,taxAmount,total:order.total_amount,isPaid,paymentMethod:payment?.payment_method||null,paymentDate:payment?.payment_date?new Date(payment.payment_date).toLocaleDateString("id-ID"):null,amountPaid:Number(payment?.amount_paid||0)}),setError(null)}catch(err){console.error("Failed to fetch document data:",err),setError(err.message||"Gagal memuat data dokumen")}finally{setIsLoading(!1)}},handlePrint=()=>{setIsPrinting(!0),setTimeout(()=>{window.print(),setIsPrinting(!1)},100)},handleShareWhatsApp=()=>{if(!data)return;const isNota2=documentType==="nota",docTitle=isNota2?"NOTA PEMBAYARAN":"INVOICE",itemLines=data.items.map(item=>`• ${item.name} x${item.quantity} = ${formatCurrency(item.subtotal)}`).join(`
`),docLink=window.location.href,message=`*${docTitle}*

\`No: ${data.orderCode}\`
\`Tgl: ${data.orderDate}\`

*Kepada:*
${data.customerName}
${data.customerAddress}

*Detail Pesanan:*
${itemLines}

\`\`\`
Subtotal : ${formatCurrency(data.subtotal)}
PPN 12%  : ${formatCurrency(data.taxAmount)}
─────────────────────
TOTAL    : ${formatCurrency(data.total)}
\`\`\`

${isNota2?"✅ *Status: LUNAS*":"⏳ *Status: Belum Dibayar*"}

📄 *Lihat Dokumen:*
${docLink}

_SIM4LON - Sistem Manajemen LPG_`,phone=data.customerPhone.replace(/\D/g,""),whatsappUrl=`https://wa.me/62${phone.startsWith("0")?phone.slice(1):phone}?text=${encodeURIComponent(message)}`;window.open(whatsappUrl,"_blank")},handleCopyLink=()=>{const url=window.location.href;navigator.clipboard.writeText(url),toast.success("Link berhasil disalin!")};if(isLoading)return jsxRuntimeExports.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",children:jsxRuntimeExports.jsxs("div",{className:"text-center",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"Loader2",className:"h-8 w-8 animate-spin mx-auto text-primary"}),jsxRuntimeExports.jsx("p",{className:"mt-2 text-muted-foreground",children:"Memuat dokumen..."})]})});if(error||!data)return jsxRuntimeExports.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",children:jsxRuntimeExports.jsx(Card,{className:"max-w-md glass-card",children:jsxRuntimeExports.jsxs(CardContent,{className:"pt-6 text-center space-y-4",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"AlertCircle",className:"h-12 w-12 mx-auto text-destructive"}),jsxRuntimeExports.jsx("h2",{className:"text-xl font-semibold",children:"Gagal Memuat Dokumen"}),jsxRuntimeExports.jsx("p",{className:"text-muted-foreground",children:error||"Data tidak ditemukan"}),jsxRuntimeExports.jsx(Button,{onClick:()=>window.location.href="/daftar-pesanan",children:"Kembali ke Daftar Pesanan"})]})})});const isNota=documentType==="nota",docNumber=isNota?`NOTA-${data.orderCode.replace("ORD-","")}`:`INV-${data.orderCode.replace("ORD-","")}`;return jsxRuntimeExports.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4",children:[jsxRuntimeExports.jsxs("div",{className:"max-w-4xl mx-auto",children:[jsxRuntimeExports.jsxs("div",{className:"mb-6 flex flex-wrap gap-3 print:hidden",children:[jsxRuntimeExports.jsxs(Button,{onClick:()=>{const params=new URLSearchParams(window.location.search),orderId=params.get("id")||params.get("orderId");orderId?window.location.href=`/detail-pesanan?id=${orderId}`:window.location.href="/daftar-pesanan"},variant:"outline",className:"gap-2",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"ArrowLeft",className:"h-4 w-4"}),"Kembali"]}),jsxRuntimeExports.jsx(Tabs,{value:documentType,onValueChange:v=>{if(v==="nota"&&!data.isPaid){toast.error("Nota hanya tersedia setelah pembayaran lunas");return}setDocumentType(v)},children:jsxRuntimeExports.jsxs(TabsList,{className:"bg-secondary",children:[jsxRuntimeExports.jsxs(TabsTrigger,{value:"invoice",className:"gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"FileText",className:"h-4 w-4"}),"Invoice"]}),jsxRuntimeExports.jsxs(TabsTrigger,{value:"nota",className:"gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white",disabled:!data.isPaid,title:data.isPaid?"":"Nota tersedia setelah pembayaran lunas",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"Receipt",className:"h-4 w-4"}),"Nota",!data.isPaid&&jsxRuntimeExports.jsx(SafeIcon,{name:"Lock",className:"h-3 w-3 ml-1 opacity-50"})]})]})}),jsxRuntimeExports.jsx("div",{className:"flex-1"}),jsxRuntimeExports.jsxs(Button,{onClick:handleCopyLink,variant:"outline",className:"gap-2",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"Link",className:"h-4 w-4"}),"Copy Link"]}),jsxRuntimeExports.jsxs(Button,{onClick:handleShareWhatsApp,variant:"outline",className:"gap-2",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"MessageCircle",className:"h-4 w-4"}),"Share WA"]}),jsxRuntimeExports.jsxs(Button,{onClick:handlePrint,disabled:isPrinting,className:"gap-2 bg-primary hover:bg-primary/90",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"Printer",className:"h-4 w-4"}),isPrinting?"Mencetak...":"Print"]})]}),jsxRuntimeExports.jsxs(Card,{className:"bg-white dark:bg-card shadow-xl dark:shadow-2xl print:shadow-none print:border-0 relative overflow-hidden print:overflow-visible border-0",children:[isNota&&data.isPaid&&jsxRuntimeExports.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none z-10",children:jsxRuntimeExports.jsx("div",{className:"text-green-500/10 dark:text-green-400/10 print:text-green-500/15",style:{fontSize:"clamp(100px, 20vw, 180px)",fontWeight:900,transform:"rotate(-35deg)",letterSpacing:"0.15em",textTransform:"uppercase",userSelect:"none",whiteSpace:"nowrap"},children:"LUNAS"})}),jsxRuntimeExports.jsxs(CardContent,{className:"p-8 print:p-6 relative",children:[jsxRuntimeExports.jsxs("div",{className:"flex justify-between items-start mb-8",children:[jsxRuntimeExports.jsxs("div",{className:"flex items-center gap-4",children:[companyProfile?.logo_url?jsxRuntimeExports.jsx("img",{src:companyProfile.logo_url,alt:"Company Logo",className:"w-16 h-16 object-contain rounded-lg border"}):jsxRuntimeExports.jsx("div",{className:"w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center",children:jsxRuntimeExports.jsx(SafeIcon,{name:"Building2",className:"h-8 w-8 text-primary"})}),jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx("h1",{className:"text-xl font-bold text-primary",children:companyProfile?.company_name||"SIM4LON"}),jsxRuntimeExports.jsx("p",{className:"text-xs text-muted-foreground",children:companyProfile?.address||"Sistem Manajemen LPG"}),companyProfile?.phone&&jsxRuntimeExports.jsxs("p",{className:"text-xs text-muted-foreground",children:["Tel: ",companyProfile.phone]})]})]}),jsxRuntimeExports.jsxs("div",{className:"text-right",children:[jsxRuntimeExports.jsx("h2",{className:"text-2xl font-bold text-gray-800 dark:text-gray-100",children:isNota?"NOTA PEMBAYARAN":"INVOICE"}),jsxRuntimeExports.jsx("p",{className:"text-sm font-mono mt-1",children:docNumber}),jsxRuntimeExports.jsx("p",{className:"text-sm text-muted-foreground",children:data.orderDate}),isNota&&data.isPaid&&jsxRuntimeExports.jsxs(Badge,{className:"mt-2 bg-green-500 text-white",children:[jsxRuntimeExports.jsx(SafeIcon,{name:"CheckCircle",className:"h-3 w-3 mr-1"}),"LUNAS"]})]})]}),jsxRuntimeExports.jsx(Separator,{className:"my-6"}),jsxRuntimeExports.jsxs("div",{className:"grid grid-cols-2 gap-8 mb-8",children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"TAGIHAN KEPADA"}),jsxRuntimeExports.jsx("p",{className:"font-semibold text-lg",children:data.customerName}),jsxRuntimeExports.jsx("p",{className:"text-sm text-gray-600",children:data.customerAddress}),data.contactPerson&&jsxRuntimeExports.jsxs("p",{className:"text-sm text-gray-600 mt-1",children:["PIC: ",data.contactPerson]}),data.customerPhone&&jsxRuntimeExports.jsxs("p",{className:"text-sm text-gray-600",children:["Tel: ",data.customerPhone]}),data.customerEmail&&jsxRuntimeExports.jsxs("p",{className:"text-sm text-gray-600",children:["Email: ",data.customerEmail]})]}),jsxRuntimeExports.jsxs("div",{className:"text-right",children:[jsxRuntimeExports.jsx("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"REFERENSI"}),jsxRuntimeExports.jsxs("p",{className:"text-sm",children:["No. Order: ",jsxRuntimeExports.jsx("span",{className:"font-mono font-semibold",children:data.orderCode})]}),isNota&&data.paymentDate&&jsxRuntimeExports.jsxs("p",{className:"text-sm mt-1",children:["Tanggal Bayar: ",data.paymentDate]}),isNota&&data.paymentMethod&&jsxRuntimeExports.jsxs("p",{className:"text-sm",children:["Metode: ",data.paymentMethod]})]})]}),jsxRuntimeExports.jsx("div",{className:"border dark:border-border/50 rounded-lg overflow-hidden mb-8 shadow-sm",children:jsxRuntimeExports.jsxs("table",{className:"w-full",children:[jsxRuntimeExports.jsx("thead",{className:"bg-gray-50 dark:bg-muted/50",children:jsxRuntimeExports.jsxs("tr",{children:[jsxRuntimeExports.jsx("th",{className:"text-left p-3 text-sm font-semibold",children:"Item"}),jsxRuntimeExports.jsx("th",{className:"text-center p-3 text-sm font-semibold w-20",children:"Qty"}),jsxRuntimeExports.jsx("th",{className:"text-right p-3 text-sm font-semibold w-32",children:"Harga"}),jsxRuntimeExports.jsx("th",{className:"text-right p-3 text-sm font-semibold w-36",children:"Subtotal"})]})}),jsxRuntimeExports.jsx("tbody",{children:data.items.map((item,index)=>jsxRuntimeExports.jsxs("tr",{className:"border-t dark:border-border/50 hover:bg-muted/30 transition-colors",children:[jsxRuntimeExports.jsx("td",{className:"p-3 text-sm",children:item.name}),jsxRuntimeExports.jsx("td",{className:"p-3 text-sm text-center",children:item.quantity}),jsxRuntimeExports.jsx("td",{className:"p-3 text-sm text-right",children:formatCurrency(item.unitPrice)}),jsxRuntimeExports.jsx("td",{className:"p-3 text-sm text-right font-medium",children:formatCurrency(item.subtotal)})]},index))})]})}),jsxRuntimeExports.jsx("div",{className:"flex justify-end",children:jsxRuntimeExports.jsxs("div",{className:"w-72 space-y-2",children:[jsxRuntimeExports.jsxs("div",{className:"flex justify-between text-sm",children:[jsxRuntimeExports.jsx("span",{className:"text-muted-foreground",children:"Subtotal"}),jsxRuntimeExports.jsx("span",{children:formatCurrency(data.subtotal)})]}),jsxRuntimeExports.jsxs("div",{className:"flex justify-between text-sm",children:[jsxRuntimeExports.jsxs("span",{className:"text-muted-foreground",children:["PPN (",data.taxRate,"%)"]}),jsxRuntimeExports.jsx("span",{children:formatCurrency(data.taxAmount)})]}),jsxRuntimeExports.jsx(Separator,{}),jsxRuntimeExports.jsxs("div",{className:"flex justify-between font-bold text-lg",children:[jsxRuntimeExports.jsx("span",{children:"TOTAL"}),jsxRuntimeExports.jsx("span",{className:"text-primary",children:formatCurrency(data.total)})]}),isNota&&data.isPaid&&jsxRuntimeExports.jsxs("div",{className:"flex justify-between text-sm text-green-600 font-medium",children:[jsxRuntimeExports.jsx("span",{children:"Terbayar"}),jsxRuntimeExports.jsx("span",{children:formatCurrency(data.amountPaid||data.total)})]})]})}),jsxRuntimeExports.jsx("div",{className:"mt-12 pt-6 border-t dark:border-border/50",children:jsxRuntimeExports.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx("p",{className:"text-xs text-muted-foreground mb-2",children:"Catatan:"}),jsxRuntimeExports.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-400",children:isNota?"Terima kasih atas pembayaran Anda. Simpan nota ini sebagai bukti transaksi.":"Pembayaran dapat dilakukan melalui transfer bank. Harap sertakan nomor order saat transfer."})]}),jsxRuntimeExports.jsxs("div",{className:"text-right",children:[jsxRuntimeExports.jsx("p",{className:"text-xs text-muted-foreground mb-8",children:"Hormat kami,"}),jsxRuntimeExports.jsx("p",{className:"text-sm font-semibold",children:"SIM4LON"}),jsxRuntimeExports.jsx("p",{className:"text-xs text-muted-foreground",children:"Sistem Manajemen LPG"})]})]})})]})]})]}),jsxRuntimeExports.jsx("style",{children:`
        @media print {
          /* CRITICAL: Force light theme for print regardless of dark mode */
          html, body, .dark, :root { 
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
            color-scheme: light !important;
          }
          
          /* Override dark mode variables for print */
          :root, .dark {
            --background: 0 0% 100% !important;
            --foreground: 222.2 84% 4.9% !important;
            --card: 0 0% 100% !important;
            --card-foreground: 222.2 84% 4.9% !important;
            --muted: 210 40% 96.1% !important;
            --muted-foreground: 215.4 16.3% 46.9% !important;
            --border: 214.3 31.8% 91.4% !important;
          }
          
          /* Force white background on all elements */
          *, *::before, *::after {
            background-color: transparent !important;
          }
          
          /* Card must be white */
          .bg-white, 
          [class*="bg-card"],
          [class*="dark:bg-card"],
          .dark .bg-white,
          .dark [class*="bg-card"] {
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
          }
          
          /* Page background */
          .min-h-screen,
          [class*="from-slate"],
          [class*="dark:from-slate"] {
            background: white !important;
          }
          
          /* Text colors for print */
          h1, h2, h3, h4, h5, h6, p, span, td, th, label {
            color: #1f2937 !important;
          }
          
          .text-muted-foreground,
          [class*="text-gray"] {
            color: #6b7280 !important;
          }
          
          .text-primary {
            color: #16a34a !important;
          }
          
          /* Table styling for print */
          table { border-collapse: collapse !important; }
          thead { background: #f9fafb !important; }
          th, td { 
            border-color: #e5e7eb !important;
            background: transparent !important;
          }
          
          /* Hide action bar and non-print elements */
          header, footer, nav, aside,
          .print\\:hidden,
          [data-radix-portal],
          [role="navigation"],
          .toaster { 
            display: none !important; 
          }
          
          /* Document container */
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-0 { border: none !important; }
          
          /* Ensure content fits on one page */
          .max-w-4xl { 
            max-width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* No page breaks inside elements */
          table, tr, td, th, thead, tbody { 
            page-break-inside: avoid !important; 
          }
          
          /* Watermark visibility on print */
          [class*="text-green-500/10"],
          [class*="text-green-400/10"] {
            color: rgba(34, 197, 94, 0.15) !important;
          }
          
          /* Badge styling */
          .bg-green-500 {
            background-color: #22c55e !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        @page { 
          size: A4 portrait; 
          margin: 0.8cm;
        }
      `})]})}export{NotaPembayaranPage as default};
