# 📚 PANDUAN LENGKAP UML DIAGRAM
## Referensi Komprehensif untuk Presentasi

---

# DAFTAR ISI

1. [Use Case Diagram](#1-use-case-diagram)
2. [Class Diagram](#2-class-diagram)
3. [ERD (Entity Relationship Diagram)](#3-erd-entity-relationship-diagram)
4. [Activity Diagram](#4-activity-diagram)
5. [Sequence Diagram](#5-sequence-diagram)
6. [State Machine Diagram](#6-state-machine-diagram)
7. [Deployment Diagram](#7-deployment-diagram)
8. [Tabel Perbandingan](#8-tabel-perbandingan)

---

# 1. USE CASE DIAGRAM

## 1.1 Pengertian

**Use Case Diagram** adalah diagram yang menggambarkan **fungsionalitas sistem** dari sudut pandang pengguna (aktor). Diagram ini menjawab pertanyaan: "**SIAPA** bisa melakukan **APA** di sistem ini?"

## 1.2 Kegunaan / Fungsi

1. Mendokumentasikan **kebutuhan fungsional** sistem
2. Menunjukkan **siapa pengguna** sistem
3. Mengidentifikasi **fitur utama** yang harus dibangun
4. Komunikasi dengan stakeholder non-teknis
5. Dasar untuk **test case** dan **acceptance criteria**

## 1.3 Komponen

### Actor (Aktor)
- **Definisi**: Entitas eksternal yang berinteraksi dengan sistem
- **Simbol**: Stick figure (orang) atau kotak dengan <<actor>>
- **Jenis**:
  - **Primary Actor**: Pengguna utama (Admin, User)
  - **Secondary Actor**: Sistem eksternal (Payment Gateway, Email Server)
- **Contoh SIM4LON**: Admin, Operator, Pangkalan

### Use Case
- **Definisi**: Fungsi atau fitur yang bisa dilakukan aktor
- **Simbol**: Oval/ellipse
- **Penamaan**: Kata kerja + objek (Kelola Pesanan, Catat Pembayaran)
- **Contoh SIM4LON**: Login, Kelola Stok, Buat Pesanan

### System Boundary
- **Definisi**: Kotak yang menunjukkan batasan sistem
- **Simbol**: Rectangle dengan nama sistem
- **Fungsi**: Membedakan apa yang di dalam vs luar sistem

## 1.4 Relationship (Relasi)

### Association (Asosiasi)
- **Simbol**: Garis lurus ───
- **Arti**: Aktor terhubung dengan use case
- **Contoh**: Admin ─── Kelola Pengguna

### Include (<<include>>)
- **Simbol**: Garis putus-putus dengan panah ──>> <<include>>
- **Arti**: Use case A **SELALU** memanggil use case B
- **Kapan dipakai**: Ketika ada fungsionalitas yang **wajib** dijalankan
- **Arah panah**: Dari use case utama → ke use case yang di-include
- **Contoh SIM4LON**: 
  - "Kelola Stok" --include--> "Catat Penerimaan"
  - "Kelola Pesanan" --include--> "Buat Pesanan"

### Extend (<<extend>>)
- **Simbol**: Garis putus-putus dengan panah <<extend>> <<──
- **Arti**: Use case B **OPSIONAL** memperluas use case A
- **Kapan dipakai**: Ketika ada fungsionalitas **tambahan yang optional**
- **Arah panah**: Dari use case extension → ke use case utama
- **Extension Point**: Titik dimana extension bisa dipanggil
- **Contoh SIM4LON**:
  - "Assign Driver" --extend--> "Update Status" (hanya saat status SIAP_KIRIM)
  - "Cetak Nota" --extend--> "Kelola Pembayaran" (opsional)

### Generalization (Generalisasi)
- **Simbol**: Garis dengan segitiga kosong ──▷
- **Arti**: Aktor anak mewarisi semua use case aktor parent
- **Contoh**: Operator ──▷ Admin (Operator bisa semua yang Admin bisa)

## 1.5 Beda Include vs Extend

| Aspek | Include | Extend |
|-------|---------|--------|
| Sifat | WAJIB dipanggil | OPSIONAL dipanggil |
| Arah panah | Base → Included | Extension → Base |
| Kondisi | Selalu terjadi | Ada syarat/trigger |
| Contoh | Checkout → Validasi Stok | Checkout ← Pakai Voucher |

---

# 2. CLASS DIAGRAM

## 2.1 Pengertian

**Class Diagram** adalah diagram yang menggambarkan **struktur statis** sistem berupa class, atribut, method, dan relasi antar class. Ini adalah blueprint untuk implementasi **Object-Oriented Programming (OOP)**.

## 2.2 Kegunaan / Fungsi

1. Blueprint untuk **implementasi kode**
2. Dokumentasi **struktur objek**
3. Menunjukkan **inheritance** dan **encapsulation**
4. Dasar untuk **database design**
5. Komunikasi antar developer

## 2.3 Komponen

### Class
- **Definisi**: Template untuk membuat objek
- **Simbol**: Kotak dengan 3 bagian
- **Bagian**:
  1. **Nama Class** (atas)
  2. **Atribut** (tengah)
  3. **Method** (bawah)

### Atribut
- **Definisi**: Property/data yang dimiliki class
- **Format**: `visibility name : type = defaultValue`
- **Contoh**: `+code : string`, `-password : string`

### Method / Operation
- **Definisi**: Fungsi yang bisa dilakukan class
- **Format**: `visibility name(parameters) : returnType`
- **Contoh**: `+create(dto: CreateDto) : Order`

## 2.4 Visibility (Akses Modifier)

| Simbol | Nama | Arti | Bisa Diakses Oleh |
|--------|------|------|-------------------|
| `+` | Public | Terbuka | Semua class |
| `-` | Private | Tertutup | Hanya class itu sendiri |
| `#` | Protected | Dilindungi | Class itu + turunannya |
| `~` | Package | Paket | Class dalam package sama |

## 2.5 Relationship (Relasi)

### Association (Asosiasi)
- **Simbol**: Garis lurus ───
- **Arti**: Dua class saling berhubungan
- **Navigability**: Panah menunjukkan arah akses
- **Contoh**: Order ─── Pangkalan

### Aggregation (Agregasi)
- **Simbol**: Garis dengan diamond kosong ◇───
- **Arti**: Relasi **HAS-A** dengan kepemilikan LEMAH
- **Child bisa exist tanpa parent**
- **Contoh SIM4LON**: 
  - Agen ◇─── Pangkalans (Pangkalan bisa exist tanpa agen)
  - Pangkalan ◇─── Users (User bisa exist tanpa pangkalan)

### Composition (Komposisi)
- **Simbol**: Garis dengan diamond penuh ◆───
- **Arti**: Relasi **HAS-A** dengan kepemilikan KUAT
- **Child HAPUS jika parent hapus**
- **Contoh SIM4LON**:
  - Orders ◆─── OrderItems (Item hapus jika order dihapus)
  - Orders ◆─── TimelineTracks (Timeline hapus jika order dihapus)

### Inheritance / Generalization (Pewarisan)
- **Simbol**: Garis dengan segitiga kosong ───▷
- **Arti**: Relasi **IS-A**, class anak mewarisi parent
- **Contoh**: Admin ──▷ User

### Dependency (Ketergantungan)
- **Simbol**: Garis putus-putus dengan panah - - ->
- **Arti**: Class A **bergantung** pada class B
- **Contoh**: OrderService ---> PrismaService

### Realization (Realisasi)
- **Simbol**: Garis putus-putus dengan segitiga - - -▷
- **Arti**: Class **mengimplementasikan** interface
- **Contoh**: OrderService ---▷ IOrderService

## 2.6 Multiplicity (Kardinalitas)

| Notasi | Arti | Contoh |
|--------|------|--------|
| `1` | Tepat satu | User punya 1 Profile |
| `0..1` | Nol atau satu | Order mungkin punya 0 atau 1 Driver |
| `*` atau `0..*` | Nol atau banyak | User punya 0 atau banyak Orders |
| `1..*` | Satu atau banyak | Order harus punya minimal 1 Item |
| `n..m` | Range | Kelas punya 10..30 Mahasiswa |

## 2.7 Beda Aggregation vs Composition

| Aspek | Aggregation (◇) | Composition (◆) |
|-------|-----------------|-----------------|
| Kepemilikan | Lemah | Kuat |
| Lifecycle | Independen | Dependen |
| Delete parent | Child tetap ada | Child ikut terhapus |
| Contoh | Kelas ◇─ Mahasiswa | Rumah ◆─ Kamar |

---

# 3. ERD (Entity Relationship Diagram)

## 3.1 Pengertian

**ERD (Entity Relationship Diagram)** adalah diagram yang menggambarkan **struktur database**: entitas (tabel), atribut (kolom), dan relasi antar tabel.

## 3.2 Kegunaan / Fungsi

1. **Desain database** sebelum implementasi
2. Dokumentasi **skema database**
3. Menunjukkan **primary key** dan **foreign key**
4. Normalisasi data
5. Komunikasi dengan DBA

## 3.3 Komponen

### Entity (Entitas)
- **Definisi**: Tabel dalam database
- **Simbol**: Rectangle/kotak
- **Penamaan**: Noun (kata benda), singular atau plural
- **Contoh SIM4LON**: users, orders, pangkalans

### Attribute (Atribut)
- **Definisi**: Kolom dalam tabel
- **Jenis**:
  - **Simple**: Satu nilai (name, email)
  - **Composite**: Gabungan (address = street + city)
  - **Derived**: Dihitung (age dari birthdate)
  - **Multi-valued**: Banyak nilai (phone_numbers)

### Primary Key (PK)
- **Definisi**: Identifier unik setiap record
- **Simbol**: 🔑 atau underline atau <<PK>>
- **Contoh SIM4LON**: id (UUID)

### Foreign Key (FK)
- **Definisi**: Referensi ke PK tabel lain
- **Simbol**: 🗝️ atau <<FK>>
- **Contoh SIM4LON**: pangkalan_id, order_id

## 3.4 Crow's Foot Notation (Notasi Kaki Gagak)

### Simbol

| Simbol | Nama | Arti |
|--------|------|------|
| `\|` atau `──\|` | One | Tepat satu |
| `\|\|` | One (mandatory) | Tepat satu, wajib |
| `O` atau `──O` | Zero | Nol (opsional) |
| `<` atau `>` atau `{` atau `}` | Many | Banyak |

### Kombinasi

| Simbol | Nama | Arti |
|--------|------|------|
| `\|\|` | One and only one | Tepat 1, wajib ada |
| `O\|` | Zero or one | 0 atau 1 (opsional) |
| `\|{` atau `>\|` | One or many | Minimal 1, bisa banyak |
| `O{` atau `>O` | Zero or many | 0 atau banyak |

## 3.5 Cardinality (Kardinalitas)

### One-to-One (1:1)
- **Simbol**: `\|\|───\|\|`
- **Arti**: 1 record di tabel A berhubungan dengan tepat 1 record di tabel B
- **Contoh SIM4LON**: orders ||──|| order_payment_details

### One-to-Many (1:N)
- **Simbol**: `\|\|───O{` atau `\|\|───\|{`
- **Arti**: 1 record di tabel A berhubungan dengan banyak record di tabel B
- **Contoh SIM4LON**: 
  - pangkalans ||──o{ orders (1 pangkalan punya banyak order)
  - orders ||──|{ order_items (1 order punya minimal 1 item)

### Many-to-Many (M:N)
- **Simbol**: `}O───O{`
- **Arti**: Banyak record di A berhubungan dengan banyak record di B
- **Implementasi**: Butuh **junction table** (tabel perantara)
- **Contoh**: Students }o──o{ Courses → butuh Enrollments table

## 3.6 Beda ERD vs Class Diagram

| Aspek | ERD | Class Diagram |
|-------|-----|---------------|
| **Fokus** | Database/tabel | Objek/OOP |
| **Atribut** | Kolom + tipe SQL | Property + tipe programming |
| **Method** | ❌ Tidak ada | ✅ Ada |
| **Relasi** | FK, PK, kardinalitas | Association, inheritance |
| **Notasi** | Crow's foot | UML standard |
| **Tool** | MySQL Workbench, pgAdmin | Visual Paradigm, StarUML |

---

# 4. ACTIVITY DIAGRAM

## 4.1 Pengertian

**Activity Diagram** adalah diagram yang menggambarkan **alur aktivitas/proses** dari awal sampai akhir, mirip **flowchart** tapi lebih powerful.

## 4.2 Kegunaan / Fungsi

1. Menggambarkan **workflow bisnis proses**
2. Dokumentasi **SOP (Standard Operating Procedure)**
3. Menunjukkan **decision/percabangan**
4. Menggambarkan **proses paralel**
5. Dasar untuk implementasi business logic

## 4.3 Komponen

### Initial Node (Node Awal)
- **Simbol**: ● (bulat hitam penuh)
- **Arti**: Titik mulai aktivitas
- **Aturan**: Hanya boleh 1 initial node

### Final Node (Node Akhir)
- **Simbol**: ◉ (bulat dalam bulat) atau ⊗
- **Jenis**:
  - **Activity Final**: Mengakhiri seluruh aktivitas
  - **Flow Final**: Mengakhiri satu flow saja

### Action (Aksi)
- **Simbol**: Rounded rectangle (kotak sudut bulat)
- **Arti**: Langkah/aktivitas yang dilakukan
- **Penamaan**: Kata kerja (Input Data, Validasi, Simpan)

### Decision Node (Keputusan)
- **Simbol**: ◇ (diamond/belah ketupat)
- **Arti**: Percabangan if-else
- **Guard**: Kondisi dalam kurung siku [kondisi]
- **Contoh**: ◇ [Valid?] → [Yes] / [No]

### Merge Node
- **Simbol**: ◇ (diamond sama seperti decision)
- **Arti**: Menggabungkan beberapa flow jadi satu
- **Beda dengan Decision**: Merge tidak punya guard

### Fork Node
- **Simbol**: ▬ (bar horizontal tebal)
- **Arti**: Memecah 1 flow jadi beberapa flow **PARALEL**
- **Semua path dijalankan bersamaan**

### Join Node
- **Simbol**: ▬ (bar horizontal tebal, sama seperti fork)
- **Arti**: Menggabungkan flow paralel
- **Tunggu semua selesai** baru lanjut

### Swimlane / Partition
- **Simbol**: Kolom vertikal dengan nama
- **Arti**: Membagi aktivitas per **aktor/departemen**
- **Contoh SIM4LON**: User | Sistem

## 4.4 Control Flow

| Elemen | Simbol | Arti |
|--------|--------|------|
| Flow | → | Urutan eksekusi |
| Guard | [kondisi] | Syarat untuk path tertentu |
| Fork | ▬ (split) | Mulai parallel |
| Join | ▬ (merge) | Selesai parallel |

## 4.5 Beda Decision vs Fork

| Aspek | Decision (◇) | Fork (▬) |
|-------|--------------|----------|
| Jumlah path dijalankan | SATU (pilih salah satu) | SEMUA (paralel) |
| Ada guard? | Ya [kondisi] | Tidak |
| Contoh | [Valid?] Yes/No | Kirim Email + Update DB |

---

# 5. SEQUENCE DIAGRAM

## 5.1 Pengertian

**Sequence Diagram** adalah diagram yang menggambarkan **interaksi antar objek** dalam urutan waktu (chronological). Waktu berjalan dari **atas ke bawah**.

## 5.2 Kegunaan / Fungsi

1. Menggambarkan **request-response flow**
2. Detail teknis **komunikasi komponen**
3. Dokumentasi **API flow**
4. Debugging dan troubleshooting
5. Dasar untuk implementasi service

## 5.3 Komponen

### Participant (Partisipan)
- **Definisi**: Objek yang berinteraksi
- **Simbol**: Kotak dengan nama
- **Stereotype**: <<actor>>, <<boundary>>, <<control>>, <<entity>>, <<database>>

### Lifeline
- **Definisi**: Garis vertikal putus-putus dari participant
- **Arti**: Waktu hidup objek
- **Simbol**: ┃ atau - - - (vertikal)

### Activation Bar (Execution Specification)
- **Definisi**: Kotak tipis di atas lifeline
- **Arti**: Objek sedang **aktif/memproses**
- **Simbol**: ▮ (rectangle tipis)

### Message (Pesan)
- **Definisi**: Komunikasi antar objek
- **Format**: `sequenceNumber: methodName(params)`
- **Contoh**: `1.1: login(email, password)`

## 5.4 Stereotype Participant

| Stereotype | Simbol | Arti | Contoh |
|------------|--------|------|--------|
| `<<actor>>` | 🧑 | Pengguna manusia | User, Admin |
| `<<boundary>>` | ◻ dengan garis | UI/Interface | LoginPage, OrderForm |
| `<<control>>` | ◎ | Business logic | AuthService, OrderService |
| `<<entity>>` | ◻ dengan garis bawah | Data model | UserModel, OrderModel |
| `<<database>>` | ⬡ (silinder) | Tabel database | users, orders |

## 5.5 Message Types (Jenis Pesan)

### Synchronous Message
- **Simbol**: ──▶ (panah penuh)
- **Arti**: Request **blocking** (tunggu response)
- **Contoh**: login(email, password)

### Asynchronous Message
- **Simbol**: ──> (panah terbuka)
- **Arti**: Request **non-blocking** (tidak tunggu)
- **Contoh**: sendEmail(to, subject)

### Return Message
- **Simbol**: - - -> (garis putus-putus)
- **Arti**: Response/nilai balik
- **Contoh**: return user data

### Self-Message
- **Simbol**: ↩ (loop ke diri sendiri)
- **Arti**: Objek memanggil method sendiri
- **Contoh**: validateInput()

### Create Message
- **Simbol**: ──▶ <<create>>
- **Arti**: Membuat objek baru
- **Lifeline baru muncul**

### Destroy Message
- **Simbol**: ──▶ dengan X di akhir
- **Arti**: Menghapus/mengakhiri objek
- **Lifeline berakhir**

## 5.6 Combined Fragments

### alt (Alternative)
- **Arti**: IF-ELSE
- **Syntax**: `alt [kondisi1]` ... `else [kondisi2]`
- **Contoh**: alt [password valid] → success | else → error

### opt (Option)
- **Arti**: IF tanpa ELSE (opsional)
- **Syntax**: `opt [kondisi]`
- **Contoh**: opt [user wants receipt] → printReceipt()

### loop (Perulangan)
- **Arti**: For/while loop
- **Syntax**: `loop [kondisi]` atau `loop [min, max]`
- **Contoh**: loop [for each item] → calculateSubtotal()

### break
- **Arti**: Keluar dari loop/sequence
- **Syntax**: `break [kondisi]`

### par (Parallel)
- **Arti**: Eksekusi paralel
- **Syntax**: `par` dengan garis pemisah
- **Contoh**: par → sendEmail() || updateDatabase()

### ref (Reference)
- **Arti**: Mereferensikan sequence diagram lain
- **Syntax**: `ref` dengan nama diagram

## 5.7 Numbered Messages

| Format | Arti |
|--------|------|
| `1:` | Message pertama |
| `1.1:` | Sub-message dari 1 |
| `1.1.1:` | Sub-sub-message |
| `2:` | Message kedua (setelah 1 selesai) |

---

# 6. STATE MACHINE DIAGRAM

## 6.1 Pengertian

**State Machine Diagram** (atau Statechart) adalah diagram yang menggambarkan **siklus hidup (lifecycle)** suatu objek melalui berbagai **state** dan **transisi**.

## 6.2 Kegunaan / Fungsi

1. Menggambarkan **status/kondisi** objek
2. Mendefinisikan **transisi yang valid**
3. Dokumentasi **workflow status**
4. Validasi state transition di code
5. Basis untuk state management

## 6.3 Komponen

### Initial State (State Awal)
- **Simbol**: ● (bulat hitam)
- **Arti**: Kondisi awal objek
- **Aturan**: Hanya 1 initial state

### Final State (State Akhir)
- **Simbol**: ◉ (bulat dalam bulat)
- **Arti**: Kondisi akhir objek
- **Bisa lebih dari 1** final state

### State
- **Simbol**: Rounded rectangle
- **Isi**:
  - **Nama state** (atas)
  - **Internal activities** (bawah)

### Transition (Transisi)
- **Simbol**: → (panah)
- **Arti**: Perpindahan dari state ke state
- **Label**: trigger [guard] / action

## 6.4 State Anatomy

```
┌──────────────────────────┐
│       STATE NAME         │ ← Nama state (wajib)
├──────────────────────────┤
│ entry / action           │ ← Aksi saat MASUK state
│ do / activity            │ ← Aksi SELAMA di state
│ exit / action            │ ← Aksi saat KELUAR state
└──────────────────────────┘
```

### Entry Action
- **Syntax**: `entry / action`
- **Kapan**: Dijalankan **saat masuk** state
- **Contoh**: entry / sendNotification()

### Do Activity
- **Syntax**: `do / activity`
- **Kapan**: Dijalankan **selama** di state
- **Contoh**: do / waitForPayment()

### Exit Action
- **Syntax**: `exit / action`
- **Kapan**: Dijalankan **saat keluar** state
- **Contoh**: exit / logStateChange()

## 6.5 Transition Syntax

```
trigger [guard] / action
```

| Bagian | Arti | Contoh |
|--------|------|--------|
| **trigger** | Event yang memicu | buttonClick, timeout |
| **guard** | Kondisi [dalam kurung siku] | [amount >= total] |
| **action** | Aksi saat transisi | / updateStatus() |

### Contoh Lengkap
```
paymentReceived [amount >= total] / updateStatus("PAID")
```
Artinya: Ketika `paymentReceived` terjadi DAN `amount >= total`, maka jalankan `updateStatus("PAID")` dan pindah ke state berikutnya.

## 6.6 Jenis State

### Simple State
- State biasa tanpa sub-state

### Composite State
- State yang berisi sub-state di dalamnya
- Bisa punya initial/final sendiri

### History State
- **Simbol**: H atau H*
- **Arti**: Mengingat state terakhir sebelum keluar

## 6.7 Contoh SIM4LON

### SM-01: Order Status
```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
                                                                  ↓
                                   (Cancel) ─────────────────→ BATAL
```

### SM-02: Payment Status
```
UNPAID ──[pay partial]──→ PARTIAL ──[pay rest]──→ PAID
   │                                                ↑
   └────────────[pay full]──────────────────────────┘
```

---

# 7. DEPLOYMENT DIAGRAM

## 7.1 Pengertian

**Deployment Diagram** adalah diagram yang menggambarkan **arsitektur fisik/infrastruktur** sistem, menunjukkan bagaimana komponen software di-deploy ke hardware.

## 7.2 Kegunaan / Fungsi

1. Dokumentasi **arsitektur sistem**
2. Menunjukkan **lokasi deployment**
3. Menggambarkan **protokol komunikasi**
4. Perencanaan **infrastruktur**
5. Komunikasi dengan DevOps/SysAdmin

## 7.3 Komponen

### Node
- **Definisi**: Environment tempat software berjalan
- **Simbol**: Kotak 3D (kubus)
- **Jenis**:
  - **Device Node**: Hardware fisik
  - **Execution Environment Node**: Software environment

### Artifact
- **Definisi**: File/aplikasi yang di-deploy
- **Simbol**: Rectangle dengan <<artifact>>
- **Contoh**: war file, jar file, exe, docker image

### Component
- **Definisi**: Modul dalam artifact
- **Simbol**: Rectangle dengan <<component>>
- **Contoh**: AuthModule, OrderService

### Communication Path
- **Definisi**: Koneksi antar node
- **Simbol**: Garis dengan protokol
- **Contoh**: HTTPS, TCP, WebSocket

## 7.4 Stereotype

| Stereotype | Arti | Contoh |
|------------|------|--------|
| `<<device>>` | Hardware/perangkat | Server, Mobile, Browser |
| `<<execution environment>>` | Runtime environment | JVM, Node.js, Docker |
| `<<platform>>` | Platform hosting | Vercel, Railway, AWS |
| `<<service>>` | Managed service | PostgreSQL, Redis |
| `<<artifact>>` | Deployable file | React App, NestJS API |
| `<<component>>` | Software module | Auth Module, Order Service |

## 7.5 Communication / Protocol

| Protokol | Port | Kegunaan |
|----------|------|----------|
| HTTP | 80 | Web (tidak aman) |
| HTTPS | 443 | Web (aman/encrypted) |
| TCP | varies | Database connection |
| WebSocket | 80/443 | Real-time communication |
| gRPC | varies | Microservices |

## 7.6 Contoh SIM4LON

```
┌──────────────┐     HTTPS:443      ┌──────────────┐
│   Browser    │ ──────────────────→│   Vercel     │
│  <<device>>  │                    │ <<platform>> │
└──────────────┘                    └──────┬───────┘
                                           │ HTTPS:443
                                           ↓
                                    ┌──────────────┐
                                    │   Railway    │
                                    │ <<platform>> │
                                    └──────┬───────┘
                                           │ TCP:5432
                    ┌──────────────────────┼──────────────────────┐
                    ↓                      ↓                      ↓
             ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
             │  PostgreSQL  │       │   Supabase   │       │   NestJS     │
             │ <<service>>  │       │ <<service>>  │       │ <<artifact>> │
             └──────────────┘       └──────────────┘       └──────────────┘
```

---

# 8. TABEL PERBANDINGAN

## 8.1 Kapan Pakai Diagram Apa?

| Pertanyaan | Diagram |
|------------|---------|
| SIAPA bisa melakukan APA? | Use Case |
| Bagaimana STRUKTUR OBJEK? | Class Diagram |
| Bagaimana STRUKTUR DATABASE? | ERD |
| Bagaimana ALUR PROSES? | Activity |
| Bagaimana OBJEK BERINTERAKSI? | Sequence |
| Apa saja STATUS dan TRANSISI? | State Machine |
| DIMANA sistem di-deploy? | Deployment |

## 8.2 Perbandingan Diagram

| Aspek | Use Case | Class | ERD | Activity | Sequence | State | Deployment |
|-------|----------|-------|-----|----------|----------|-------|------------|
| **Fokus** | Fungsional | Struktur OOP | Database | Workflow | Interaksi | Status | Infrastruktur |
| **Perspektif** | User | Developer | DBA | Analyst | Developer | Analyst | DevOps |
| **Statis/Dinamis** | Statis | Statis | Statis | Dinamis | Dinamis | Dinamis | Statis |

## 8.3 Statistik SIM4LON

| Diagram | Jumlah | File |
|---------|--------|------|
| Use Case | 1 | `SIM4LON_UseCase.puml` |
| Class | 1 | `SIM4LON_ClassDiagram.puml` |
| ERD | 1 | `SIM4LON_ERD.puml` |
| Activity | 25 | `AD_01 - AD_25` |
| Sequence | 18 | `SD_01 - SD_18` |
| State Machine | 4 | `SM_01 - SM_04` |
| Deployment | 1 | `SIM4LON_Deployment.puml` |
| **TOTAL** | **51** | |

---

*Good luck presentasinya! 🍀*
