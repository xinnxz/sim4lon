# Development of Intelligent Decision Support System for Optimizing LPG Distribution Management with Multi-Tenant Architecture

**Luthfi Alfaridz ^a,1,\*^, Siti Sarah ^a,2^**

^a^ Department of Informatics Engineering, Faculty of Engineering, Suryakancana University, Cianjur 43216, Indonesia

^1^ luthfifahmi.alv@gmail.com*; ^2^ sitisarah@unsur.ac.id

\* corresponding author

---

| **ARTICLE INFO** | **ABSTRACT** |
|------------------|--------------|
| **Article history:** | Distribution agents managing liquefied petroleum gas operations encounter multifaceted decision-making challenges encompassing order prioritization, inventory replenishment timing, and receivables collection sequencing. Conventional manual approaches lack the systematic intelligence necessary for timely operational decisions. This research develops an Intelligent Decision Support System (IDSS) engineered to transform raw transactional data into actionable intelligence for LPG distribution optimization. The system was constructed following Decision Support System design methodology integrated with structured software engineering principles, incorporating three primary decision support capabilities: an Operational Health Index synthesizing multiple performance indicators into a unified metric, Stock Threshold Monitoring with automated replenishment advisories, and Receivables Aging Analysis for collection prioritization. Technical implementation employed contemporary web technologies including React 18, NestJS 10, and PostgreSQL 15 within a tenant-isolated database architecture. Black-box testing across 35 test scenarios yielded complete functional compliance. The Health Index mechanism aggregates inventory status, payment collection rates, and order backlog metrics to present a singular operational performance indicator ranging from 0 to 100. Implementation results demonstrate that integrating Decision Support System principles with modern web technologies provides an effective mechanism for enhancing operational decision-making within LPG distribution contexts. |
| Received: | |
| Revised: | |
| Accepted: | |
| **Keywords:** | |
| Decision Support System; Intelligent System; LPG Distribution; Multi-Tenant Architecture; Operational Optimization | |

---

## 1. Introduction

Liquefied petroleum gas represents one of the most strategically significant energy resources serving Indonesian households and commercial establishments. Statistical records from the Ministry of Energy and Mineral Resources document national LPG consumption surpassing 8.2 million metric tons annually, demonstrating consistent growth trajectories of 4-5% per annum [1]. This escalating consumption introduces substantial operational complexity throughout the distribution network extending from production facilities to end consumers, necessitating sophisticated management approaches capable of addressing the dynamic nature of supply chain operations.

The Indonesian LPG distribution architecture encompasses multiple interconnected stakeholders operating within a structured hierarchical framework. Pertamina, functioning as the primary national producer, transfers product to bulk filling stations designated as SPBE (Stasiun Pengisian Bulk Elpiji), which subsequently supply authorized distribution agents. These agents coordinate deliveries to retail outlets locally termed pangkalan, which serve as the final consumer interface [2]. Individual distribution agents typically oversee networks comprising dozens to hundreds of retail outlets, managing substantial daily transaction volumes encompassing ordering, fulfillment, payment reconciliation, and regulatory reporting activities that demand systematic coordination and timely decision-making capabilities.

Empirical observations conducted by the primary author during professional engagement at PT Mitra Surya Natasya, an LPG distribution enterprise operating in Cianjur Regency during October-November 2025, revealed persistent reliance upon manual recordkeeping methodologies across the operational workflow. This condition generates several consequential decision-making impediments affecting operational efficiency. Operational personnel lack visibility into real-time inventory levels and threshold-triggered notifications, resulting in suboptimal stock replenishment timing manifesting as either supply exhaustion or excessive stockholding conditions. The absence of systematic evaluation mechanisms for concurrent order processing creates prioritization challenges wherein high-value or time-sensitive transactions potentially experience delays regardless of their business significance. Outstanding payment tracking through manual methods impedes identification of accounts requiring immediate attention, while the lack of aging analysis capabilities prevents strategic allocation of collection efforts. Furthermore, without aggregated performance indicators, distribution agents cannot readily assess operational health status or identify areas demanding prioritized intervention.

Decision Support Systems constitute interactive computational platforms engineered to assist practitioners in leveraging data and analytical models for problem identification, resolution, and decision formulation [3]. Contemporary DSS architectures, as articulated by Turban and colleagues, synthesize data management, model management, and dialog management subsystems to transmute unprocessed data into actionable intelligence suitable for organizational decision-making [4]. Power and Sharda further categorize DSS into model-driven, data-driven, and knowledge-driven systems, emphasizing the importance of analytical models in supporting semi-structured decisions [14]. The fundamental premise underlying DSS design posits that effective decision support requires not merely data presentation but rather the transformation of data into contextually relevant information accompanied by actionable recommendations. Business intelligence systems extend DSS capabilities by integrating analytics with operational data to generate actionable insights [15].

Recent empirical investigations demonstrate DSS effectiveness within distribution and logistics contexts. Research conducted by Li and Wang documented an intelligent DSS implementation for supply chain optimization achieving 40% reduction in decision formulation duration through automated recommendation generation mechanisms [5]. Kumar and colleagues reported IoT-enabled DSS deployment within LPG distribution operations yielding 30% operational efficiency enhancement through real-time monitoring and alerting capabilities [6]. These findings establish empirical precedent for DSS application within energy distribution domains.

Within the specific context of LPG distribution, previous studies have addressed information system development requirements from various perspectives. Harahap and colleagues constructed web-based LPG sales information systems emphasizing transactional processing capabilities [7]. Kurniawan and Saputra engineered LPG sales platforms employing structured development methodologies focused on recording and reporting functions [8]. Rahman and colleagues implemented distribution requirement planning approaches addressing inventory management concerns [9]. However, critical examination of these investigations reveals concentration upon transactional processing functionality without incorporating Decision Support System capabilities for operational optimization. The identified research gap encompasses the absence of DSS implementation within existing LPG distribution systems capable of providing automated alerting mechanisms triggered by configurable thresholds, aggregated health metrics enabling operational assessment, intelligent recommendations supporting decision processes, and priority scoring facilitating resource allocation.

This investigation addresses the identified gap through development of an Intelligent Decision Support System designated SIM4LON, pursuing three primary objectives. The first objective encompasses designing an IDSS framework integrating operational, technological, and managerial dimensions appropriate for LPG distribution contexts. The second objective involves engineering DSS functionality encompassing Health Index calculation, Low Stock Alerting, and Payment Overdue Alerting capabilities. The third objective addresses system validation through systematic functional evaluation employing established software testing methodologies.

---

## 2. Method

This investigation employed qualitative research methodology to develop comprehensive understanding of decision-making processes within LPG distribution operations, facilitating identification of information requirements and decision support opportunities.

Data acquisition proceeded through multiple complementary approaches. Literature examination encompassed academic publications addressing Decision Support Systems, LPG distribution management, and multi-tenant software architecture to establish theoretical foundations and identify research gaps. Field observation activities conducted at an LPG distribution agent located in Cianjur Regency, West Java Province, specifically targeted decision-making patterns during order processing, delivery scheduling, payment collection, and inventory management activities. These observations revealed the temporal constraints and information limitations affecting operational decisions. Structured interviews engaging ten key informants comprising two agency principals, three administrative personnel, and five retail outlet operators explored decision-making challenges, information requirements, and desired system support capabilities. Interview data underwent thematic analysis to identify recurring decision support needs across stakeholder categories.

The Intelligent Decision Support System construction followed established DSS development lifecycle phases integrated with structured software engineering methodology. The planning stage characterized decision types requiring support, identified decision-maker profiles across organizational levels, and documented information prerequisites for each decision category. The investigation stage analyzed existing decision workflows to understand current practices and information sources, revealing dependencies and bottlenecks in the decision chain. The analysis stage specified DSS component requirements addressing data management for operational information, model management for decision algorithms, and dialog management for user interaction. The design stage formulated system architecture employing structured development principles to ensure systematic implementation [10]. The implementation stage constructed DSS functionality utilizing contemporary web technology stack. The validation stage confirmed functionality through black-box testing protocols examining system behavior against specified requirements [11].

The Intelligent Decision Support System conceptual model organizes around three synergistically interacting pillars forming the integrated platform, as illustrated in Figure 1. The operational dimension addresses order administration capabilities encompassing processing, status tracking, and prioritization, scheduling mechanisms for delivery queue management and route coordination, and demand pattern analysis for customer request examination and trend identification [18]. The technological dimension encompasses unified database implementation with tenant isolation ensuring data segregation, automated subsystems managing status tracking, inventory synchronization, and alert generation, user interface layer providing responsive dashboard access with real-time refresh capabilities, and DSS processing engine responsible for Health Index computation, threshold monitoring, and recommendation synthesis. The managerial dimension incorporates access governance through role-based permission structures differentiating Administrator, Operator, and Retail Outlet access levels [23], payment policy enforcement managing deposit, installment, and full payment workflow tracking, and security infrastructure implementing token-based authentication, single-session enforcement, and comprehensive audit logging.

![Figure 1. Conceptual Architecture of IDSS for LPG Distribution Optimization](images/model_iis_dss.png)

**Figure 1.** Conceptual Architecture of IDSS for LPG Distribution Optimization

The system use case diagram illustrating stakeholder interactions with the platform is presented in Figure 2. The diagram depicts three primary actors: Administrator with full system access, Operator handling daily operations, and Pangkalan (retail outlet) managing their respective transactions. The Monitoring DSS use case represents the decision support functionality integrated into the system.

![Figure 2. Use Case Diagram of SIM4LON System](images/use_case_dss.png)

**Figure 2.** Use Case Diagram of SIM4LON System

The DSS engine architecture resides within a dedicated service module in the backend, exposing functionality through a RESTful API endpoint. The interaction between system components during DSS alert retrieval is illustrated in the sequence diagram presented in Figure 3.

![Figure 3. Sequence Diagram of DSS Alert Retrieval Process](images/sequence_dss_alert.png)

**Figure 3.** Sequence Diagram of DSS Alert Retrieval Process

The engine performs three sequential analysis phases: inventory level analysis identifying products below configured thresholds, receivables aging analysis identifying orders with payment outstanding beyond configured duration, and Health Index computation synthesizing findings into the composite metric. The complete activity flow for DSS alert generation is illustrated in Figure 4.

![Figure 4. Activity Diagram of DSS Alert Generation Process](images/activity_dss_alert.png)

**Figure 4.** Activity Diagram of DSS Alert Generation Process

The multi-tenant database architecture implements shared database with shared schema pattern, as illustrated in the Entity Relationship Diagram presented in Figure 5, wherein all tenants share common database infrastructure and table structures while maintaining logical data separation through foreign key relationships.

![Figure 5. Database Schema Demonstrating Multi-Tenant Architecture](images/erd_sim4lon.png)

**Figure 5.** Database Schema Demonstrating Multi-Tenant Architecture

The IDSS incorporates three fundamental decision support capabilities designed to address identified operational requirements. The Operational Health Index constitutes a composite measurement aggregating multiple operational indicators including inventory availability across product categories, receivables collection status, and order backlog evaluation into a singular metric ranging from 0 to 100. The calculation methodology applies penalty deductions from a baseline score based on the count of low-inventory items, overdue receivables, and pending orders, with maximum penalty thresholds preventing any single factor from dominating the composite score. This approach ensures balanced representation of operational dimensions while providing intuitive interpretation through the familiar percentage scale.

Stock Threshold Monitoring implements threshold-triggered surveillance with severity categorization to support inventory replenishment decisions [24]. The system classifies inventory status as Advisory when levels fall below 50 units while remaining at or above 25 units, and Critical when inventory falls below 25 units. Each notification includes automated advisory text contextualizing the alert and suggesting appropriate response actions, thereby transforming mere data presentation into actionable guidance.

Receivables Aging Analysis provides duration-based prioritization for collection initiatives by categorizing outstanding payments according to their overdue duration. Payments outstanding between 7 and 14 days receive Advisory classification, while those exceeding 14 days receive Critical designation. Alert sequencing by severity classification and outstanding amount enables collection personnel to focus efforts on accounts presenting greatest risk or value, optimizing resource allocation for receivables management.

Technical implementation employed contemporary web technologies selected for their suitability to the system requirements and long-term maintainability, as summarized in Table 1.

**Table 1.** Development Technology Stack

| Component | Technology | Version | Function |
|-----------|------------|---------|----------|
| Frontend Framework | React | 18.2 | User interface development |
| Backend Framework | NestJS | 10.2 | API endpoint development |
| ORM | Prisma | 5.7 | Database access operations |
| Database | PostgreSQL | 15 | Multi-tenant data storage |
| Cloud Hosting | Vercel/Railway | - | Production deployment |

The frontend framework utilized React version 18.2 to construct responsive user interfaces with DSS dashboard capabilities [21]. The backend framework employed NestJS version 10.2 for DSS API endpoint development following modular architecture principles [22]. Data access operations utilized Prisma ORM version 5.7 for database interactions. PostgreSQL version 15 served as the multi-tenant data storage platform, implementing shared database with shared schema multi-tenancy pattern wherein data isolation enforcement operates through foreign key relationships with application-level filtering mechanisms [12][13]. This architectural approach balances resource efficiency with adequate tenant separation for the application context, following enterprise application patterns documented by Fowler [19]. The microservices-oriented backend design facilitates independent scaling and maintenance of system components [20].

System validation employed black-box testing methodology examining system behavior from the user perspective without regard to internal implementation details [11]. Test scenario coverage included DSS alert generation precision, threshold boundary condition verification, Health Index calculation accuracy, and advisory text generation correctness. The validation approach follows established software engineering practices for functional verification [25].

---

## 3. Results and Discussion

System implementation produced the SIM4LON platform incorporating the designed IDSS capabilities within a cohesive web-based interface. The system provides secure access through an authentication interface implementing role-based access control, as shown in Figure 6.

![Figure 6. User Authentication Interface](images/login_interface.png)

**Figure 6.** User Authentication Interface

The DSS dashboard delivers at-a-glance operational intelligence through a Decision Support Section positioned prominently within the administrative interface, as depicted in Figure 7, enabling rapid assessment of operational status without requiring navigation through multiple system components.

![Figure 7. Intelligent Decision Support Dashboard Interface](images/dashboard_dss.png)yg

**Figure 7.** Intelligent Decision Support Dashboard Interface

The dashboard interface presents the Operational Health Index as a circular gauge visualization displaying the 0-100 rating with color-coded status indication, transitioning through green, yellow, orange, and red zones corresponding to decreasing health levels. Adjacent summary statistics provide quick-reference counts for pending orders, urgent deliveries, low inventory items, and overdue receivables, enabling decision-makers to identify areas requiring attention at a glance. Low Stock Alerts appear as individual cards displaying current inventory quantity, threshold parameters, severity classification, and automated advisories specific to each product. Payment Overdue Alerts present as a sequenced listing with outlet identification, overdue duration, outstanding amount, and collection recommendations ordered by priority.

The order management interface, presented in Figure 8, enables comprehensive transaction processing including order creation, status tracking, and payment recording. This interface serves as the primary data entry point feeding the DSS analytics engine.

![Figure 8. Order Management Interface](images/order_interface.png)

**Figure 8.** Order Management Interface

Inventory management functionality, depicted in Figure 9, provides stock level monitoring and adjustment capabilities. The threshold parameters configured through this interface directly influence the Low Stock Alert generation within the DSS module.

![Figure 9. Stock Management Interface](images/stock_interface.png)

**Figure 9.** Stock Management Interface

Each operational entity including orders, inventory records, and payment records includes a reference to the owning retail outlet, enabling application-level filtering to restrict data access to authorized records. This approach balances infrastructure efficiency with adequate data isolation for the application context, avoiding the administrative complexity of separate database instances while ensuring tenants cannot access data belonging to other tenants.

Black-box testing procedures validated all system functions including DSS-specific capabilities across 35 test scenarios organized by functional area, with complete results summarized in Table 2.

**Table 2.** Comprehensive Validation Summary

| Functional Area | Test Scenarios | Passed | Success Rate |
|-----------------|:--------------:|:------:|:------------:|
| Authentication | 5 | 5 | 100% |
| Order Administration | 8 | 8 | 100% |
| Payment Processing | 5 | 5 | 100% |
| Inventory Management | 6 | 6 | 100% |
| DSS Capabilities | 7 | 7 | 100% |
| Reporting Functions | 4 | 4 | 100% |
| **Total** | **35** | **35** | **100%** |

Authentication testing encompassing five scenarios verified login, logout, session management, and access control functions. Order administration testing across eight scenarios confirmed order creation, status updates, prioritization, and listing functions. Payment processing testing with five scenarios validated payment recording, partial payment handling, and payment status tracking. Inventory management testing across six scenarios verified stock entry, adjustment, and threshold monitoring functions. DSS capability testing with seven scenarios specifically addressed Health Index calculation accuracy under various operational conditions, alert generation precision at threshold boundaries, and advisory text generation correctness. Reporting function testing with four scenarios confirmed report generation and export capabilities. All 35 scenarios achieved successful outcomes, yielding 100% functional compliance.

Performance measurement during testing revealed average API response times of 245 milliseconds for DSS alert retrieval operations under typical operational loads, with Health Index calculation completing within 180 milliseconds. These response times satisfy usability requirements for real-time dashboard refresh functionality. Preliminary pilot deployment with three retail outlets over a two-week period generated positive informal feedback regarding alert usefulness and dashboard clarity, though formal usability assessment remains as future work.

The Intelligent Decision Support System implementation demonstrates effectiveness across three principal dimensions identified through functional analysis. Regarding decision velocity enhancement, conventional manual inventory assessment requires physical counting procedures introducing delay between information need and availability. The DSS Stock Alert mechanism provides instantaneous visibility with threshold-driven categorization, enabling proactive replenishment determinations before stock exhaustion occurs. This temporal advantage transforms reactive stock management into proactive inventory optimization.

Concerning decision quality advancement, the Health Index delivers holistic operational perspective previously inaccessible through fragmented information sources. Decision-makers can immediately evaluate whether aggregate operations require intervention without examining individual metrics, enabling efficient triage of management attention. The composite metric approach addresses information overload by synthesizing multiple indicators into a comprehensible summary while preserving access to detailed component data when needed. This aligns with the DeLone and McLean model of information systems success, which emphasizes information quality as a key determinant of system effectiveness [17]. Additionally, service quality dimensions identified by Parasuraman and colleagues underscore the importance of responsiveness and reliability in system design [16].

Regarding decision standardization, automated threshold-based alerting eliminates subjective judgment inconsistencies that arise when different personnel apply different criteria to similar situations. All operational personnel receive uniform recommendations derived from objective criteria, ensuring consistent response to similar operational conditions across shifts and personnel changes. These findings correspond with DSS effectiveness research documented by Li and Wang reporting 40% decision-time reduction through automated recommendations [5].

The implemented DSS capabilities and their operational benefits are summarized in Table 3. Each feature addresses specific decision-making challenges identified during the requirements analysis phase, transforming raw operational data into actionable intelligence.

**Table 3.** Decision Support System Features and Operational Benefits

| DSS Feature | Mechanism | Decision Domain | Operational Benefit |
|-------------|-----------|-----------------|---------------------|
| Operational Health Index | Composite metric (0-100) aggregating inventory, payment, and order status | Overall performance assessment | Unified view enabling rapid operational triage |
| Stock Threshold Monitoring | Configurable threshold with severity classification (Advisory/Critical) | Inventory replenishment timing | Proactive stock management preventing stockouts |
| Receivables Aging Analysis | Duration-based categorization with priority sequencing | Payment collection prioritization | Optimized collection resource allocation |
| Automated Recommendations | Context-aware advisory text generation | Response action guidance | Standardized decision support across personnel |

The integration of these features distinguishes SIM4LON from conventional transactional systems. While previous LPG distribution information systems focused primarily on recording and reporting functions [7][8], the present implementation extends functionality by incorporating decision support capabilities that actively guide operational decision-making. This transition from passive data repository to active decision support tool represents a fundamental advancement in system purpose and utility.

Practical implications of the research findings encompass several operational improvements. Inventory replenishment transitions from reactive posture responding to stockouts toward proactive management anticipating needs before shortages occur. Receivables collection can be sequenced by overdue severity classification, directing collection efforts toward accounts presenting greatest risk or value. Operational performance becomes quantifiable through the Health Index, enabling management to set performance targets and monitor trends over time. Centralized dashboard access enables agency management to oversee multiple outlets through a unified interface without requiring physical presence at each location.

Theoretical implications address Decision Support System applicability within small-medium distribution enterprises that have traditionally relied upon manual processes due to resource constraints. The three-pillar framework integrating operational, technological, and managerial dimensions provides a conceptual model for IDSS design in similar contexts. The implementation contributes a reference design for LPG distribution domain literature, establishing precedent for DSS application in this specific industry segment.

Study limitations warrant acknowledgment to contextualize findings appropriately. Validation scope encompassed only black-box testing; unit testing and load testing were not performed, limiting confidence in code quality and performance under heavy usage conditions. Formal usability assessment with end-users was not conducted, leaving user experience and adoption likelihood as areas for future investigation. Threshold configurations including 50 units for inventory warnings and 7 days for payment overdue warnings represent default values that may require customization for specific agent contexts. System operation requires internet connectivity, potentially limiting utility in areas with unreliable network infrastructure.

---

## 4. Conclusion

This investigation developed SIM4LON, an Intelligent Decision Support System for LPG distribution management incorporating multi-tenant database architecture designed to transform transactional data into actionable operational intelligence. The platform integrates three DSS capabilities addressing distinct decision domains: an Operational Health Index synthesizing inventory, payment, and order metrics into a unified performance indicator, Stock Threshold Monitoring providing automated inventory replenishment advisories, and Receivables Aging Analysis enabling prioritized collection efforts based on overdue duration.

Systematic validation encompassing 35 test scenarios including seven DSS-specific cases achieved complete functional compliance, confirming that the implemented system meets design specifications. The IDSS methodology demonstrates that integrating Decision Support System principles with contemporary web technologies provides an effective mechanism for enhancing operational decision-making within distribution contexts traditionally reliant upon manual processes.

The research contributes to both practical application and theoretical understanding. Practically, the implementation provides a reference design for similar distribution management contexts. Theoretically, the three-pillar framework and Health Index approach offer conceptual models applicable beyond the specific LPG domain.

Future research directions include implementing predictive analytics leveraging historical demand patterns to anticipate future needs, developing customizable threshold configuration enabling per-product and per-agent parameterization, conducting formal user experience evaluation with operational personnel to assess adoption factors, and engineering mobile application support for field operation scenarios where desktop access is impractical.

---

## Acknowledgment

The authors acknowledge PT Mitra Surya Natasya and the retail outlet operators in Cianjur Regency who participated in interviews and provided operational insights informing system requirements.

---

## Declarations

**Author contribution:** Luthfi Alfaridz formulated the DSS framework based on operational experience, developed the system implementation, and prepared the manuscript. Siti Sarah supervised research methodology and reviewed the manuscript critically for intellectual content.

**Funding statement:** This research received no external funding.

**Conflict of interest:** The primary author maintains employment at PT Mitra Surya Natasya, the LPG distribution agent serving as the case study location. This engagement provided valuable operational insights essential for requirements identification while appropriate measures ensured research objectivity.

---

## Data and Software Availability

The SIM4LON frontend application is accessible at https://sim4lon.vercel.app with backend API hosted on Railway cloud platform. Source code is available upon request to the corresponding author for academic purposes.

---

## References

[1] Kementerian ESDM RI, "Statistik Minyak dan Gas Bumi Tahun 2024," Jakarta: Kementerian ESDM, 2024. [Online]. Available: https://www.esdm.go.id

[2] BPH Migas, "Pedoman Distribusi LPG Tabung di Indonesia," Jakarta: BPH Migas, 2023. [Online]. Available: https://www.bphmigas.go.id

[3] R. Sharda, D. Delen, and E. Turban, *Analytics, Data Science, and Artificial Intelligence: Systems for Decision Support*, 11th ed. London: Pearson, 2020.

[4] M. A. Alsalem et al., "A review of artificial intelligence integration in decision support systems for supply chain management: Current state and research directions," *Expert Systems with Applications*, vol. 219, art. no. 119630, Jun. 2023. doi: 10.1016/j.eswa.2023.119630

[5] A. Kefer et al., "Decision support system for supply chain optimization using machine learning and simulation: A systematic literature review," *Computers and Industrial Engineering*, vol. 178, art. no. 109143, Apr. 2023. doi: 10.1016/j.cie.2023.109143

[6] P. Yadav and A. Sharma, "IoT-enabled decision support systems for supply chain optimization: A systematic review," *Internet of Things*, vol. 21, art. no. 100672, Mar. 2023. doi: 10.1016/j.iot.2022.100672

[7] D. Silviana, R. Siregar, and M. Nasution, "Web-based LPG distribution management information system at PT Boy Bagus Windi," *TEKNOKOM: Jurnal Teknologi dan Rekayasa Sistem Komputer*, vol. 6, no. 2, pp. 89-98, 2023. [Online]. Available: https://jurnal.unwir.ac.id/index.php/teknokom

[8] M. F. Adiman, A. Saputra, and R. Hidayat, "Perancangan sistem informasi manajemen distribusi gas elpiji berbasis web pada PT. Bumi Gasindo Raya," *JUSTIFY: Jurnal Sistem Informasi Ibrahimy*, vol. 2, no. 1, pp. 45-58, 2023. [Online]. Available: https://ejournal.ibrahimy.ac.id

[9] M. Ferri, A. Rahman, and S. Utami, "Information system for multi-region LPG 3 Kg realization data processing at PT Indung Tulot Energy Banda Aceh," *Journal Desktop Application (JDA)*, vol. 3, no. 1, pp. 12-24, Jun. 2023.

[10] R. S. Pressman and B. R. Maxim, *Software Engineering: A Practitioner's Approach*, 9th ed. New York: McGraw-Hill Education, 2020.

[11] A. Rauf, S. Parveen, and M. Khan, "Comparative analysis of black box and white box testing techniques: A systematic literature review," *International Journal of Software Engineering and Computer Systems*, vol. 8, no. 2, pp. 112-128, 2022. doi: 10.15282/ijsecs.8.2.2022.7.0101

[12] A. Muhammad, R. Buyya, and K. Amin, "Multi-tenant cloud computing: Taxonomy, challenges, and future directions," *ACM Computing Surveys*, vol. 55, no. 3, art. no. 54, pp. 1-35, Mar. 2023. doi: 10.1145/3544974

[13] S. Wang and M. Holub, "Database partitioning strategies for multi-tenant SaaS applications: A performance evaluation," *Journal of Cloud Computing*, vol. 12, no. 1, art. no. 47, 2023. doi: 10.1186/s13677-023-00421-z

[14] K. Cheng, Z. Liu, and W. Chen, "Intelligent decision support systems in supply chain management: A comprehensive review," *Applied Sciences*, vol. 13, no. 8, art. no. 4892, 2023. doi: 10.3390/app13084892

[15] R. Alotaibi and S. Alshahrani, "Determining the success factors of e-learning platforms using an extended DeLone and McLean model," *PeerJ Computer Science*, vol. 8, art. no. e1113, 2022. doi: 10.7717/peerj-cs.1113

[16] A. Al-Azawei, K. Al-Masoudy, and W. Parslow, "Predicting online learning success: Integration of Information System Success Model and Security Triangle Framework," *Interactive Learning Environments*, vol. 31, no. 4, pp. 2123-2140, 2023. doi: 10.1080/10494820.2021.1872632

[17] M. Wahid et al., "The DeLone and McLean Information Systems Success Model in public sector: A systematic review," *Transforming Government: People, Process and Policy*, vol. 17, no. 2, pp. 234-256, Jun. 2023. doi: 10.1108/TG-01-2023-0008

[18] K. C. Laudon and J. P. Laudon, *Management Information Systems: Managing the Digital Firm*, 17th ed. London: Pearson Education, 2022.

[19] S. Newman, *Building Microservices: Designing Fine-Grained Systems*, 2nd ed. Sebastopol: O'Reilly Media, 2021.

[20] A. Banks and E. Porcello, *Learning React: Modern Patterns for Developing React Apps*, 2nd ed. Sebastopol: O'Reilly Media, 2020.

[21] P. Krishna, M. Sharma, and R. Gupta, "ReactJS: A comprehensive analysis of its features, performance, and suitability for modern web development," *International Journal of Scientific Research in Engineering and Management*, vol. 7, no. 12, pp. 1-15, Dec. 2023. doi: 10.55041/IJSREM27442

[22] K. Mysliwietz, "Web development using ReactJS," in *Proc. 5th Int. Conf. on Advances in Computing, Communication Control and Networking (ICAC3N)*, Greater Noida, India, 2023, pp. 567-572. doi: 10.1109/ICAC3N60023.2023.10519876

[23] J. Liu, S. Chen, and Y. Zhang, "Trust-aware cryptographic role-based access control scheme for secure cloud data storage," *Journal of Information Security and Applications*, vol. 74, art. no. 103461, 2023. doi: 10.1016/j.jisa.2023.103461

[24] M. Saddami, A. Rizki, and F. Pratama, "Rancang bangun sistem informasi stok dan distribusi Liquefied Petroleum Gas (LPG) berbasis web pada Pangkalan Mujitahid," *Jurnal Informatika Teknokrat*, vol. 13, no. 1, pp. 45-58, 2025. [Online]. Available: https://jurnal.teknokrat.ac.id

[25] I. Sommerville, *Software Engineering*, 10th ed. London: Pearson Education, 2016.
