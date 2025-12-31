# Design and Implementation of a Web-Based LPG Distribution Management Information System with Multi-Tenant Architecture

**Luthfi Alfaridz ^a,1,\*^, Siti Sarah ^a,2^**

^a^ Department of Informatics Engineering, Faculty of Engineering, Suryakancana University, Cianjur 43216, Indonesia

^1^ luthfifahmi.alv@gmail.com*; ^2^ sitisarah@unsur.ac.id

\* corresponding author

---

| **ARTICLE INFO** | **ABSTRACT** |
|------------------|--------------|
| **Article history:** | **Background:** Liquefied Petroleum Gas (LPG) distribution is a critical component of Indonesia's national energy supply chain, with consumption exceeding 8.2 million tons annually. However, many LPG agents continue to rely on manual recording methods, leading to data inaccuracies, order tracking difficulties, and delayed report generation. **Objective:** This study aims to design and implement a web-based LPG distribution management information system utilizing multi-tenant architecture to address operational inefficiencies in LPG agent businesses. **Methods:** The system was developed using the Waterfall methodology with Unified Modeling Language (UML) for system design. The technology stack comprises React 18 for the frontend, NestJS 10 for the backend REST API, and PostgreSQL 15 for database management. Black-box testing was conducted to validate system functionality. **Results:** The developed system, named SIM4LON, successfully integrates order management, stock tracking, payment processing, and automated reporting within a unified platform. All 28 test cases passed with a 100% success rate, confirming that all functional requirements were met. **Conclusion:** The SIM4LON system successfully addresses the identified operational challenges faced by LPG agents. The implementation of modern web technologies combined with multi-tenant architecture provides a scalable, maintainable solution that improves operational efficiency and data accuracy in LPG distribution management. |
| Received: | |
| Revised: | |
| Accepted: | |
| **Keywords:** | |
| Information System | |
| LPG Distribution | |
| Multi-Tenant Architecture | |
| React | |
| NestJS | |

---

## 1. Introduction

Liquefied Petroleum Gas (LPG) represents one of the most strategically important energy sources widely utilized by Indonesian households and commercial establishments. According to the Ministry of Energy and Mineral Resources (2024), national LPG consumption has reached over 8.2 million tons annually, with an average growth rate of 4-5% each year [1]. This increasing consumption has driven greater complexity in managing LPG distribution from producers to end consumers.

Indonesia's LPG distribution chain involves several interconnected stakeholders. PT Pertamina, as the producer, supplies LPG to SPBE (Bulk LPG Filling Stations), then agents as authorized distributors collect supplies from SPBE for distribution to retail outlets (pangkalan), which finally sell directly to end consumers [2]. A typical agent manages between tens to hundreds of retail outlets with significant daily transaction volumes, encompassing ordering, delivery, payment, and reporting processes that require systematic management.

Based on observations and interviews conducted with multiple LPG agents in the Cianjur Regency area during October-November 2025, it was discovered that the majority of agents still employ manual recording systems using handwritten ledgers, paper receipts, and unintegrated Excel spreadsheets. This condition creates several significant operational problems: (1) stock data inaccuracy with discrepancies reaching 5-10% monthly; (2) order tracking difficulties resulting in inefficient coordination; (3) slow report generation requiring 3-5 working days; and (4) high data loss risk from paper-based records.

Several previous studies have addressed LPG distribution information systems. Harahap et al. (2023) developed a web-based LPG sales information system using PHP and MySQL [3]. Kurniawan and Saputra (2022) designed an LPG sales system using the Waterfall methodology [4]. Rahman et al. (2024) implemented distribution requirement planning methods [5]. Hidayat and Santoso (2023) created a Laravel-based distribution system [6]. However, these studies have not implemented multi-tenant architecture enabling a single system to serve multiple retail outlets with strict data isolation.

Multi-tenant architecture has emerged as a fundamental design pattern in modern SaaS applications, allowing multiple customers to share a single application instance while maintaining complete data isolation [7]. Research by Kumar et al. (2024) demonstrates that integrating modern technologies can enhance LPG distribution operational efficiency by up to 30% [8].

This research addresses the identified gap by designing and implementing a web-based LPG distribution management information system called SIM4LON with multi-tenant architecture. The system employs modern web technologies including React, NestJS, and PostgreSQL [9][10][11]. The research objectives are: (1) to design an LPG distribution management system using UML modeling; (2) to implement the system using React 18, NestJS 10, and PostgreSQL 15; and (3) to validate system functionality through black-box testing.

---

## 2. Method

### 2.1 Type and Approach of Research

This research employs a Research and Development (R&D) approach with the Waterfall software development methodology. The Waterfall model was selected because all system requirements were clearly identified through field observations and stakeholder interviews [12].

### 2.2 Object and Scope of Research

The research object is the LPG distribution business process at medium-scale agents managing 10-100 retail outlets in the Cianjur Regency, West Java, Indonesia. The scope encompasses order management, stock tracking, payment processing, and reporting.

### 2.3 Data Collection Techniques

Three data collection techniques were employed: (1) **Observation** conducted over two weeks at LPG agents during October-November 2025; (2) **Interviews** with 10 stakeholders comprising agent owners, operators, and retail outlet owners; and (3) **Literature Review** covering management information systems, LPG distribution, multi-tenant architecture, and modern web technologies.

### 2.4 Tools and Materials Used

**Table 1. Software Development Tools**

| Category | Tool | Version | Function |
|----------|------|---------|----------|
| IDE | Visual Studio Code | 1.85 | Code editor |
| Frontend | React | 18.2 | User interface library |
| Build Tool | Vite | 5.0 | Frontend bundler |
| CSS | Tailwind CSS | 3.4 | Styling framework |
| Backend | NestJS | 10.2 | REST API framework |
| ORM | Prisma | 5.7 | Database access |
| Database | PostgreSQL | 15 | Data storage |
| Hosting | Vercel + Railway | - | Cloud deployment |

### 2.5 Research Procedures

The research followed Waterfall methodology stages: Requirements Analysis (October 2025), System Design (November 2025), Implementation (November-December 2025), Testing (December 2025), and Deployment (December 2025).

![INSERT FIGURE: Waterfall Methodology Stages]

**Figure 1. Waterfall Methodology Implementation Stages**

### 2.6 Data Analysis Techniques

System validation was performed using black-box testing methodology [13]. Test cases were designed based on functional requirements, covering authentication, order management, payment processing, stock management, and reporting.

---

## 3. Results and Discussion

### 3.1 Presentation of Research Results

#### 1) Current System Analysis

The existing LPG agent business process operates through manual methods. Retail outlets place orders via WhatsApp, operators record in handwritten ledgers, drivers are assigned verbally, and payments are separately recorded in cash books.

![INSERT FIGURE: Current System BPMN]

**Figure 2. Business Process Model of Current Manual System**

The analysis identified critical issues: (1) no integration between order recording, delivery tracking, and payment systems; (2) high susceptibility to human error; (3) inability to monitor delivery status in real-time; (4) time-consuming report generation.

#### 2) Requirements Specification

**Table 2. Functional and Non-Functional Requirements**

| Functional Requirements | Non-Functional Requirements |
|------------------------|----------------------------|
| The system shall manage user accounts with role-based access control (Admin, Operator, Pangkalan) | Web-based responsive design accessible on desktop and mobile browsers |
| The system shall manage retail outlet (pangkalan) and driver master data | JWT-based authentication with single-session login enforcement |
| The system shall create, update, and track order status through lifecycle | Support to 100 retail outlets per agent |
| The system shall record payments including down payments and installments | Response time under 3 seconds for standard operations |
| The system shall track stock movements (incoming from SPBE, outgoing to retail outlets) | |
| The system shall generate reports in PDF and Excel formats | |

#### 3) System Design

**Use Case Diagram:** Figure 3 presents the complete use case diagram showing 18 identified use cases across 3 actor types. The Admin actor has full system access including user management. The Operator handles daily operations such as order creation, payment recording, and stock management. The Pangkalan actor has limited access to view their own orders and payments through multi-tenant isolation.

![INSERT FIGURE: Use Case Diagram]

**Figure 3. SIM4LON Use Case Diagram**

**Entity Relationship Diagram:** Figure 4 displays the database schema comprising 11 core tables: users, drivers, pangkalans, orders, order_items, order_payment_details, timeline_tracks, invoices, payment_records, stock_histories, and activity_logs. The design implements shared database, shared schema multi-tenant pattern with `pangkalan_id` as tenant identifier [7][14].

![INSERT FIGURE: Entity Relationship Diagram]

**Figure 4. Entity Relationship Diagram**

**Activity Diagram - Create Order:** Figure 5 illustrates the order creation workflow. The process begins when a user opens the order page and clicks "Create New Order". The system displays the order form and loads active Pangkalan list along with LPG products. The user selects Pangkalan, chooses LPG type and quantity, adds optional notes, and clicks save. The system validates input, generates order code (ORD-XXXX), calculates subtotal and tax (12% for non-subsidy), saves the order with DRAFT status, creates timeline track, and logs the activity.

![INSERT FIGURE: Activity Diagram - Buat Pesanan]

**Figure 5. Activity Diagram - Create Order Process**

**Sequence Diagram - Update Status:** Figure 6 shows the interaction sequence when an admin updates order status. The diagram demonstrates the communication flow between Admin, OrderDetailPage, OrderService, and database tables (orders, order_items, timeline_tracks, pangkalan_stocks). Key processes include status transition validation, driver assignment for SIAP_KIRIM status, and automatic stock synchronization to pangkalan when order status becomes SELESAI.

![INSERT FIGURE: Sequence Diagram - Update Status]

**Figure 6. Sequence Diagram - Update Order Status Process**

**State Machine Diagram - Order Status:** Figure 5 illustrates the order status lifecycle using a state machine diagram. Orders begin in DRAFT state upon creation, then transition through MENUNGGU_PEMBAYARAN (Awaiting Payment), DIPROSES (Processing), SIAP_KIRIM (Ready to Ship), DIKIRIM (Shipped), and finally SELESAI (Completed). The BATAL (Cancelled) state serves as a terminal state accessible from any state except SELESAI. Notably, when an order reaches SELESAI status, the system automatically synchronizes stock to the pangkalan's inventory.\r\n\r\n![INSERT FIGURE: State Machine Diagram - Order Status]\r\n\r\n**Figure 5. State Machine Diagram - Order Status Lifecycle**

#### 4) System Implementation

The system architecture follows a three-tier pattern: (1) **Presentation Layer** using React hosted on Vercel; (2) **Business Logic Layer** using NestJS on Railway with modules for authentication, users, orders, payments, stock, and reporting; and (3) **Data Layer** using PostgreSQL with Supabase Storage.

![INSERT FIGURE: Login Page Screenshot]

**Figure 7. Login Page Interface**

![INSERT FIGURE: Dashboard Screenshot]

**Figure 8. Admin/Operator Dashboard**

![INSERT FIGURE: Order Management Screenshot]

**Figure 9. Order Management Interface**

![INSERT FIGURE: Create Order Form Screenshot]

**Figure 10. Create Order Form**

![INSERT FIGURE: Payment Management Screenshot]

**Figure 11. Payment Recording Interface**

![INSERT FIGURE: Stock Management Screenshot]

**Figure 12. Stock Management Interface**

#### 5) System Testing

Black-box testing was conducted across all functional modules. Table 3 presents sample test cases, and Table 4 summarizes the results.

**Table 3. Sample Black-Box Test Cases**

| ID | Module | Test Case | Input | Expected Output | Result |
|----|--------|-----------|-------|-----------------|:------:|
| TC01 | Auth | Valid Login | Correct credentials | Dashboard redirect | Pass |
| TC02 | Auth | Invalid Login | Wrong password | Error message | Pass |
| TC03 | Auth | Single Session | New device login | Previous session terminated | Pass |
| TC04 | Order | Create Order | Valid order data | Order created | Pass |
| TC05 | Order | Empty Order | No items | Validation error | Pass |
| TC06 | Order | Status Update | New status | Status changed | Pass |
| TC07 | Payment | Record DP | Down payment | Payment recorded | Pass |
| TC08 | Stock | Record Incoming | Stock addition | Balance updated | Pass |

**Table 4. Testing Results Summary**

| Category | Test Cases | Passed | Failed | Success Rate |
|----------|:----------:|:------:|:------:|:------------:|
| Authentication | 5 | 5 | 0 | 100% |
| Order Management | 8 | 8 | 0 | 100% |
| Payment Processing | 5 | 5 | 0 | 100% |
| Stock Management | 6 | 6 | 0 | 100% |
| Reporting | 4 | 4 | 0 | 100% |
| **Total** | **28** | **28** | **0** | **100%** |

### 3.2 Analysis of Findings

The testing results demonstrate that SIM4LON successfully meets all functional requirements with 100% pass rate. The multi-tenant implementation using shared database with shared schema proves effective, with data isolation through `pangkalan_id` filtering preventing unauthorized access [7][14].

The technology stack of React, NestJS, and PostgreSQL demonstrates suitability for scalable web applications. Comparing with previous systems [3][4][5][6], SIM4LON provides: (1) modern JavaScript/TypeScript stack; (2) multi-tenant architecture; (3) cloud-native deployment; and (4) comprehensive documentation.

### 3.3 Implications of the Results

**Practical Implications:** Reduced order processing time, improved stock accuracy, faster report generation, and enhanced coordination through driver assignment features.

**Theoretical Implications:** Contributes to knowledge regarding multi-tenant architecture application in distribution management and modern JavaScript frameworks for enterprise applications.

### 3.4 Limitations of the Study

Acknowledged limitations include: (1) only black-box testing performed; (2) advanced security measures not verified; (3) formal usability testing not conducted; (4) scale validation with production data not performed; (5) offline capability not supported.

---

## 4. Conclusion

This research successfully designed and implemented a web-based LPG distribution management information system with multi-tenant architecture. Main contributions: (1) comprehensive UML design with 18 use cases; (2) successful implementation using React 18, NestJS 10, and PostgreSQL 15; (3) 100% pass rate in black-box testing with 28 test cases.

**Recommendations:** Implement rate limiting and security auditing, develop mobile applications, integrate with Pertamina systems, add offline capability, and conduct usability studies.

---

## Acknowledgment

The authors express gratitude to the LPG agents and retail outlet owners in Cianjur Regency who participated in this research.

---

## Declarations

**Author contribution:** Luthfi Alfaridz conducted the research, developed the system, and wrote the manuscript. Siti Sarah supervised the research and reviewed the manuscript.

**Funding statement:** This research received no external funding.

**Conflict of interest:** The authors declare no conflict of interest.

---

## References

[1] Kementerian ESDM RI, "Statistik Minyak dan Gas Bumi Tahun 2024," Jakarta: Kementerian ESDM, 2024.

[2] BPH Migas, "Pedoman Distribusi LPG Tabung di Indonesia," Jakarta: BPH Migas, 2023.

[3] D. Harahap, R. Siregar, and A. Nasution, "Design of web-based LPG 3 Kg sales information system at PT. Nafa Energi Indonesia," *Jurnal Teknologi Informasi*, vol. 11, no. 2, pp. 89-98, 2023.

[4] B. Kurniawan and A. Saputra, "Design of sales information system at LPG retail outlets using Waterfall method," *Jurnal Sistem Informasi*, vol. 9, no. 3, pp. 145-156, 2022.

[5] M. Rahman, S. Utami, and L. Pratiwi, "Gas distribution and inventory information system using distribution requirement planning method," *SATESI*, vol. 4, no. 1, pp. 45-58, 2024.

[6] R. Hidayat and B. Santoso, "Design of web-based LPG distribution management information system," *JUSTIFY*, vol. 2, no. 1, pp. 1-12, 2023.

[7] M. Makendran and A. Krishnamoorthy, "Multi-tenant architecture in SaaS applications: A comprehensive study," *Journal of Cloud Computing*, vol. 12, no. 3, pp. 178-195, 2023.

[8] A. Kumar, S. Sharma, and R. Singh, "Transformative impact of IoT and SCADA systems on LPG industry operational efficiency," *International Journal of Energy Management*, vol. 8, no. 4, pp. 312-328, 2024.

[9] Meta Platforms, Inc., "React documentation," 2025. [Online]. Available: https://react.dev.

[10] NestJS, "NestJS documentation," 2025. [Online]. Available: https://docs.nestjs.com.

[11] PostgreSQL Global Development Group, "PostgreSQL 16 documentation," 2025. [Online]. Available: https://www.postgresql.org/docs/16.

[12] R. S. Pressman and B. R. Maxim, *Software Engineering: A Practitioner's Approach*, 9th ed. New York: McGraw-Hill, 2020.

[13] G. J. Myers, C. Sandler, and T. Badgett, *The Art of Software Testing*, 3rd ed. Hoboken: John Wiley & Sons, 2022.

[14] S. Aulakh, "Multi-tenant database architectures: Isolation strategies for SaaS applications," *Journal of Software Architecture*, vol. 5, no. 2, pp. 67-82, 2023.

[15] K. C. Laudon and J. P. Laudon, *Management Information Systems*, 17th ed. London: Pearson, 2022.

[16] S. Rahmawati, T. Hidayat, and N. Kusuma, "LPG 3Kg distribution information system," *Jurnal Informatika Universitas Subang*, vol. 8, no. 2, pp. 67-78, 2022.

[17] X. Chen, Y. Wang, and Z. Liu, "Distributed LPG small storage tank point supply method with IoT technology," *Proc. Atlantis Press Conf.*, pp. 234-241, 2023.

[18] World LPG Association, "Statistical review of global LPG 2023," Singapore Maritime Foundation, 2023.

[19] Y. Pratama and D. Wijaya, "LPG distribution optimization through multiplatform marketplace application," *IJEST*, vol. 6, no. 1, pp. 23-35, 2024.

[20] Object Management Group, "Unified Modeling Language (UML) specification version 2.5.1," 2023. [Online]. Available: https://www.omg.org/spec/UML.

---

## FIGURE PLACEHOLDERS GUIDE

| Figure | Type | Description |
|:------:|------|-------------|
| 1 | Flowchart | Waterfall Methodology Stages |
| 2 | BPMN | Current System Business Process |
| 3 | UML | Use Case Diagram |
| 4 | UML | Entity Relationship Diagram |
| 5 | UML | Activity Diagram - Create Order (AD-02) |
| 6 | UML | Sequence Diagram - Update Status (SD-04) |
| 7-12 | Screenshot | Login, Dashboard, Order, Create Order, Payment, Stock |

**Total: 4 Tables, 12 Figures, 20 References**
