# 📊 CORE UML DIAGRAMS SELECTION - PRESENTASI SEMINAR
## 10 Activity Diagrams + 10 Sequence Diagrams

> **Kriteria Seleksi:** Business Critical + Role Coverage + Technical Showcase + Presentation Value

---

## 🔥 **10 ACTIVITY DIAGRAMS CORE**

### **✅ ANDA SUDAH PUNYA (5):**

#### **1. AD-01: Login** ⭐⭐⭐
**Status:** ✅ DONE

**Kenapa core:**
- ✅ Foundation, semua user harus login
- ✅ Security showcase (JWT + session_id)
- ✅ Single session login mechanism
- ✅ Simple tapi essential

**Complexity:** Low-Medium
**Highlight:** Single session security

---

#### **2. AD-02: Buat Pesanan (Manual)** ⭐⭐⭐⭐
**Status:** ✅ DONE

**Kenapa core:**
- ✅ Core CRUD business process
- ✅ Entry point utama order creation
- ✅ Validasi lengkap (stok, quantity, pangkalan)
- ✅ Generate kode ORD-XXXX

**Complexity:** Medium
**Highlight:** Auto-generate order code + PPN calculation

---

#### **3. AD-03: Update Status Pesanan** ⭐⭐⭐⭐⭐
**Status:** ✅ DONE

**Kenapa core:**
- ✅ **FITUR PALING CRITICAL!** 🔥
- ✅ **AUTO-SYNC STOK** saat status SELESAI
- ✅ State machine integration (7 states)
- ✅ Business automation yang hemat 40% waktu

**Complexity:** High
**Highlight:** Automatic stock synchronization tanpa input manual!

---

#### **4. AD Voice Order: Speech to Order** ⭐⭐⭐⭐
**Status:** ✅ DONE

**Kenapa core:**
- ✅ **Fitur unggulan AI innovation**
- ✅ Google Gemini 2.0 Flash integration
- ✅ Speech-to-text → NLP parsing → Order
- ✅ Diferensiator dari sistem lain

**Complexity:** High
**Highlight:** AI-powered order creation (5 menit → 30 detik)

---

#### **5. AD-07: Catat Penjualan (Pangkalan)** ⭐⭐⭐⭐
**Status:** ✅ DONE

**Kenapa core:**
- ✅ **Multi-tenant showcase**
- ✅ Pangkalan role (different dari Admin/Operator)
- ✅ Auto-update pangkalan_stocks
- ✅ Business critical untuk end-user

**Complexity:** Medium-High
**Highlight:** Multi-tenant architecture + JWT filter

---

### **📋 TAMBAHAN 5 ACTIVITY DIAGRAM (Rekomendasi):**

#### **6. AD-04: Catat Pembayaran** ⭐⭐
**Kenapa core:**
- ✅ Business critical (payment flow)
- ✅ Auto-update status MENUNGGU → DIPROSES saat lunas
- ✅ Support partial payment (DP)
- ✅ Integration dengan order lifecycle

**Complexity:** Medium
**Highlight:** Auto-change order status berdasarkan payment

---

#### **7. AD-07: Catat Penjualan (Pangkalan)** ⭐⭐⭐
**Kenapa core:**
- ✅ **Multi-tenant showcase** - Pangkalan role
- ✅ Auto-update pangkalan_stocks (stok management)
- ✅ Different actor dari Admin/Operator
- ✅ Business critical untuk end-user (Pangkalan)

**Complexity:** Medium-High
**Highlight:** Multi-tenant + auto-stock update

---

#### **8. AD-08: Lihat Dashboard DSS** ⭐⭐
**Kenapa core:**
- ✅ **Decision Support System showcase**
- ✅ Alert 3 warna (🟢🟡🔴)
- ✅ Real-time stock monitoring
- ✅ Business intelligence feature

**Complexity:** Low-Medium
**Highlight:** DSS dengan color-coded alerts

---

#### **9. AD-09: Order dari Pangkalan ke Agen** ⭐⭐
**Kenapa core:**
- ✅ Reverse flow (pangkalan → agen)
- ✅ State machine kedua (SM-02: Agen Order)
- ✅ Stock replenishment process
- ✅ Complete business cycle

**Complexity:** Medium
**Highlight:** B2B ordering flow

---

#### **10. AD-12: Kelola Data Pangkalan (CRUD)** ⭐
**Kenapa core:**
- ✅ Master data management
- ✅ CRUD showcase (Create, Read, Update, Delete)
- ✅ Admin role functionality
- ✅ Soft delete implementation

**Complexity:** Low-Medium
**Highlight:** Complete CRUD dengan soft delete

---

## 📋 **SUMMARY 10 ACTIVITY DIAGRAMS:**

| No | Activity Diagram | Role | Feature | Priority | Time | Status |
|----|------------------|------|---------|----------|------|--------|
| 1 | **Login** | All | Security | ⭐⭐⭐ | 1.5m | ✅ DONE |
| 2 | **Buat Pesanan** | Admin/Op | Core CRUD | ⭐⭐⭐⭐ | 2m | ✅ DONE |
| 3 | **Update Status** | Admin/Op | **Auto-Sync** | ⭐⭐⭐⭐⭐ | 2.5m | ✅ DONE |
| 4 | **Voice Order** | Admin | AI Innovation | ⭐⭐⭐⭐ | 2m | ✅ DONE |
| 5 | **Catat Penjualan** | **Pangkalan** | **Multi-tenant** | ⭐⭐⭐⭐ | 2m | ✅ DONE |
| 6 | Catat Pembayaran | Admin/Op | Payment Flow | ⭐⭐⭐ | 1.5m | 📋 TODO |
| 7 | Dashboard DSS | All | Decision Support | ⭐⭐⭐ | 1.5m | 📋 TODO |
| 8 | Order ke Agen | Pangkalan | B2B Flow | ⭐⭐⭐ | 1.5m | 📋 TODO |
| 9 | Kelola Pangkalan | Admin | CRUD Master | ⭐⭐ | 1m | 📋 TODO |
| 10 | Kelola LPG Product | Admin | CRUD Master | ⭐⭐ | 1m | 📋 TODO |

**Total Time:** ~17 menit
**Coverage:** ✅ 3 Roles ✅ CRUD ✅ AI ✅ DSS ✅ Multi-tenant ✅ Auto-sync

**Completed:** 5/10 (50%) ✅
**Remaining:** 5 diagram (prioritas sedang, bisa disesuaikan)

---

## 🔷 **10 SEQUENCE DIAGRAMS CORE**

### **KRITERIA SELEKSI:**
- Pair dengan Activity Diagram yang sudah dipilih
- Coverage object interaction yang kompleks
- Showcase technical implementation

---

### **10 SEQUENCE DIAGRAM:**

#### **1. SD-01: Login** ⭐⭐⭐
**Actors:** User → LoginForm → AuthService → users DB → activity_logs DB

**Kenapa core:**
- ✅ Foundation flow
- ✅ JWT generation
- ✅ Session management
- ✅ Activity logging

**Complexity:** Medium
**Highlight:** Single session mechanism

---

#### **2. SD-03: Create Order** ⭐⭐⭐⭐
**Actors:** Admin → OrderPage → OrderService → pangkalans/orders/order_items/timeline_tracks DB

**Kenapa core:**
- ✅ Core business transaction
- ✅ Multi-table interaction (4 tables)
- ✅ Code generation (ORD-XXXX)
- ✅ Tax calculation logic

**Complexity:** High
**Highlight:** Transaction integrity (4 tables)

---

#### **3. SD-04: Update Status** ⭐⭐⭐⭐⭐
**Actors:** Admin → OrderDetailPage → OrderService → orders/timeline_tracks/pangkalan_stocks DB

**Kenapa core:**
- ✅ **AUTO-SYNC IMPLEMENTATION!** 🔥
- ✅ Optional fragment (opt)
- ✅ Loop untuk update multiple stok
- ✅ State machine integration

**Complexity:** Very High
**Highlight:** Async auto-sync dengan opt fragment

---

#### **4. SD Voice Order: Speech to Order** ⭐⭐⭐⭐
**Actors:** Admin → VoiceBtn → Web Speech API → Gemini API → OrderService → DB

**Kenapa core:**
- ✅ AI integration showcase
- ✅ External API call
- ✅ NLP parsing
- ✅ Innovation highlight

**Complexity:** High
**Highlight:** AI-powered order creation

---

#### **5. SD-07: Record Payment** ⭐⭐⭐
**Actors:** Admin → PaymentPage → PaymentService → order_payment_details/payment_records/orders DB

**Kenapa core:**
- ✅ Payment transaction
- ✅ UPSERT operation
- ✅ Conditional status update
- ✅ Financial critical

**Complexity:** Medium-High
**Highlight:** Auto-update status saat lunas

---

#### **6. SD-12: Record Sale (Pangkalan)** ⭐⭐⭐⭐
**Actors:** Pangkalan → PenjualanPage → ConsumerOrderService → consumers/pangkalan_stocks/consumer_orders DB

**Kenapa core:**
- ✅ **Multi-tenant flow**
- ✅ Stock availability check
- ✅ Alt fragment (if stock cukup)
- ✅ Pangkalan role

**Complexity:** Medium-High
**Highlight:** JWT filter untuk multi-tenant

---

#### **7. SD Dashboard: Load DSS** ⭐⭐⭐
**Actors:** User → DashboardPage → StockService → pangkalan_stocks DB

**Kenapa core:**
- ✅ Decision Support System
- ✅ Aggregation query
- ✅ Color logic (🟢🟡🔴)
- ✅ Real-time monitoring

**Complexity:** Medium
**Highlight:** Business intelligence query

---

#### **8. SD-13: Order ke Agen** ⭐⭐⭐
**Actors:** Pangkalan → OrderAgenPage → AgenOrderService → agen_orders DB

**Kenapa core:**
- ✅ B2B transaction
- ✅ Reverse ordering flow
- ✅ State machine SM-02
- ✅ Stock replenishment

**Complexity:** Medium
**Highlight:** Pangkalan-initiated order

---

#### **9. SD-14: Terima Order dari Agen** ⭐⭐⭐
**Actors:** Pangkalan → AgenOrderDetailPage → AgenOrderService → agen_orders/pangkalan_stocks DB

**Kenapa core:**
- ✅ Status update DITERIMA
- ✅ Auto-update pangkalan stock
- ✅ Create stock movement
- ✅ Complete B2B cycle

**Complexity:** Medium-High
**Highlight:** Auto-sync stok dari agen order

---

#### **10. SD-05: CRUD Pangkalan** ⭐⭐
**Actors:** Admin → PangkalanPage → PangkalanService → pangkalans DB

**Kenapa core:**
- ✅ Master data CRUD
- ✅ Soft delete implementation
- ✅ Basic interaction pattern
- ✅ Admin functionality

**Complexity:** Low-Medium
**Highlight:** Soft delete (deleted_at)

---

## 📋 **SUMMARY 10 SEQUENCE DIAGRAMS:**

| No | Sequence Diagram | Related AD | Tables Involved | Priority | Time |
|----|------------------|------------|-----------------|----------|------|
| 1 | Login | AD-01 | users, activity_logs | ⭐⭐⭐ | 1.5m |
| 2 | Create Order | AD-02 | orders, order_items, timeline | ⭐⭐⭐⭐ | 2m |
| 3 | **Update Status** | **AD-03** | **orders, stocks, timeline** | ⭐⭐⭐⭐⭐ | 2.5m |
| 4 | Voice Order | AD-Voice | orders, Gemini API | ⭐⭐⭐⭐ | 2m |
| 5 | Record Payment | AD-04 | payment_details, records | ⭐⭐⭐ | 1.5m |
| 6 | **Record Sale** | **AD-07** | **consumer_orders, stocks** | ⭐⭐⭐⭐ | 2m |
| 7 | Load Dashboard | AD-08 | pangkalan_stocks | ⭐⭐⭐ | 1.5m |
| 8 | Order ke Agen | AD-09 | agen_orders | ⭐⭐⭐ | 1.5m |
| 9 | Terima Order | AD-09 | agen_orders, stocks | ⭐⭐⭐ | 1.5m |
| 10 | CRUD Pangkalan | AD-12 | pangkalans | ⭐⭐ | 1m |

**Total Time:** ~17.5 menit
**Coverage:** ✅ Multi-table ✅ Transaction ✅ AI ✅ Multi-tenant ✅ CRUD

---

## 🎯 **COMPLETE UML DIAGRAM SET:**

### **Total untuk Presentasi (25 diagram):**

```
✅ BPMN: 1
✅ Use Case: 1 (17 UC)
✅ Activity: 10 ⭐
✅ Sequence: 10 ⭐
✅ Class: 1
✅ ERD: 1
✅ State Machine: 2 (Order Status + Agen Order)
✅ Deployment: 1
─────────────────
TOTAL: 27 diagram
```

---

## ⏱️ **TIMING BREAKDOWN:**

```
BPMN: 1 min
Use Case: 2 min
Activity (10): 17 min
Sequence (10): 17.5 min
Class: 2 min
ERD: 2 min
State Machine (2): 4 min (2 min each)
Deployment: 2 min
───────────────────
TOTAL UML: ~48 menit
```

**Untuk 60 menit total:**
- Presentasi UML: 48 min
- Demo: 12 min
- **TOTAL: 60 min** ✅

---

## 🎓 **PROFESSIONAL JUSTIFICATION:**

### **Kenapa 10+10 (bukan lebih sedikit)?**

1. **Comprehensive Coverage:**
   - ✅ Semua 3 roles ter-cover
   - ✅ CRUD operations complete
   - ✅ Core business flows documented
   - ✅ Innovation features highlighted

2. **Academic Standard:**
   - Sistem dengan 17 UC → 10 AD adalah proportional
   - Sequence harus pair dengan Activity → 10 SD logical
   - Menunjukkan thoroughness

3. **Presentation Balance:**
   - Pairing AD + SD = clear process + implementation
   - Mix simple (Login, CRUD) + complex (Auto-sync, AI)
   - Progressive complexity untuk audience engagement

4. **Technical Showcase:**
   - State machine integration
   - Transaction management
   - Multi-tenant architecture
   - AI integration
   - DSS implementation

---

## 📝 **CATATAN PENTING:**

### **Jika Penguji Tanya: "Kenapa 10 Activity + 10 Sequence?"**

**Jawaban Profesional:**
> "Terima kasih pertanyaannya, Pak. Saya memilih 10 Activity dan 10 Sequence Diagram berdasarkan 3 kriteria:
> 
> **1. Business Criticality:** Semua core business processes ter-cover - dari login, order creation, payment, sampai stock management.
> 
> **2. Role Coverage:** Diagram mencakup ketiga aktor (Admin, Operator, Pangkalan) untuk menunjukkan complete system usage.
> 
> **3. Technical Diversity:** Mix dari simple CRUD, complex transaction (multi-table), AI integration, dan automation features.
> 
> Pairing Activity dengan Sequence Diagram membantu menjelaskan 'what' (process flow) dan 'how' (technical implementation) secara lengkap. Total 20 diagram behavioral ini, ditambah 1 Class, 1 ERD, 2 State Machine, dan 1 Deployment, memberikan comprehensive documentation untuk sistem dengan 17 use cases dan 23 database entities."

---

## ✅ **FINAL CHECKLIST:**

```
□ 10 Activity Diagram selected (coverage complete)
□ 10 Sequence Diagram paired (implementation clear)
□ Priority ranking done (⭐ to ⭐⭐⭐⭐⭐)
□ Timing calculated (~48 min for UML)
□ Role coverage verified (Admin, Op, Pangkalan)
□ Feature coverage complete (CRUD, AI, DSS, Multi-tenant)
□ Justification prepared for Q&A
□ Ready to create PPT slides!
```

---

**Status:** ✅ READY FOR PRESENTATION PLANNING
**Next Step:** Create individual slide content untuk 27 diagram ini
