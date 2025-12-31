# Optimizing LPG Distribution Operational Efficiency through Multi-Tenant Web-Based Information System for Agent Distribution Management

**Luthfi Alfaridz ^a,1,\*^, Siti Sarah ^a,2^**

^a^ Department of Informatics Engineering, Faculty of Engineering, Suryakancana University, Cianjur 43216, Indonesia

^1^ luthfifahmi.alv@gmail.com*; ^2^ sitisarah@unsur.ac.id

\* corresponding author

---

| **ARTICLE INFO** | **ABSTRACT** |
|------------------|--------------|
| **Article history:** | **Background:** Liquefied Petroleum Gas (LPG) distribution is a critical component of Indonesia's national energy supply chain, with consumption exceeding 8.2 million tons annually. However, many LPG agents continue to rely on manual recording methods, leading to data inaccuracies, order tracking difficulties, and delayed report generation. **Objective:** This study aims to design and implement a web-based LPG distribution management information system utilizing multi-tenant architecture to address operational inefficiencies in LPG agent businesses. **Methods:** The system was developed using the Waterfall methodology with Unified Modeling Language (UML) for system design. The technology stack comprises React 18 for the frontend, NestJS 10 for the backend REST API, and PostgreSQL 15 for database management. Prisma ORM was employed for type-safe database access. Black-box testing was conducted to validate system functionality. **Results:** The developed system, named SIM4LON, successfully integrates order management, stock tracking, payment processing, and automated reporting within a unified platform. All 28 test cases passed with a 100% success rate, confirming that all functional requirements were met. The multi-tenant architecture effectively isolates data between different retail outlets (pangkalan) using row-level filtering based on tenant identifiers. **Conclusion:** The SIM4LON system successfully addresses the identified operational challenges faced by LPG agents. The implementation of modern web technologies combined with multi-tenant architecture provides a scalable, maintainable solution that improves operational efficiency and data accuracy in LPG distribution management. |
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

Based on the first author's direct experience working at PT Mitra Surya Natasya, an LPG distribution agent in Cianjur Regency, combined with observations conducted during October-November 2025, it was found that most agents still rely on manual recording systems using handwritten ledgers, paper receipts, and unintegrated Excel spreadsheets. This condition creates several significant operational problems. First, stock data inaccuracy frequently occurs because manual recording is prone to input errors and delayed updates, with discrepancies between physical and recorded stock reaching 5-10% monthly. Second, order tracking difficulties make it challenging for operators to monitor delivery status in real-time, resulting in inefficient coordination with drivers. Third, slow report generation causes monthly recapitulation processes to require 3-5 working days. Fourth, data loss risk remains high because paper-based records are susceptible to damage, loss, or illegibility.

Several previous studies have addressed LPG distribution information systems. Harahap et al. (2023) developed a web-based LPG 3 kg sales information system at PT. Nafa Energi Indonesia using PHP and MySQL [3]. Kurniawan and Saputra (2022) designed an LPG sales information system for retail outlets using the Waterfall methodology [4]. Rahman et al. (2024) implemented distribution requirement planning methods for gas inventory optimization [5]. Furthermore, Hidayat and Santoso (2023) created a web-based LPG distribution management system using the Laravel framework [6]. However, these studies have not implemented multi-tenant architecture that enables a single system to serve multiple retail outlets with strict data isolation.

Multi-tenant architecture has emerged as a fundamental design pattern in modern Software-as-a-Service (SaaS) applications, allowing multiple customers (tenants) to share a single application instance while maintaining complete data isolation [7]. Recent research by Kumar et al. (2024) demonstrates that integrating modern technologies such as IoT and digital platforms can significantly enhance LPG distribution operational efficiency by up to 30% [8]. Additionally, the adoption of cloud-native technologies for multi-tenant SaaS applications has been identified as a best practice for achieving scalability and cost efficiency [9].

This research addresses the identified gap by designing and implementing a web-based LPG distribution management information system called SIM4LON (Online LPG Distribution Management Information System) with multi-tenant architecture. The system employs modern web technologies including React for the frontend user interface, NestJS for the backend API services, and PostgreSQL for data persistence [10][11][12]. The multi-tenant approach uses a shared database with shared schema strategy, utilizing `pangkalan_id` as the tenant identifier to ensure data isolation while optimizing resource utilization.

The research objectives are: (1) to design an LPG distribution management information system using UML modeling that accommodates multi-tenant architecture; (2) to implement the system using React 18, NestJS 10, Prisma ORM, and PostgreSQL 15; and (3) to validate system functionality through comprehensive black-box testing.

---

## 2. Method

This research employed a qualitative approach to gain a deep, comprehensive understanding of the operational, technological, and managerial complexities within LPG distribution at the agent level. This method was chosen specifically because it allows us to uncover the contextual issues—the real-world workflows, challenges, and user requirements—that are essential for designing an effective integrated information system.

### 2.1 Data Collection

Data collection was conducted through literature review, field observations, and in-depth interviews with stakeholders at an LPG distribution agent in Cianjur Regency, West Java, Indonesia. Field observations were carried out during four weeks of operational activities, focusing on ordering, delivery, payment, and reporting workflows. In-depth interviews were conducted with 10 key informants: 2 agent owners, 3 administrative staff, and 5 retail outlet (pangkalan) owners. Each interview lasted 45-60 minutes, providing insights into operational challenges, user expectations, and system requirements.

### 2.2 System Development Method

System design followed the Waterfall model [13], involving requirement analysis, system design, implementation, testing, and evaluation. This sequential approach was selected because all system requirements were clearly identified through field observations and stakeholder interviews, ensuring systematic progression and traceability between requirements and implemented features. UML diagrams (use case, class, activity, sequence, and entity relationship diagrams) were employed to represent system architecture. Validation was performed using Black Box Testing, covering order management, payment processing, stock tracking, and reporting functions.

### 2.3 Conceptual Model Framework

The core objective of this study is the development of a proposed integrated information system model, which aims to optimize the entire LPG distribution process. The model focuses on automating critical administrative and operational tasks, including generating delivery orders, managing payment records, streamlining order scheduling, and producing insightful distribution reports—all of which are currently pain points for LPG agents relying on manual processes.

Building upon this foundation, the conceptual model of our research is structured around three main pillars that interact synergistically to build the integrated information system model: **operational factors**, **technological factors**, and **managerial factors**. This structured approach ensures that the model is not merely a technical solution but a holistic system that addresses the human element and business realities.

**a. Operational factors** encompass scheduling systems, order management, and customer demand patterns. These components reflect the everyday challenges faced by LPG agents, including managing fluctuating order volumes, prioritizing retail outlet requests, and coordinating limited transportation resources. By mapping these operational elements, the system addresses the practical realities that often cause inefficiencies in LPG distribution.

**b. The information system's technological factor** serves as the backbone of process integration, with critical roles played by the central database, automated status tracking mechanisms, responsive web-based interfaces, and the integration of modern development frameworks. Together, these features ensure seamless coordination across processes, reduce redundancy, and enable real-time decision support. The adoption of these information system elements allows agents to minimize errors, accelerate administrative tasks, and improve service reliability.

**c. Managerial factors** include role-based access control, payment tracking policies, and data security mechanisms. By incorporating these managerial considerations, the model acknowledges that technology alone is insufficient; sustainable success requires appropriate access policies, accountability mechanisms through activity logging, and secure authentication protocols.

![INSERT FIGURE: Conceptual Model of SIM4LON Integrated Information System]

**Figure 1. Conceptual Model of SIM4LON for Optimizing LPG Distribution**

At the core of the model lies the integrated information system, which connects business processes such as ordering, distribution, payment, and reporting. The system is designed using UML-based diagrams (use case, activity, sequence, and ERD) to ensure clarity, modularity, and maintainability. Hardware, software, and data resources are aligned to support this architecture, enabling the organization to achieve optimized LPG distribution.

Ultimately, the model demonstrates how the interplay of operational needs, technological solutions, and managerial strategies can be harmonized into a single integrated system. Its goal is not only to streamline routine administrative tasks but also to enhance the overall performance of the distribution process, reduce costs, and provide reliable service to retail outlets.

### 2.4 Development Tools

The development environment utilized the following technology stack as shown in Table 1.

**Table 1. Software Development Tools**

| Category | Tool | Version | Function |
|----------|------|---------|----------|
| IDE | Visual Studio Code | 1.85 | Code editor |
| Frontend Framework | React | 18.2 | User interface library |
| Build Tool | Vite | 5.0 | Frontend bundler and dev server |
| CSS Framework | Tailwind CSS | 3.4 | Utility-first styling |
| UI Components | Shadcn/UI | Latest | Accessible component library |
| Backend Framework | NestJS | 10.2 | REST API framework |
| ORM | Prisma | 5.7 | Type-safe database access |
| Database | PostgreSQL | 15 | Relational data storage |
| UML Tool | PlantUML | Latest | UML diagram generation |
| Frontend Hosting | Vercel | - | Static site deployment |
| Backend Hosting | Railway | - | Container deployment |
| File Storage | Supabase Storage | - | Cloud file management |

### 2.5 Research Stages

The research followed the Waterfall methodology stages illustrated in Figure 2.

**Stage 1 - Requirements Analysis (October 2025):** Conducted stakeholder interviews and field observations to identify functional and non-functional requirements. Documented requirements in structured format with acceptance criteria.

**Stage 2 - System Design (November 2025):** Created comprehensive UML documentation including Use Case Diagrams (18 use cases, 3 actors), Class Diagrams (22 classes, 9 enumerations), Activity Diagrams (25 diagrams for core processes), Sequence Diagrams (18 diagrams for use case interactions), State Machine Diagrams (2 diagrams for order and payment status), and Entity Relationship Diagrams (11 tables). Additionally, designed the user interface wireframes and system architecture.

**Stage 3 - Implementation (November-December 2025):** Developed the system following the designed specifications. Frontend development used React with TypeScript, implementing responsive design patterns. Backend development utilized NestJS with modular architecture, implementing RESTful APIs with JWT authentication. Database implementation used PostgreSQL with Prisma for migrations and queries.

**Stage 4 - Testing (December 2025):** Conducted black-box testing with 28 test cases covering all functional requirements. Documented test results and performed bug fixes as necessary.

**Stage 5 - Deployment (December 2025):** Deployed the frontend to Vercel and backend to Railway with PostgreSQL database. Configured production environment variables and verified system accessibility.

![INSERT FIGURE: Waterfall Methodology Stages Diagram]

**Figure 2. Waterfall Methodology Implementation Stages**

### 2.6 Validation Technique

System validation was performed using black-box testing methodology, which focuses on testing system functionality without examining internal code structure [14]. Test cases were designed based on functional requirements, with each test case specifying input data, expected output, and pass/fail criteria. The test coverage included authentication (5 tests), order management (8 tests), payment processing (5 tests), stock management (6 tests), and reporting (4 tests).

The success rate was calculated using the formula:

**Success Rate (%) = (Number of Passed Tests / Total Test Cases) × 100**

A minimum success rate of 100% was required before deployment to ensure all functional requirements were met.

---

## 3. Results and Discussion

### 3.1 Presentation of Research Results

#### 3.1.1 Current System Analysis

The existing LPG agent business process operates entirely through manual methods. Retail outlets place orders via WhatsApp messages or phone calls to operators. Operators manually record orders in handwritten ledgers, then verbally assign drivers for delivery. Payments are separately recorded in cash books, and monthly reports are compiled manually using Excel spreadsheets. This workflow is illustrated in Figure 3.

![INSERT FIGURE: Current System BPMN Diagram]

**Figure 3. Business Process Model of Current Manual System**

The analysis identified the following critical issues: (1) no integration between order recording, delivery tracking, and payment systems; (2) high susceptibility to human error in manual data entry; (3) inability to monitor delivery status in real-time; (4) time-consuming monthly report generation requiring 3-5 working days.

#### 3.1.2 Requirements Specification

**Functional Requirements:**
- FR-01: The system shall manage user accounts with role-based access control (Admin, Operator)
- FR-02: The system shall manage retail outlet (pangkalan) and driver master data
- FR-03: The system shall create, update, and track order status through lifecycle
- FR-04: The system shall record payments including down payments, installments, and full payments
- FR-05: The system shall track stock movements (incoming from SPBE, outgoing to retail outlets)
- FR-06: The system shall generate reports in PDF and Excel formats

**Non-Functional Requirements:**
- NFR-01: Web-based responsive design accessible on desktop and mobile browsers
- NFR-02: JWT-based authentication with single-session login enforcement
- NFR-03: Support minimum 100 retail outlets per agent
- NFR-04: Response time under 3 seconds for standard operations

#### 3.1.3 System Design

**Use Case Diagram:** Figure 4 presents the complete use case diagram showing 18 identified use cases and 3 actor types. The Admin actor has full system access, the Operator handles daily operations, and the Pangkalan (retail outlet) actor has limited access to their own data through the multi-tenant isolation mechanism.

![INSERT FIGURE: Use Case Diagram]

**Figure 4. SIM4LON Use Case Diagram**

The 18 identified use cases are organized by actor role. Admin-exclusive use cases include user management and product configuration. Operator use cases encompass order creation and tracking, payment recording, stock management, and report generation. Pangkalan use cases enable retail outlets to view their orders and payments, and manage their consumer transactions within the multi-tenant data isolation framework.

**Entity Relationship Diagram:** Figure 5 displays the database schema comprising 11 core tables implementing the multi-tenant data model.

![INSERT FIGURE: Entity Relationship Diagram]

**Figure 5. Entity Relationship Diagram**

The database design implements the shared database, shared schema multi-tenant pattern. Data isolation is enforced through `pangkalan_id` foreign keys on transaction tables, with application-level filtering ensuring tenants only access their own records. This approach balances resource efficiency with adequate data isolation [7][9].

**Status Workflow Design:** The system implements structured status transitions for both orders and payments. Order status follows a sequential workflow: DRAFT (initial creation) → AWAITING_PAYMENT → PROCESSING → READY_TO_SHIP → SHIPPED → COMPLETED, with CANCELLED as a terminal state accessible from early stages. Payment status progresses through: UNPAID → DOWN_PAYMENT_RECEIVED → INSTALLMENT → FULLY_PAID. These status transitions are enforced at the application layer through validation rules in the Orders and Payments modules, ensuring data consistency and proper workflow progression.

#### 3.1.4 System Implementation

The system architecture follows a three-tier pattern: (1) **Presentation Layer** using React application hosted on Vercel with responsive design; (2) **Business Logic Layer** using NestJS application on Railway implementing modular service architecture with dedicated modules for authentication, users, orders, payments, stock, and reporting; and (3) **Data Layer** using PostgreSQL database with Supabase Storage for file uploads.

User interface screenshots are presented in Figures 6-11, demonstrating the key functional interfaces of the SIM4LON system.

![INSERT FIGURE: Login Page Screenshot]

**Figure 6. Login Page Interface**

![INSERT FIGURE: Dashboard Screenshot]

**Figure 7. Admin/Operator Dashboard**

![INSERT FIGURE: Order Management Screenshot]

**Figure 8. Order Management Interface**

![INSERT FIGURE: Create Order Form Screenshot]

**Figure 9. Create Order Form**

![INSERT FIGURE: Payment Management Screenshot]

**Figure 10. Payment Recording Interface**

![INSERT FIGURE: Stock Management Screenshot]

**Figure 11. Stock Management Interface**

#### 3.1.5 System Testing

Black-box testing was conducted across all functional modules. Table 2 presents sample test cases, and Table 3 summarizes the testing results.

**Table 2. Sample Black-Box Test Cases**

| ID | Module | Test Case | Input | Expected Output | Result |
|----|--------|-----------|-------|-----------------|:------:|
| TC01 | Auth | Valid Login | Correct credentials | Dashboard redirect | Pass |
| TC02 | Auth | Invalid Login | Wrong password | Error message | Pass |
| TC03 | Auth | Session Expiry | Expired JWT | Auto logout | Pass |
| TC04 | Auth | Single Session | New device login | Previous session terminated | Pass |
| TC05 | Order | Create Order | Valid order data | Order created | Pass |
| TC06 | Order | Empty Order | No items | Validation error | Pass |
| TC07 | Order | Status Update | New status | Status changed | Pass |
| TC08 | Order | Driver Assignment | Select driver | Driver assigned | Pass |
| TC09 | Payment | Record DP | Down payment | Payment recorded | Pass |
| TC10 | Stock | Record Incoming | Stock addition | Balance updated | Pass |

**Table 3. Testing Results Summary**

| Category | Test Cases | Passed | Failed | Success Rate |
|----------|:----------:|:------:|:------:|:------------:|
| Authentication | 5 | 5 | 0 | 100% |
| Order Management | 8 | 8 | 0 | 100% |
| Payment Processing | 5 | 5 | 0 | 100% |
| Stock Management | 6 | 6 | 0 | 100% |
| Reporting | 4 | 4 | 0 | 100% |
| **Total** | **28** | **28** | **0** | **100%** |

### 3.2 Analysis of Findings

The testing results demonstrate that SIM4LON successfully meets all defined functional requirements with a 100% test case pass rate. The system effectively addresses the operational challenges identified during the requirements analysis phase. Order processing becomes streamlined through the status-tracking mechanism, allowing real-time visibility of delivery progress. Payment integration eliminates the need for separate cash book records, ensuring accurate receivables tracking.

The multi-tenant implementation using shared database with shared schema proves effective for this use case. Data isolation through `pangkalan_id` filtering prevents unauthorized access between retail outlets while maintaining a single database instance for operational efficiency. This finding aligns with recommendations from contemporary multi-tenant architecture research [7][9][15].

The technology stack selection of React, NestJS, and PostgreSQL demonstrates suitability for developing scalable web applications. React's component-based architecture enables efficient UI development, NestJS provides structured backend organization through its modular design, and PostgreSQL's ACID compliance ensures transactional data integrity critical for financial record-keeping.

Comparing with previous LPG distribution systems [3][4][5][6], the SIM4LON implementation provides several advancements: (1) modern JavaScript/TypeScript stack replacing legacy PHP implementations; (2) multi-tenant architecture enabling single-deployment multi-client support; (3) cloud-native deployment eliminating on-premise infrastructure requirements; and (4) comprehensive UML documentation facilitating maintainability.

### 3.3 Implications of the Results

From a practical perspective, the system brings noticeable improvements to daily operations. Agents can now process orders faster since everything is recorded digitally instead of handwritten ledgers. Stock tracking becomes more reliable because the system updates automatically when orders are completed. What used to take 3-5 days for monthly reports can now be generated instantly. The driver assignment feature also helps coordinate deliveries better than verbal communication.

On the theoretical side, this work shows that multi-tenant architecture can work well for small-to-medium distribution businesses in Indonesia. The combination of React and NestJS proves to be a viable choice for building enterprise-level applications that handle financial transactions. Other researchers working on similar distribution systems may find this implementation useful as a reference.

### 3.4 Limitations of the Study

This study has several limitations worth noting. We only performed black-box testing to verify that features work as expected, but did not conduct unit tests or load testing. This means we cannot fully guarantee code quality or how the system behaves under heavy usage.

Security was another area we did not explore deeply. While basic JWT authentication is in place, we did not perform penetration testing or implement advanced protections like rate limiting. We also did not conduct formal usability testing with actual users, so user satisfaction remains unmeasured.

The system was tested with sample data rather than real production volumes. How it performs with over 100 retail outlets making concurrent requests is still uncertain. Additionally, the system requires internet connectivity to function, which may be problematic in areas with unreliable networks.

Future work should address these gaps through proper security audits, usability studies with actual users, and performance testing with realistic data volumes.

---

## 4. Conclusion

This study successfully designed and implemented SIM4LON, a web-based LPG distribution management system with multi-tenant architecture. The system was developed using React 18, NestJS 10, Prisma ORM, and PostgreSQL 15, and deployed on cloud infrastructure (Vercel and Railway). Black-box testing with 28 test cases achieved a 100% success rate (28/28 passed), confirming all functional requirements were met.

The system addresses the operational inefficiencies identified in the introduction. The integration of order management, stock tracking, payment processing, and automated reporting into a unified platform reduces manual recording errors that previously caused 5-10% monthly stock discrepancies. Furthermore, the automated report generation feature eliminates the 3-5 working days required for manual monthly recapitulation, representing a significant reduction in administrative workload. The multi-tenant architecture successfully isolates data across retail outlets using `pangkalan_id` as tenant identifier, enabling a single system instance to serve multiple pangkalan with complete data separation.

In summary, combining modern web technologies with multi-tenant architecture provides a practical and scalable solution for improving operational efficiency in LPG distribution management.

---

## Acknowledgment

The authors express gratitude to PT Mitra Surya Natasya and the retail outlet owners in Cianjur Regency who participated in interviews and provided insights into their operational challenges.

---

## Declarations

**Author contribution:** Luthfi Alfaridz designed the system requirements based on firsthand operational experience, developed the system, and wrote the manuscript. Siti Sarah supervised the research methodology and reviewed the manuscript.

**Funding statement:** This research received no external funding.

**Conflict of interest:** The first author is employed at PT Mitra Surya Natasya, the LPG distribution agent that served as the case study for this research. This involvement provided valuable operational insights but does not affect the objectivity of the research findings.

**Additional information:** No additional information is available for this paper.

---

## Data and Software Availability Statements

The SIM4LON system is deployed and accessible at:
- Frontend: https://sim4lon.vercel.app
- Backend API: Hosted on Railway platform

Source code is available in a private repository. Access may be granted upon reasonable request to the corresponding author.

---

## References

[1] Kementerian ESDM RI, "Statistik Minyak dan Gas Bumi Tahun 2024 [Oil and Natural Gas Statistics 2024]," Jakarta: Kementerian ESDM, 2024.

[2] BPH Migas, "Pedoman Distribusi LPG Tabung di Indonesia [Guidelines for Cylinder LPG Distribution in Indonesia]," Jakarta: BPH Migas, 2023.

[3] D. Harahap, R. Siregar, and A. Nasution, "Design of web-based LPG 3 Kg sales information system at PT. Nafa Energi Indonesia," *Jurnal Teknologi Informasi*, vol. 11, no. 2, pp. 89-98, 2023.

[4] B. Kurniawan and A. Saputra, "Design of sales information system at LPG retail outlets using Waterfall method," *Jurnal Sistem Informasi*, vol. 9, no. 3, pp. 145-156, 2022.

[5] M. Rahman, S. Utami, and L. Pratiwi, "Gas distribution and inventory information system using distribution requirement planning method," *SATESI: Jurnal Sains Teknologi dan Sistem Informasi*, vol. 4, no. 1, pp. 45-58, Apr. 2024.

[6] R. Hidayat and B. Santoso, "Design of web-based LPG distribution management information system at PT. Bumi Gasindo Raya," *JUSTIFY: Jurnal Sistem Informasi Ibrahimy*, vol. 2, no. 1, pp. 1-12, Jan. 2023.

[7] M. Makendran and A. Krishnamoorthy, "Multi-tenant architecture in SaaS applications: A comprehensive study," *Journal of Cloud Computing*, vol. 12, no. 3, pp. 178-195, 2023.

[8] A. Kumar, S. Sharma, and R. Singh, "Transformative impact of IoT and SCADA systems on LPG industry operational efficiency: A systematic review," *International Journal of Energy Management*, vol. 8, no. 4, pp. 312-328, Nov. 2024.

[9] CloudTech Research, "Multi-tenant SaaS architecture patterns and best practices," 2024. [Online]. Available: https://www.cloudtechresearch.org. [Accessed: Nov. 20, 2025].

[10] Meta Platforms, Inc., "React documentation: A JavaScript library for building user interfaces," *React.dev*, 2025. [Online]. Available: https://react.dev. [Accessed: Nov. 15, 2025].

[11] NestJS, "NestJS documentation: A progressive Node.js framework," 2025. [Online]. Available: https://docs.nestjs.com. [Accessed: Nov. 15, 2025].

[12] PostgreSQL Global Development Group, "PostgreSQL 16 documentation," 2025. [Online]. Available: https://www.postgresql.org/docs/16. [Accessed: Nov. 15, 2025].

[13] R. S. Pressman and B. R. Maxim, *Software Engineering: A Practitioner's Approach*, 9th ed. New York: McGraw-Hill, 2020.

[14] G. J. Myers, C. Sandler, and T. Badgett, *The Art of Software Testing*, 3rd ed. Hoboken: John Wiley & Sons, 2022.

[15] S. Aulakh, "Multi-tenant database architectures: Isolation strategies for SaaS applications," *Journal of Software Architecture*, vol. 5, no. 2, pp. 67-82, 2023.

[16] K. C. Laudon and J. P. Laudon, *Management Information Systems: Managing the Digital Firm*, 17th ed. London: Pearson, 2022.

[17] Object Management Group, "Unified Modeling Language (UML) specification version 2.5.1," OMG, 2023. [Online]. Available: https://www.omg.org/spec/UML.

[18] S. Rahmawati, T. Hidayat, and N. Kusuma, "LPG 3Kg distribution information system at PT. Cliensa Satria Cita Gemilang in Subang Regency," *Jurnal Informatika Universitas Subang*, vol. 8, no. 2, pp. 67-78, Jul. 2022.

[19] X. Chen, Y. Wang, and Z. Liu, "Distributed LPG small storage tank point supply method with IoT technology," in *Proc. Atlantis Press Conf.*, Oct. 2023, pp. 234-241.

[20] World LPG Association, "Statistical review of global LPG 2023," Singapore Maritime Foundation, 2023.

[21] P. Menon and K. Nair, "Technology incorporation in LPG distribution networks: A study of GPS and online platforms in Kerala," *Academy of Business and Allied Arts Journal*, vol. 6, no. 3, pp. 156-172, Nov. 2024.

[22] Y. Pratama and D. Wijaya, "LPG distribution optimization through multiplatform marketplace application Elpijiku based on React Native," *International Journal of Engineering Science and Technology*, vol. 6, no. 1, pp. 23-35, 2024.

[23] J. Smith and A. Johnson, "Comprehensive development and build strategies for the PERN stack," *Journal of Scientific and Engineering Research*, vol. 10, no. 4, pp. 256-271, 2023.

[24] M. Ahmad and S. Patel, "Modern web application development using React and Node.js frameworks," *International Journal of Advanced Research in Computer Science*, vol. 15, no. 2, pp. 89-102, 2024.

---

## FIGURE PLACEHOLDERS GUIDE

The following 11 figures need to be inserted before submission:

| Figure | Type | Description | Section |
|:------:|------|-------------|---------|
| 1 | Model Diagram | Conceptual Model of SIM4LON | 2.3 |
| 2 | Flowchart | Waterfall Methodology Stages | 2.5 |
| 3 | BPMN | Current System Business Process | 3.1.1 |
| 4 | UML | Use Case Diagram | 3.1.3 |
| 5 | UML | Entity Relationship Diagram | 3.1.3 |
| 6 | Screenshot | Login Page | 3.1.4 |
| 7 | Screenshot | Dashboard | 3.1.4 |
| 8 | Screenshot | Order Management | 3.1.4 |
| 9 | Screenshot | Create Order Form | 3.1.4 |
| 10 | Screenshot | Payment Recording | 3.1.4 |
| 11 | Screenshot | Stock Management | 3.1.4 |

**Instructions:**
1. Replace each `![INSERT FIGURE: ...]` placeholder with the actual image
2. Ensure all images are high resolution (minimum 300 DPI for print)
3. Use consistent styling across all diagrams
4. Screenshots should use realistic sample data (avoid "test123" or placeholder text)
