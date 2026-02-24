export const profile = {
  name: "Hui Qing",
  title: "Solution Architect Roadmap",
  tagline: "Engineer → Solution Architect",
  startDate: "February 2026",
  avatar: "/avatar.png",
  portfolio: "https://portfolio.hqinglab.tech/",
  linkedin: "https://linkedin.com/in/huiqing",
  github: "https://github.com/huiqing",
};

export type ChecklistItem = {
  id: string;
  task: string;
  description?: string;
  resource?: string;
  resourceUrl?: string;
};

export type SubSection = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export type Phase = {
  id: string;
  phase: number;
  title: string;
  subtitle: string;
  timeline: string;
  color: string;
  icon: string;
  sections: SubSection[];
};

export type TrackId = "sa" | "mastery";

export type RoadmapTrack = {
  id: TrackId;
  label: string;
  description: string;
  roadmap: Phase[];
};

export const roadmap: Phase[] = [
  // ──────────────────────────────────────────
  // PHASE 1: Foundations
  // ──────────────────────────────────────────
  {
    id: "foundations",
    phase: 1,
    title: "Foundations",
    subtitle: "Solidify the fundamentals that everything else builds on",
    timeline: "Month 1–2",
    color: "emerald",
    icon: "layers",
    sections: [
      {
        id: "networking-basics",
        title: "Networking Fundamentals",
        items: [
          { id: "f-net-1", task: "Understand the OSI 7-layer model — know what each layer does", resource: "Computer Networking: A Top-Down Approach", resourceUrl: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm" },
          { id: "f-net-2", task: "Learn TCP vs UDP — when to use which and why", resource: "ByteByteGo", resourceUrl: "https://bytebytego.com/" },
          { id: "f-net-3", task: "Understand DNS resolution end-to-end (recursive, authoritative, caching)" },
          { id: "f-net-4", task: "Learn HTTP/1.1 vs HTTP/2 vs HTTP/3 — multiplexing, QUIC, status codes, headers" },
          { id: "f-net-5", task: "Understand TLS handshake — certificates, cipher suites, HTTPS flow" },
          { id: "f-net-6", task: "Learn IP addressing, subnets (CIDR notation), and routing basics" },
          { id: "f-net-7", task: "Understand load balancers — L4 vs L7, round robin, least connections, sticky sessions" },
          { id: "f-net-8", task: "Learn about reverse proxies (Nginx, HAProxy) vs forward proxies" },
          { id: "f-net-9", task: "Understand firewalls, security groups, NACLs" },
          { id: "f-net-10", task: "Learn WebSockets and Server-Sent Events — when to use real-time protocols" },
        ],
      },
      {
        id: "linux-os",
        title: "Linux & OS Concepts",
        items: [
          { id: "f-os-1", task: "Be comfortable with Linux CLI — navigation, file ops, permissions, piping" },
          { id: "f-os-2", task: "Understand processes, threads, and concurrency basics" },
          { id: "f-os-3", task: "Learn about memory management — heap, stack, virtual memory" },
          { id: "f-os-4", task: "Understand file systems and disk I/O basics (IOPS, throughput)" },
          { id: "f-os-5", task: "Know how to use ssh, scp, curl, netstat/ss, top/htop, dig, nslookup" },
          { id: "f-os-6", task: "Understand systemd, cron, and basic service management" },
        ],
      },
      {
        id: "programming",
        title: "Programming & Dev Practices",
        items: [
          { id: "f-dev-1", task: "Be proficient in at least one backend language (Python, Java, Go, or Node.js)" },
          { id: "f-dev-2", task: "Understand REST API design — resources, verbs, status codes, versioning, pagination" },
          { id: "f-dev-3", task: "Learn GraphQL basics — queries, mutations, subscriptions, when REST vs GraphQL" },
          { id: "f-dev-4", task: "Know JSON, YAML, Protocol Buffers, and data serialization formats" },
          { id: "f-dev-5", task: "Understand Git workflows — branching, merging, pull requests, rebasing" },
          { id: "f-dev-6", task: "Learn basic data structures — arrays, hash maps, trees, queues, heaps" },
          { id: "f-dev-7", task: "Understand Big-O complexity and basic algorithm analysis" },
          { id: "f-dev-8", task: "Learn 12-Factor App principles", resource: "12factor.net", resourceUrl: "https://12factor.net/" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 2: Cloud
  // ──────────────────────────────────────────
  {
    id: "cloud-fundamentals",
    phase: 2,
    title: "Cloud Platform Mastery",
    subtitle: "Deep dive into AWS (primary) with awareness of Azure/GCP",
    timeline: "Month 2–5",
    color: "blue",
    icon: "cloud",
    sections: [
      {
        id: "aws-core",
        title: "AWS Core Services",
        items: [
          { id: "c-aws-1", task: "Set up an AWS account with proper IAM users, MFA, billing alerts", resource: "AWS Free Tier", resourceUrl: "https://aws.amazon.com/free/" },
          { id: "c-aws-2", task: "Learn EC2 — instance types, AMIs, key pairs, user data, placement groups, auto scaling" },
          { id: "c-aws-3", task: "Learn VPC — subnets (public/private), route tables, IGW, NAT Gateway, VPC peering, Transit Gateway" },
          { id: "c-aws-4", task: "Learn S3 — bucket policies, versioning, lifecycle, storage classes, encryption, replication" },
          { id: "c-aws-5", task: "Learn RDS — Multi-AZ, read replicas, Aurora, Aurora Serverless, parameter groups" },
          { id: "c-aws-6", task: "Learn DynamoDB — partition keys, sort keys, GSI, LSI, capacity modes, DAX" },
          { id: "c-aws-7", task: "Learn ElastiCache — Redis vs Memcached, caching strategies, cluster mode" },
          { id: "c-aws-8", task: "Learn Lambda — cold starts, layers, triggers, concurrency, VPC integration, Powertools" },
          { id: "c-aws-9", task: "Learn API Gateway — REST vs HTTP API, throttling, caching, custom authorizers" },
          { id: "c-aws-10", task: "Learn Step Functions — state machines, workflows, error handling, Express vs Standard" },
          { id: "c-aws-11", task: "Learn SQS/SNS/EventBridge — message queues vs pub/sub vs event bus, dead-letter queues" },
          { id: "c-aws-12", task: "Learn CloudFront — distributions, origins, cache behaviors, signed URLs, Lambda@Edge" },
          { id: "c-aws-13", task: "Learn Route 53 — hosted zones, routing policies (weighted, failover, geolocation, latency)" },
          { id: "c-aws-14", task: "Learn ECS/Fargate — task definitions, services, load balancing, service discovery" },
          { id: "c-aws-15", task: "Learn EKS — managed Kubernetes on AWS, Fargate profiles, add-ons" },
          { id: "c-aws-16", task: "Learn IAM in depth — policies, roles, STS, cross-account access, permission boundaries" },
          { id: "c-aws-17", task: "Learn Cognito — user pools, identity pools, hosted UI, social sign-in" },
          { id: "c-aws-18", task: "Learn CloudWatch — metrics, alarms, logs, dashboards, X-Ray integration" },
        ],
      },
      {
        id: "aws-serverless",
        title: "Serverless Architecture",
        items: [
          { id: "c-sl-1", task: "Understand serverless-first design — when serverless, when not", resource: "Serverless Land", resourceUrl: "https://serverlessland.com/" },
          { id: "c-sl-2", task: "Design a serverless REST API — API Gateway + Lambda + DynamoDB" },
          { id: "c-sl-3", task: "Design an event-driven serverless workflow — EventBridge + Step Functions + Lambda" },
          { id: "c-sl-4", task: "Understand serverless cost model — pay-per-invocation, provisioned concurrency trade-off" },
          { id: "c-sl-5", task: "Learn serverless testing strategies — local emulation, integration testing" },
        ],
      },
      {
        id: "aws-wa",
        title: "AWS Well-Architected Framework",
        items: [
          { id: "c-wa-1", task: "Read and understand the Operational Excellence pillar", resource: "AWS Well-Architected", resourceUrl: "https://aws.amazon.com/architecture/well-architected/" },
          { id: "c-wa-2", task: "Read and understand the Security pillar" },
          { id: "c-wa-3", task: "Read and understand the Reliability pillar" },
          { id: "c-wa-4", task: "Read and understand the Performance Efficiency pillar" },
          { id: "c-wa-5", task: "Read and understand the Cost Optimization pillar" },
          { id: "c-wa-6", task: "Read and understand the Sustainability pillar" },
          { id: "c-wa-7", task: "Complete an AWS Well-Architected review on a sample workload" },
        ],
      },
      {
        id: "multi-cloud",
        title: "Multi-Cloud Awareness",
        items: [
          { id: "c-mc-1", task: "Learn Azure equivalents — App Service, AKS, Blob Storage, Cosmos DB, Entra ID" },
          { id: "c-mc-2", task: "Learn GCP equivalents — Compute Engine, GKE, Cloud Storage, BigQuery, Cloud Run" },
          { id: "c-mc-3", task: "Understand when to recommend multi-cloud vs single cloud — real trade-offs" },
          { id: "c-mc-4", task: "Learn the key differences in networking and IAM models across clouds" },
          { id: "c-mc-5", task: "Understand cloud-agnostic tools — Terraform, Kubernetes, Crossplane" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 3: System Design
  // ──────────────────────────────────────────
  {
    id: "system-design",
    phase: 3,
    title: "System Design & Architecture Patterns",
    subtitle: "The core of what a Solution Architect does every day",
    timeline: "Month 3–7",
    color: "violet",
    icon: "boxes",
    sections: [
      {
        id: "design-fundamentals",
        title: "Design Fundamentals",
        items: [
          { id: "sd-f-1", task: "Read 'Designing Data-Intensive Applications' (DDIA) — Chapters 1-4", resource: "DDIA", resourceUrl: "https://dataintensive.net/" },
          { id: "sd-f-2", task: "Read DDIA — Chapters 5-9 (Replication, Partitioning, Transactions, Consistency)" },
          { id: "sd-f-3", task: "Read DDIA — Chapters 10-12 (Batch, Stream, Future of Data Systems)" },
          { id: "sd-f-4", task: "Understand CAP theorem and PACELC — practical implications" },
          { id: "sd-f-5", task: "Learn consistency models — strong, eventual, causal, read-your-writes" },
          { id: "sd-f-6", task: "Understand latency vs throughput trade-offs" },
          { id: "sd-f-7", task: "Learn back-of-the-envelope estimation (QPS, storage, bandwidth, server count)", resource: "System Design Primer", resourceUrl: "https://github.com/donnemartin/system-design-primer" },
          { id: "sd-f-8", task: "Understand horizontal vs vertical scaling — when to choose which" },
        ],
      },
      {
        id: "lld-fundamentals",
        title: "Broad Awareness: Low-Level Design Fundamentals",
        items: [
          { id: "sd-lld-1", task: "Understand what LLD covers in architecture work — component internals, interfaces, and runtime behavior" },
          { id: "sd-lld-2", task: "Learn SOLID principles and when they improve maintainability in real systems" },
          { id: "sd-lld-3", task: "Understand common OO patterns (Singleton, Factory, Strategy, Adapter) and appropriate usage boundaries" },
          { id: "sd-lld-4", task: "Understand UML basics for LLD communication — sequence, class, and state diagrams" },
          { id: "sd-lld-5", task: "Understand API contract design details — validation, error models, versioning, and backward compatibility" },
          { id: "sd-lld-6", task: "Understand persistence boundary design — repository contracts, transaction scopes, and consistency expectations" },
          { id: "sd-lld-7", task: "Understand concurrency and idempotency concerns at component level (retries, duplicate requests, race conditions)" },
          { id: "sd-lld-8", task: "Understand testability in LLD — seams, mocking boundaries, and contract/integration test balance" },
        ],
      },
      {
        id: "ddd",
        title: "Domain-Driven Design (DDD)",
        items: [
          { id: "sd-ddd-1", task: "Learn strategic DDD — bounded contexts, context maps, ubiquitous language", resource: "DDD Reference", resourceUrl: "https://www.domainlanguage.com/ddd/reference/" },
          { id: "sd-ddd-2", task: "Learn tactical DDD — entities, value objects, aggregates, repositories" },
          { id: "sd-ddd-3", task: "Understand how bounded contexts map to microservices boundaries" },
          { id: "sd-ddd-4", task: "Practice event storming to discover domain events and bounded contexts" },
          { id: "sd-ddd-5", task: "Read 'Domain-Driven Design Distilled' by Vaughn Vernon", resource: "Book", resourceUrl: "https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/" },
        ],
      },
      {
        id: "architecture-patterns",
        title: "Broad Awareness: Architecture Patterns",
        items: [
          { id: "sd-p-1", task: "Monolith vs Microservices — trade-offs, migration strategies, modular monolith" },
          { id: "sd-p-2", task: "Event-Driven Architecture — events vs commands, choreography vs orchestration" },
          { id: "sd-p-3", task: "CQRS — when to use it, how to implement, eventual consistency pitfalls" },
          { id: "sd-p-4", task: "Event Sourcing — append-only logs, projection, snapshotting, replay" },
          { id: "sd-p-5", task: "Saga pattern — orchestration vs choreography for distributed transactions" },
          { id: "sd-p-6", task: "API Gateway pattern — routing, rate limiting, auth, aggregation, BFF" },
          { id: "sd-p-7", task: "Strangler Fig pattern — incremental migration from legacy systems" },
          { id: "sd-p-8", task: "Circuit Breaker, Retry with backoff, Bulkhead — resilience patterns" },
          { id: "sd-p-9", task: "Sidecar / Ambassador / Adapter patterns in container orchestration" },
          { id: "sd-p-10", task: "Backend-for-Frontend (BFF) — separate APIs for web, mobile, IoT" },
          { id: "sd-p-11", task: "Data mesh — domain-oriented data ownership, self-serve data platform" },
        ],
      },
      {
        id: "integration-patterns",
        title: "Broad Awareness: Integration Patterns",
        items: [
          { id: "sd-int-1", task: "Sync vs Async communication — request/response vs message-based", resource: "Enterprise Integration Patterns", resourceUrl: "https://www.enterpriseintegrationpatterns.com/" },
          { id: "sd-int-2", task: "Message brokers — Kafka vs RabbitMQ vs SQS, when to use which" },
          { id: "sd-int-3", task: "Webhook patterns — delivery guarantees, retry, idempotency" },
          { id: "sd-int-4", task: "gRPC — protobuf, streaming, when to use over REST" },
          { id: "sd-int-5", task: "API versioning strategies — URI, header, query param" },
          { id: "sd-int-6", task: "Idempotency in distributed systems — idempotency keys, exactly-once semantics" },
          { id: "sd-int-7", task: "Anti-corruption layer — protecting your domain from external systems" },
        ],
      },
      {
        id: "design-practice",
        title: "System Design Practice",
        items: [
          { id: "sd-pr-1", task: "Design a URL shortener (e.g., bit.ly)", resource: "ByteByteGo", resourceUrl: "https://bytebytego.com/" },
          { id: "sd-pr-2", task: "Design a rate limiter (token bucket, sliding window)" },
          { id: "sd-pr-3", task: "Design a chat system (e.g., WhatsApp/Slack)" },
          { id: "sd-pr-4", task: "Design a news feed / timeline (e.g., Twitter)" },
          { id: "sd-pr-5", task: "Design a notification system (push, email, SMS, in-app)" },
          { id: "sd-pr-6", task: "Design a file storage system (e.g., Google Drive/Dropbox)" },
          { id: "sd-pr-7", task: "Design a payment system (PCI compliance, idempotency, reconciliation)" },
          { id: "sd-pr-8", task: "Design a video streaming platform (e.g., YouTube — upload, transcode, serve)" },
          { id: "sd-pr-9", task: "Design a search autocomplete / typeahead system" },
          { id: "sd-pr-10", task: "Design a distributed cache (consistent hashing, replication)" },
          { id: "sd-pr-11", task: "Design an e-commerce platform end-to-end (catalog, cart, checkout, inventory)" },
          { id: "sd-pr-12", task: "Design a ride-sharing service (e.g., Grab/Uber — matching, ETA, surge)" },
          { id: "sd-pr-13", task: "Design a real-time collaborative editor (e.g., Google Docs — OT/CRDT)" },
          { id: "sd-pr-14", task: "Design a recommendation engine (collaborative filtering, content-based)" },
          { id: "sd-pr-15", task: "Design a web crawler (politeness, dedup, distributed scheduling)" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 4: Data & Storage
  // ──────────────────────────────────────────
  {
    id: "data-storage",
    phase: 4,
    title: "Data & Storage Architecture",
    subtitle: "Choose the right database and data strategy for every use case",
    timeline: "Month 5–7",
    color: "amber",
    icon: "database",
    sections: [
      {
        id: "relational",
        title: "Broad Awareness: Relational Databases",
        items: [
          { id: "d-r-1", task: "Master SQL — joins, subqueries, window functions, CTEs" },
          { id: "d-r-2", task: "Understand indexing strategies — B-tree, hash, composite, covering, partial" },
          { id: "d-r-3", task: "Learn query optimization — EXPLAIN plans, slow query analysis" },
          { id: "d-r-4", task: "Understand ACID properties and transaction isolation levels (read committed, serializable)" },
          { id: "d-r-5", task: "Learn replication strategies — sync, async, semi-sync, logical vs physical" },
          { id: "d-r-6", task: "Understand sharding approaches — hash-based, range-based, directory-based" },
          { id: "d-r-7", task: "Know when to use PostgreSQL vs MySQL vs Aurora" },
        ],
      },
      {
        id: "nosql",
        title: "NoSQL & Specialized Databases",
        items: [
          { id: "d-n-1", task: "Document stores (MongoDB, DocumentDB) — schema design, denormalization trade-offs" },
          { id: "d-n-2", task: "Key-value stores (Redis, DynamoDB) — caching patterns, TTL, eviction policies" },
          { id: "d-n-3", task: "Column-family stores (Cassandra) — wide rows, partition design, tunable consistency" },
          { id: "d-n-4", task: "Graph databases (Neo4j, Neptune) — when relationships are the query" },
          { id: "d-n-5", task: "Search engines (Elasticsearch/OpenSearch) — full-text search, inverted index, relevance tuning" },
          { id: "d-n-6", task: "Time-series databases (InfluxDB, TimescaleDB) — metrics, IoT data, downsampling" },
          { id: "d-n-7", task: "Vector databases (Pinecone, pgvector, Weaviate) — embeddings, similarity search, ANN", resource: "Pinecone Learning", resourceUrl: "https://www.pinecone.io/learn/" },
        ],
      },
      {
        id: "data-arch",
        title: "Data Architecture Patterns",
        items: [
          { id: "d-a-1", task: "Learn caching strategies — cache-aside, write-through, write-behind, read-through" },
          { id: "d-a-2", task: "Understand CDN caching and edge computing — invalidation strategies" },
          { id: "d-a-3", task: "Learn ETL vs ELT — batch processing pipelines, tools (Airflow, dbt)" },
          { id: "d-a-4", task: "Understand stream processing — Kafka, Kinesis, consumer groups, partitioning" },
          { id: "d-a-5", task: "Learn data lake vs data warehouse vs data lakehouse (Iceberg, Delta Lake)" },
          { id: "d-a-6", task: "Understand data modeling — star schema, snowflake, data vault 2.0" },
          { id: "d-a-7", task: "Learn about data governance, lineage, data catalog, and data quality" },
          { id: "d-a-8", task: "Understand Change Data Capture (CDC) — Debezium, DynamoDB Streams" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 5: Security & Networking
  // ──────────────────────────────────────────
  {
    id: "security-networking",
    phase: 5,
    title: "Security & Networking",
    subtitle: "Every architecture decision has security implications",
    timeline: "Month 6–8",
    color: "red",
    icon: "shield",
    sections: [
      {
        id: "identity",
        title: "Identity & Access Management",
        items: [
          { id: "s-i-1", task: "Learn OAuth 2.0 flows — authorization code, client credentials, PKCE", resource: "OAuth.net", resourceUrl: "https://oauth.net/2/" },
          { id: "s-i-2", task: "Understand OpenID Connect (OIDC) — ID tokens, userinfo endpoint" },
          { id: "s-i-3", task: "Learn SAML — SSO federation, IdP vs SP, assertion flow" },
          { id: "s-i-4", task: "Understand JWT — structure, signing (RS256/HS256), validation, refresh token rotation" },
          { id: "s-i-5", task: "Learn RBAC vs ABAC vs ReBAC — role, attribute, and relationship-based access control" },
          { id: "s-i-6", task: "Understand API authentication — API keys, OAuth, mutual TLS, API key rotation" },
          { id: "s-i-7", task: "Learn identity federation — cross-org SSO, SCIM provisioning" },
        ],
      },
      {
        id: "network-security",
        title: "Network & Infrastructure Security",
        items: [
          { id: "s-n-1", task: "Design a secure VPC — public/private subnets, bastion hosts, NAT, VPC endpoints" },
          { id: "s-n-2", task: "Understand WAF — OWASP Top 10, SQL injection, XSS, CSRF prevention", resource: "OWASP", resourceUrl: "https://owasp.org/www-project-top-ten/" },
          { id: "s-n-3", task: "Learn TLS/mTLS — certificate management, ACME/Let's Encrypt, certificate pinning" },
          { id: "s-n-4", task: "Understand secrets management — AWS Secrets Manager, HashiCorp Vault, rotation" },
          { id: "s-n-5", task: "Learn encryption — at rest (AES-256), in transit (TLS), envelope encryption, KMS" },
          { id: "s-n-6", task: "Understand Zero Trust Architecture — never trust, always verify, micro-segmentation" },
          { id: "s-n-7", task: "Learn DDoS protection — AWS Shield, CloudFront, rate limiting, geo-blocking" },
        ],
      },
      {
        id: "dr-bc",
        title: "Disaster Recovery & Business Continuity",
        items: [
          { id: "s-dr-1", task: "Understand RPO vs RTO — define recovery targets for different tiers of services" },
          { id: "s-dr-2", task: "Learn DR strategies — backup & restore, pilot light, warm standby, active-active" },
          { id: "s-dr-3", task: "Design a multi-region architecture — data replication, DNS failover, conflict resolution" },
          { id: "s-dr-4", task: "Understand backup strategies — snapshots, cross-region replication, point-in-time recovery" },
          { id: "s-dr-5", task: "Learn chaos engineering basics — Chaos Monkey, fault injection, game days", resource: "Principles of Chaos", resourceUrl: "https://principlesofchaos.org/" },
          { id: "s-dr-6", task: "Create a DR runbook for a sample multi-tier application" },
        ],
      },
      {
        id: "compliance",
        title: "Compliance & Governance",
        items: [
          { id: "s-c-1", task: "Understand GDPR basics — data residency, right to erasure, DPA, DPIA" },
          { id: "s-c-2", task: "Learn SOC 2 — Type I vs Type II, trust service criteria, shared responsibility model" },
          { id: "s-c-3", task: "Understand PCI DSS basics — cardholder data environments, network segmentation" },
          { id: "s-c-4", task: "Learn about audit logging, CloudTrail, compliance monitoring, and AWS Config rules" },
          { id: "s-c-5", task: "Understand data classification — public, internal, confidential, restricted" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 6: DevOps & Infrastructure
  // ──────────────────────────────────────────
  {
    id: "devops-infra",
    phase: 6,
    title: "DevOps & Infrastructure",
    subtitle: "Automate everything, observe everything",
    timeline: "Month 7–9",
    color: "cyan",
    icon: "container",
    sections: [
      {
        id: "containers",
        title: "Containers & Orchestration",
        items: [
          { id: "do-c-1", task: "Write Dockerfiles — multi-stage builds, layer caching, security scanning, slim images" },
          { id: "do-c-2", task: "Understand Docker Compose for local multi-service development" },
          { id: "do-c-3", task: "Learn Kubernetes core — Pods, Deployments, Services, Ingress, ConfigMaps, Secrets", resource: "K8s Docs", resourceUrl: "https://kubernetes.io/docs/tutorials/" },
          { id: "do-c-4", task: "Understand K8s networking — Service mesh (Istio/Linkerd), network policies, DNS" },
          { id: "do-c-5", task: "Learn K8s autoscaling — HPA, VPA, Cluster Autoscaler, KEDA" },
          { id: "do-c-6", task: "Understand managed K8s — EKS, AKS, GKE, when to use Fargate/Cloud Run instead" },
          { id: "do-c-7", task: "Learn Helm — charts, values, templating, chart repos" },
        ],
      },
      {
        id: "cicd",
        title: "CI/CD & Automation",
        items: [
          { id: "do-ci-1", task: "Design a CI pipeline — build, test, lint, security scan, artifact publish" },
          { id: "do-ci-2", task: "Design a CD pipeline — staging, canary, blue-green, rolling deployments" },
          { id: "do-ci-3", task: "Learn GitOps — ArgoCD or Flux, declarative infrastructure, pull-based deployments" },
          { id: "do-ci-4", task: "Understand feature flags — progressive rollouts, A/B testing, kill switches" },
          { id: "do-ci-5", task: "Learn about supply chain security — SAST, DAST, SCA, SBOM, image signing" },
          { id: "do-ci-6", task: "Understand trunk-based development vs GitFlow — trade-offs for CI/CD" },
        ],
      },
      {
        id: "iac",
        title: "Infrastructure as Code",
        items: [
          { id: "do-iac-1", task: "Learn Terraform — providers, resources, modules, state management, plan/apply", resource: "Terraform Docs", resourceUrl: "https://developer.hashicorp.com/terraform/tutorials" },
          { id: "do-iac-2", task: "Build a complete environment with Terraform — VPC, EC2/ECS, RDS, S3, CloudFront" },
          { id: "do-iac-3", task: "Understand CloudFormation / CDK as AWS-native alternatives" },
          { id: "do-iac-4", task: "Learn IaC best practices — remote state, workspaces, drift detection, policy-as-code" },
          { id: "do-iac-5", task: "Understand Terraform modules — reusable components, module registry, versioning" },
        ],
      },
      {
        id: "observability",
        title: "Monitoring & Observability",
        items: [
          { id: "do-o-1", task: "Understand the three pillars — metrics, logs, traces (and how they connect)" },
          { id: "do-o-2", task: "Learn Prometheus + Grafana for metrics and dashboards" },
          { id: "do-o-3", task: "Learn distributed tracing — OpenTelemetry, X-Ray, Jaeger, trace propagation" },
          { id: "do-o-4", task: "Understand centralized logging — ELK/EFK stack, CloudWatch Logs, structured logging" },
          { id: "do-o-5", task: "Learn alerting strategies — SLI/SLO/SLA, error budgets, on-call best practices", resource: "Google SRE Book", resourceUrl: "https://sre.google/sre-book/table-of-contents/" },
          { id: "do-o-6", task: "Design an observability strategy for a microservices application" },
        ],
      },
      {
        id: "performance",
        title: "Performance Engineering",
        items: [
          { id: "do-pe-1", task: "Learn load testing tools — k6, Locust, JMeter, Artillery" },
          { id: "do-pe-2", task: "Understand capacity planning — peak load estimation, headroom, auto-scaling policies" },
          { id: "do-pe-3", task: "Learn performance profiling — flame graphs, APM tools (Datadog, New Relic)" },
          { id: "do-pe-4", task: "Understand database performance — connection pooling, query optimization, read replicas" },
          { id: "do-pe-5", task: "Learn about latency budgets — P50, P95, P99, tail latencies" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 7: Architecture Frameworks & Soft Skills
  // ──────────────────────────────────────────
  {
    id: "architecture-skills",
    phase: 7,
    title: "Architecture Frameworks & Soft Skills",
    subtitle: "The skills that distinguish an architect from a senior engineer",
    timeline: "Month 8–10",
    color: "pink",
    icon: "presentation",
    sections: [
      {
        id: "frameworks",
        title: "Architecture Frameworks & Documentation",
        items: [
          { id: "a-f-1", task: "Learn TOGAF fundamentals — ADM cycle, architecture domains, building blocks", resource: "TOGAF Standard", resourceUrl: "https://www.opengroup.org/togaf" },
          { id: "a-f-2", task: "Learn C4 Model — Context, Container, Component, Code diagrams", resource: "C4 Model", resourceUrl: "https://c4model.com/" },
          { id: "a-f-3", task: "Practice drawing architecture diagrams with draw.io, Excalidraw, or Mermaid" },
          { id: "a-f-4", task: "Learn Architecture Decision Records (ADR) — write 5 sample ADRs", resource: "ADR GitHub", resourceUrl: "https://adr.github.io/" },
          { id: "a-f-5", task: "Understand UML basics — sequence diagrams, class diagrams, deployment diagrams" },
          { id: "a-f-6", task: "Create a complete architecture document for a sample system (HLD + LLD)" },
          { id: "a-f-7", task: "Learn the AWS Architecture Center — reference architectures and best practices", resource: "AWS Architecture", resourceUrl: "https://aws.amazon.com/architecture/" },
        ],
      },
      {
        id: "finops",
        title: "FinOps & Cost Architecture",
        items: [
          { id: "a-fin-1", task: "Understand AWS pricing models — on-demand, reserved, savings plans, spot instances", resource: "AWS Pricing", resourceUrl: "https://aws.amazon.com/pricing/" },
          { id: "a-fin-2", task: "Learn cost allocation — tags, cost explorer, budgets, anomaly detection" },
          { id: "a-fin-3", task: "Practice cost estimation — calculate monthly bill for a 3-tier web app on AWS" },
          { id: "a-fin-4", task: "Understand FinOps principles — inform, optimize, operate", resource: "FinOps Foundation", resourceUrl: "https://www.finops.org/" },
          { id: "a-fin-5", task: "Learn right-sizing — Compute Optimizer, Trusted Advisor, cost-aware architecture" },
          { id: "a-fin-6", task: "Design a cost-optimized architecture — compare serverless vs container vs EC2 TCO" },
        ],
      },
      {
        id: "soft-skills",
        title: "Communication & Leadership",
        items: [
          { id: "a-s-1", task: "Practice explaining technical concepts to non-technical stakeholders (record yourself)" },
          { id: "a-s-2", task: "Learn to write architecture proposals — problem, options, recommendation, risks, costs" },
          { id: "a-s-3", task: "Practice trade-off analysis — create a weighted decision matrix for 3 design choices" },
          { id: "a-s-4", task: "Practice presenting architecture to an audience — get feedback" },
          { id: "a-s-5", task: "Learn to facilitate architecture review meetings — agenda, structure, outcome" },
          { id: "a-s-6", task: "Understand stakeholder mapping — identify who to align with and when" },
          { id: "a-s-7", task: "Read 'Fundamentals of Software Architecture' by Richards & Ford", resource: "Book", resourceUrl: "https://www.oreilly.com/library/view/fundamentals-of-software/9781663728357/" },
          { id: "a-s-8", task: "Read 'Software Architecture: The Hard Parts' by Ford et al.", resource: "Book", resourceUrl: "https://www.oreilly.com/library/view/software-architecture-the/9781492086888/" },
          { id: "a-s-9", task: "Read 'Staff Engineer' by Will Larson — understanding the IC leadership track", resource: "Book", resourceUrl: "https://staffeng.com/book" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 8: Certifications
  // ──────────────────────────────────────────
  {
    id: "certifications",
    phase: 8,
    title: "Certifications",
    subtitle: "Validate your knowledge with industry-recognized credentials",
    timeline: "Ongoing",
    color: "orange",
    icon: "award",
    sections: [
      {
        id: "cert-aws-saa",
        title: "AWS Solutions Architect Associate (SAA-C03)",
        items: [
          { id: "cert-saa-1", task: "Complete a full SAA-C03 course (Cantrill, Stephane Maarek, or Adrian)", resource: "Cantrill SAA", resourceUrl: "https://learn.cantrill.io/" },
          { id: "cert-saa-2", task: "Do all hands-on labs in the course — deploy real infrastructure" },
          { id: "cert-saa-3", task: "Complete Tutorials Dojo practice exams — score 80%+ consistently", resource: "Tutorials Dojo", resourceUrl: "https://tutorialsdojo.com/" },
          { id: "cert-saa-4", task: "Review all wrong answers and fill knowledge gaps with AWS docs" },
          { id: "cert-saa-5", task: "Take the exam — Schedule and pass SAA-C03" },
        ],
      },
      {
        id: "cert-aws-sap",
        title: "AWS Solutions Architect Professional (SAP-C02)",
        items: [
          { id: "cert-sap-1", task: "Complete a full SAP-C02 course (Cantrill or Stephane Maarek)" },
          { id: "cert-sap-2", task: "Study migration strategies — 7 Rs, Migration Hub, DMS, SMS" },
          { id: "cert-sap-3", task: "Study hybrid architectures — Direct Connect, Storage Gateway, Outposts, Transit Gateway" },
          { id: "cert-sap-4", task: "Study multi-account strategies — AWS Organizations, Control Tower, SCPs, landing zones" },
          { id: "cert-sap-5", task: "Study complex networking — VPN, PrivateLink, Global Accelerator, CloudWAN" },
          { id: "cert-sap-6", task: "Complete practice exams — score 75%+ consistently" },
          { id: "cert-sap-7", task: "Take the exam — Schedule and pass SAP-C02" },
        ],
      },
      {
        id: "cert-other",
        title: "Additional Certifications (pick based on career direction)",
        items: [
          { id: "cert-o-1", task: "Azure AZ-305 — Solutions Architect Expert" },
          { id: "cert-o-2", task: "TOGAF 10 Certified / Foundation" },
          { id: "cert-o-3", task: "Certified Kubernetes Administrator (CKA)" },
          { id: "cert-o-4", task: "HashiCorp Terraform Associate" },
          { id: "cert-o-5", task: "AWS Specialty cert (Security, Database, or Networking)" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────
  // PHASE 9: AI/ML + Real World
  // ──────────────────────────────────────────
  {
    id: "real-world",
    phase: 9,
    title: "AI/ML Architecture & Real-World Application",
    subtitle: "Modern architecture demands, plus putting everything together",
    timeline: "Month 10–12+",
    color: "indigo",
    icon: "rocket",
    sections: [
      {
        id: "ai-ml-arch",
        title: "AI/ML Architecture (essential in 2026)",
        items: [
          { id: "ai-1", task: "Understand when to use managed AI (Bedrock, OpenAI API) vs fine-tuned vs self-hosted" },
          { id: "ai-2", task: "Learn RAG architecture — retrieval-augmented generation end-to-end", resource: "AWS RAG Guide", resourceUrl: "https://aws.amazon.com/what-is/retrieval-augmented-generation/" },
          { id: "ai-3", task: "Understand vector databases and embedding pipelines — indexing, ANN search" },
          { id: "ai-4", task: "Learn prompt engineering and LLM integration patterns — chains, agents, guardrails" },
          { id: "ai-5", task: "Understand ML model serving — SageMaker, inference endpoints, batch vs real-time" },
          { id: "ai-6", task: "Learn about AI cost management — token pricing, caching, model selection trade-offs" },
          { id: "ai-7", task: "Understand AI security — prompt injection, data leakage, PII filtering, model access control" },
          { id: "ai-8", task: "Design an AI-powered feature for an existing application (e.g., semantic search, chatbot, summarization)" },
        ],
      },
      {
        id: "migration",
        title: "Migration & Modernization",
        items: [
          { id: "mig-1", task: "Learn the 7 Rs of cloud migration — rehost, replatform, refactor, repurchase, retire, retain, relocate" },
          { id: "mig-2", task: "Understand AWS migration tools — Migration Hub, DMS, SCT, Application Discovery" },
          { id: "mig-3", task: "Learn database migration strategies — homogeneous vs heterogeneous, zero-downtime migration" },
          { id: "mig-4", task: "Understand application modernization patterns — lift-and-shift → containers → serverless" },
          { id: "mig-5", task: "Create a migration plan for a sample legacy monolith to microservices on AWS" },
        ],
      },
      {
        id: "portfolio-projects",
        title: "Portfolio Architecture Projects",
        items: [
          { id: "rw-p-1", task: "Design & document a complete e-commerce platform (C4 diagrams, ADR, cost estimate)" },
          { id: "rw-p-2", task: "Design & document a real-time analytics pipeline (Kafka, Flink, data lake)" },
          { id: "rw-p-3", task: "Design & document a multi-tenant SaaS platform (isolation, billing, feature flags)" },
          { id: "rw-p-4", task: "Design & document an AI-powered application architecture (RAG, vector DB, LLM)" },
          { id: "rw-p-5", task: "Deploy a reference architecture on AWS with Terraform (IaC, CI/CD, monitoring)" },
          { id: "rw-p-6", task: "Write an architecture blog post or detailed case study — publish it" },
        ],
      },
      {
        id: "career",
        title: "Career Preparation",
        items: [
          { id: "rw-c-1", task: "Update resume — highlight architecture decisions, scale, business impact" },
          { id: "rw-c-2", task: "Update LinkedIn — SA-focused headline, architecture projects in experience" },
          { id: "rw-c-3", task: "Practice SA interview questions — whiteboard design sessions with a peer" },
          { id: "rw-c-4", task: "Network with Solution Architects — LinkedIn, AWS community days, meetups" },
          { id: "rw-c-5", task: "Contribute to open-source or write ADRs at your current company" },
          { id: "rw-c-6", task: "Apply for Solution Architect roles or pitch internal architecture projects" },
        ],
      },
    ],
  },
];

export const masteryRoadmap: Phase[] = [
  {
    id: "m-engineering-core",
    phase: 1,
    title: "Engineering Core (Java + Spring)",
    subtitle: "Build a senior-level coding and framework foundation for leading backend teams",
    timeline: "Month 1-2",
    color: "emerald",
    icon: "layers",
    sections: [
      {
        id: "m-java-runtime",
        title: "Java Runtime & Concurrency",
        items: [
          { id: "m1-j-1", task: "Understand JVM memory model (heap, stack, metaspace) and object lifetime with examples" },
          { id: "m1-j-2", task: "Understand how GC strategies (G1/ZGC) are tuned and what trade-offs to evaluate" },
          { id: "m1-j-3", task: "Understand thread-safety techniques for shared state and lock-based vs lock-free trade-offs" },
          { id: "m1-j-4", task: "Understand async workflow design with CompletableFuture and bounded executors" },
          { id: "m1-j-5", task: "Understand how to profile hotspots and identify CPU/memory bottlenecks" },
          { id: "m1-j-6", task: "Understand how to use Java Flight Recorder/VisualVM for performance baselines" },
          { id: "m1-j-7", task: "Understand exception taxonomy and error propagation rules in large Java services" },
        ],
      },
      {
        id: "m-spring-service-design",
        title: "Spring Boot Service Design",
        items: [
          { id: "m1-s-1", task: "Understand bean lifecycle, auto-configuration, profiles, and environment-specific config" },
          { id: "m1-s-2", task: "Understand modular package boundaries (controller/service/domain/repository)" },
          { id: "m1-s-3", task: "Understand consistent API error modeling with global exception handling" },
          { id: "m1-s-4", task: "Understand validation, idempotency keys, and request tracing in critical write APIs" },
          { id: "m1-s-5", task: "Understand how ADRs capture framework-level architectural decisions" },
          { id: "m1-s-6", task: "Understand Spring Boot actuator endpoints for readiness/liveness and diagnostics" },
          { id: "m1-s-7", task: "Understand DTO boundaries (for example with MapStruct) to keep API contracts stable" },
        ],
      },
      {
        id: "m-oo-patterns",
        title: "OO Design & Design Patterns",
        items: [
          { id: "m1-p-1", task: "Understand when Singleton is appropriate in Spring and when dependency injection is the better choice" },
          { id: "m1-p-2", task: "Understand Factory/Abstract Factory patterns and where they appear in framework and business code" },
          { id: "m1-p-3", task: "Understand Strategy pattern for replacing if-else heavy business branching" },
          { id: "m1-p-4", task: "Understand Template Method vs composition trade-offs in service design" },
          { id: "m1-p-5", task: "Understand Adapter/Facade patterns for integrating third-party or legacy systems" },
          { id: "m1-p-6", task: "Understand Observer/Pub-Sub usage in event-driven Java applications" },
          { id: "m1-p-7", task: "Understand Builder pattern for creating complex immutable domain objects safely" },
          { id: "m1-p-8", task: "Understand common pattern misuses (over-engineering, God factory, hidden coupling) and how to avoid them" },
        ],
      },
      {
        id: "m-lld-java-spring",
        title: "Deep Implementation Understanding: LLD in Java/Spring",
        items: [
          { id: "m1-lld-1", task: "Understand how to translate HLD components into Java packages, classes, and interfaces with clean boundaries" },
          { id: "m1-lld-2", task: "Understand sequence-level request flow design in Spring (controller -> service -> repository -> integration clients)" },
          { id: "m1-lld-3", task: "Understand domain model design choices (entities, value objects, aggregates) and invariants enforcement" },
          { id: "m1-lld-4", task: "Understand error and exception flow design across layers, including mapping to stable API error contracts" },
          { id: "m1-lld-5", task: "Understand transactional LLD decisions for write flows (isolation, retries, idempotency, rollback boundaries)" },
          { id: "m1-lld-6", task: "Understand concurrency-safe LLD for high-contention paths (locking, optimistic concurrency, dedup keys)" },
          { id: "m1-lld-7", task: "Understand how to represent implementation detail in lightweight diagrams (class/sequence) for code reviews" },
        ],
      },
      {
        id: "m-engineering-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m1-d-1", task: "Understand what production-ready Spring service quality looks like (metrics, logs, tests)" },
          { id: "m1-d-2", task: "Understand how to read latency/throughput/memory baselines and choose optimization direction" },
          { id: "m1-d-3", task: "Understand common Java/Spring trade-offs and how to explain your technical choices clearly" },
        ],
      },
    ],
  },
  {
    id: "m-data-architecture",
    phase: 2,
    title: "Data Architecture & Persistence",
    subtitle: "Make correct data decisions under scale, consistency, and business constraints",
    timeline: "Month 2-3",
    color: "blue",
    icon: "database",
    sections: [
      {
        id: "m-relational-core",
        title: "Deep Implementation Understanding: Relational Design (PostgreSQL-first, transferable skills)",
        items: [
          { id: "m2-r-1", task: "Understand schema design trade-offs for write-heavy and read-heavy domains" },
          { id: "m2-r-2", task: "Understand how EXPLAIN ANALYZE guides query optimization and index strategy" },
          { id: "m2-r-3", task: "Understand transaction isolation and locking choices to prevent lost updates/deadlocks" },
          { id: "m2-r-4", task: "Understand partitioning and archival strategies for long-lived high-volume tables" },
          { id: "m2-r-5", task: "Understand reliable migration flow with Flyway/Liquibase and rollback planning" },
          { id: "m2-r-6", task: "Understand read/write split and replication lag handling for critical queries" },
          { id: "m2-r-7", task: "Understand backup/restore drill design and recovery verification approach" },
        ],
      },
      {
        id: "m-jpa-boundaries",
        title: "JPA + Transaction Boundaries",
        items: [
          { id: "m2-j-1", task: "Understand how to detect and avoid N+1/over-fetching with query plans" },
          { id: "m2-j-2", task: "Understand optimistic vs pessimistic locking selection by business invariant" },
          { id: "m2-j-3", task: "Understand transaction boundary design aligned to domain consistency rules" },
          { id: "m2-j-4", task: "Understand outbox + publisher flow with retry and observability concerns" },
          { id: "m2-j-5", task: "Understand data access standards that keep team implementations consistent" },
          { id: "m2-j-6", task: "Understand repository/query conventions that reduce performance regressions" },
          { id: "m2-j-7", task: "Understand Testcontainers usage for realistic persistence integration tests in CI" },
        ],
      },
      {
        id: "m-data-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m2-d-1", task: "Understand how to evaluate schema/query improvements using before/after evidence" },
          { id: "m2-d-2", task: "Understand transaction failure cases and how consistency is preserved" },
          { id: "m2-d-3", task: "Understand how to justify database design decisions under scale and correctness needs" },
        ],
      },
    ],
  },
  {
    id: "m-distributed-consistency",
    phase: 3,
    title: "Distributed Consistency & Integration",
    subtitle: "Design for correctness across service boundaries and failure scenarios",
    timeline: "Month 3-4",
    color: "violet",
    icon: "boxes",
    sections: [
      {
        id: "m-consistency-patterns",
        title: "Deep Implementation Understanding: Consistency Patterns",
        items: [
          { id: "m3-c-1", task: "Understand outbox + inbox patterns and replay-safe behavior" },
          { id: "m3-c-2", task: "Understand saga flow design with compensation steps and failure handling" },
          { id: "m3-c-3", task: "Understand idempotency contracts for APIs and consumers under retries" },
          { id: "m3-c-4", task: "Understand reconciliation design for eventual consistency gaps" },
          { id: "m3-c-5", task: "Understand incident runbook structure for partial failures in distributed workflows" },
          { id: "m3-c-6", task: "Understand business keys and dedup policy design to avoid double-processing" },
          { id: "m3-c-7", task: "Understand timeout, retry, and compensation budget modeling for cascading-failure control" },
        ],
      },
      {
        id: "m-sync-async-design",
        title: "Deep Implementation Understanding: Sync/Async Integration Design",
        items: [
          { id: "m3-i-1", task: "Understand sync REST vs async events trade-offs across real product scenarios" },
          { id: "m3-i-2", task: "Understand webhook integration concerns: retries, signatures, and deduplication" },
          { id: "m3-i-3", task: "Understand contract versioning strategies for producer/consumer evolution" },
          { id: "m3-i-4", task: "Understand backpressure and overload control rules between services" },
          { id: "m3-i-5", task: "Understand anti-corruption layer design for legacy/external integrations" },
          { id: "m3-i-6", task: "Understand API timeout/retry/circuit-breaker default strategies by dependency criticality" },
          { id: "m3-i-7", task: "Understand schema governance for event payload evolution across teams" },
        ],
      },
      {
        id: "m-distributed-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m3-d-1", task: "Understand full distributed flow behavior (API -> DB -> event -> consumer) and consistency boundaries" },
          { id: "m3-d-2", task: "Understand retry/duplicate/order failure modes and the recovery patterns used in practice" },
          { id: "m3-d-3", task: "Understand how to reason about correctness under partial failures" },
        ],
      },
    ],
  },
  {
    id: "m-middleware-systems",
    phase: 4,
    title: "Middleware Systems (Capability-first)",
    subtitle: "Use cache, queue, and streaming patterns based on workload needs",
    timeline: "Month 3-4",
    color: "amber",
    icon: "boxes",
    sections: [
      {
        id: "m-cache-realtime",
        title: "Cache & Realtime Data",
        items: [
          { id: "m4-c-1", task: "Understand cache-aside/write-through patterns and when each fits domain access patterns" },
          { id: "m4-c-2", task: "Understand cache stampede/penetration/avalanche prevention strategies" },
          { id: "m4-c-3", task: "Understand safe distributed lock usage and failure/timeout behavior" },
          { id: "m4-c-4", task: "Understand counters, sessions, and rate-limit design with suitable data structures" },
          { id: "m4-c-5", task: "Understand source-of-truth boundaries for cache layers" },
          { id: "m4-c-6", task: "Understand cache invalidation ownership models between application and data teams" },
          { id: "m4-c-7", task: "Understand how cache hit ratio, key design, and TTL affect p95 response time" },
        ],
      },
      {
        id: "m-queue-stream",
        title: "Queue + Streaming Patterns",
        items: [
          { id: "m4-q-1", task: "Understand worker queue patterns with retry/backoff/DLQ and operational visibility" },
          { id: "m4-q-2", task: "Understand event streaming partitioning and ordering strategy for domain events" },
          { id: "m4-q-3", task: "Understand poison-message handling and safe replay workflows" },
          { id: "m4-q-4", task: "Understand consumer idempotency and offset/ack handling policies" },
          { id: "m4-q-5", task: "Understand queue vs stream trade-offs across business scenarios" },
          { id: "m4-q-6", task: "Understand event naming conventions, metadata standards, and tracing correlation IDs" },
          { id: "m4-q-7", task: "Understand reprocessing protocols for historical events and data backfill operations" },
        ],
      },
      {
        id: "m-middleware-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m4-d-1", task: "Understand how cache + queue/stream + persistence work together in async architectures" },
          { id: "m4-d-2", task: "Understand what should be monitored for backlog, failures, and retries in middleware systems" },
          { id: "m4-d-3", task: "Understand how to choose middleware options (including non-Kafka choices) by scenario" },
        ],
      },
    ],
  },
  {
    id: "m-platform-cloud",
    phase: 5,
    title: "Platform & Cloud Runtime",
    subtitle: "Run Java services on cloud platforms with resilient, operable foundations",
    timeline: "Month 4-6",
    color: "red",
    icon: "shield",
    sections: [
      {
        id: "m-runtime-choices",
        title: "Deep Implementation Understanding: Runtime Choices & Platform Design",
        items: [
          { id: "m5-p-1", task: "Understand secure packaging of Java services with multi-stage builds and minimal runtime images" },
          { id: "m5-p-2", task: "Understand runtime options (ECS/EKS/serverless) and workload-based decision criteria" },
          { id: "m5-p-3", task: "Understand health checks, autoscaling, and graceful degradation design" },
          { id: "m5-p-4", task: "Understand secrets/config management ownership and rotation models" },
          { id: "m5-p-5", task: "Understand platform standards for service onboarding (config, monitoring, deployment)" },
          { id: "m5-p-6", task: "Understand golden-path templates for reducing Spring service setup inconsistency" },
          { id: "m5-p-7", task: "Understand service-to-service network security baselines (mTLS, security groups, ingress)" },
          { id: "m5-p-8", task: "Understand Infrastructure as Code foundations for platform teams (Terraform modules, state, drift, policy guardrails)" },
          { id: "m5-p-9", task: "Understand when to use Terraform vs cloud-native IaC tools (for example CDK/CloudFormation) in delivery workflows" },
        ],
      },
      {
        id: "m-observability-reliability",
        title: "Observability & Reliability",
        items: [
          { id: "m5-o-1", task: "Understand metrics/logs/traces instrumentation and telemetry alignment to service objectives" },
          { id: "m5-o-2", task: "Understand SLI/SLO and alerting policy design for critical business flows" },
          { id: "m5-o-3", task: "Understand load testing interpretation for scaling and capacity decisions" },
          { id: "m5-o-4", task: "Understand incident runbook and postmortem process design for team operations" },
          { id: "m5-o-5", task: "Understand failover/recovery patterns and how RTO/RPO are validated" },
          { id: "m5-o-6", task: "Understand logging standards (fields, levels, redaction) for cross-service troubleshooting" },
          { id: "m5-o-7", task: "Understand dashboard layering: executive health view vs deep technical drill-down view" },
        ],
      },
      {
        id: "m-platform-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m5-d-1", task: "Understand cloud runtime essentials: observability, autoscaling, and safe rollback" },
          { id: "m5-d-2", task: "Understand how failure drills reveal availability/MTTR bottlenecks" },
          { id: "m5-d-3", task: "Understand how to compare runtime/platform options and explain the trade-offs" },
        ],
      },
    ],
  },
  {
    id: "m-security-governance",
    phase: 6,
    title: "Security, Compliance & Governance",
    subtitle: "Lead secure architecture decisions and enforce guardrails",
    timeline: "Month 5-7",
    color: "cyan",
    icon: "shield",
    sections: [
      {
        id: "m-identity-access",
        title: "Identity, Access & Application Security",
        items: [
          { id: "m6-s-1", task: "Understand OAuth2/OIDC end-to-end flows with token lifecycle and revocation strategy" },
          { id: "m6-s-2", task: "Understand authorization boundaries (RBAC/ABAC) across APIs and services" },
          { id: "m6-s-3", task: "Understand threat modeling for critical flows and mitigation mapping" },
          { id: "m6-s-4", task: "Understand secure coding and dependency risk policies for Java services" },
          { id: "m6-s-5", task: "Understand incident playbook design for credential/token leakage scenarios" },
          { id: "m6-s-6", task: "Understand API security controls: input constraints, rate limiting, and abuse protection" },
          { id: "m6-s-7", task: "Understand secure secret usage patterns in code (no plaintext, scoped access, rotation hooks)" },
        ],
      },
      {
        id: "m-compliance-governance",
        title: "Compliance & Governance",
        items: [
          { id: "m6-g-1", task: "Understand data classification and protection policy design for product domains" },
          { id: "m6-g-2", task: "Understand how architecture controls map to baseline compliance requirements (SOC2/GDPR-like)" },
          { id: "m6-g-3", task: "Understand audit logging requirements and evidence collection processes" },
          { id: "m6-g-4", task: "Understand secret/key rotation policy and operational ownership models" },
          { id: "m6-g-5", task: "Understand security architecture review flow and remediation tracking" },
          { id: "m6-g-6", task: "Understand third-party dependency approval and patching policy ownership" },
          { id: "m6-g-7", task: "Understand data retention/deletion standards aligned with legal and business needs" },
        ],
      },
      {
        id: "m-security-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m6-d-1", task: "Understand core security baseline for backend services (auth, secrets, auditing, hardening)" },
          { id: "m6-d-2", task: "Understand threat modeling flow from risk identification to mitigation validation" },
          { id: "m6-d-3", task: "Understand how to communicate security risk decisions to technical and non-technical stakeholders" },
        ],
      },
    ],
  },
  {
    id: "m-delivery-sre-finops",
    phase: 7,
    title: "Delivery Engineering, SRE & FinOps",
    subtitle: "Lead release quality, operational excellence, and cost-aware engineering",
    timeline: "Month 6-8",
    color: "pink",
    icon: "cloud",
    sections: [
      {
        id: "m-release-engineering",
        title: "Release Engineering & Quality Gates",
        items: [
          { id: "m7-r-1", task: "Understand CI quality gates (unit/integration/contract/security) and release criteria design" },
          { id: "m7-r-2", task: "Understand canary/blue-green rollout strategies and rollback trigger design" },
          { id: "m7-r-3", task: "Understand test data and environment strategies for reliable pipelines" },
          { id: "m7-r-4", task: "Understand DORA metrics and how teams use them for improvement plans" },
          { id: "m7-r-5", task: "Understand release checklists and incident communication standards" },
          { id: "m7-r-6", task: "Understand branch strategy and release-train cadence options for predictable delivery" },
          { id: "m7-r-7", task: "Understand contract testing ownership models across producer/consumer teams" },
        ],
      },
      {
        id: "m-sre-finops",
        title: "SRE + FinOps Operations",
        items: [
          { id: "m7-s-1", task: "Understand SLO/error-budget policy and escalation process design with on-call rotation" },
          { id: "m7-s-2", task: "Understand cost modeling for core services and cost-per-workload tracking" },
          { id: "m7-s-3", task: "Understand cost anomaly detection and tagging ownership models" },
          { id: "m7-s-4", task: "Understand quarterly capacity planning reviews that combine performance and cost decisions" },
          { id: "m7-s-5", task: "Understand how reliability, delivery velocity, and cost are balanced in architecture decisions" },
          { id: "m7-s-6", task: "Understand toil-reduction backlogs and automation priorities for on-call sustainability" },
          { id: "m7-s-7", task: "Understand service ownership mapping for operational and financial accountability" },
        ],
      },
      {
        id: "m-sre-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m7-d-1", task: "Understand strong release engineering practices and what good pipeline quality looks like" },
          { id: "m7-d-2", task: "Understand how reliability and cost should be tracked together for service decisions" },
          { id: "m7-d-3", task: "Understand effective postmortem practices and how teams close recurring incident gaps" },
        ],
      },
    ],
  },
  {
    id: "m-tech-lead-architecture",
    phase: 8,
    title: "Tech Lead & Architecture Leadership",
    subtitle: "Turn deep technical strength into team-level and org-level impact",
    timeline: "Month 8+",
    color: "pink",
    icon: "award",
    sections: [
      {
        id: "m-architecture-communication",
        title: "Architecture Communication & Decision Leadership",
        items: [
          { id: "m8-a-1", task: "Understand ADR structures for high-impact decisions (alternatives, risks, rollback plans)" },
          { id: "m8-a-2", task: "Understand C4 diagrams and decision-pack expectations for cross-team proposals" },
          { id: "m8-a-3", task: "Understand architecture review facilitation and stakeholder disagreement resolution patterns" },
          { id: "m8-a-4", task: "Understand how to translate technical trade-offs into business impact language" },
          { id: "m8-a-5", task: "Understand mentoring approaches that improve design quality and service ownership" },
          { id: "m8-a-6", task: "Understand how architecture principles align with product priorities" },
          { id: "m8-a-7", task: "Understand decision-log practices that preserve context for future teams" },
        ],
      },
      {
        id: "m-team-delivery-leadership",
        title: "Team Delivery Leadership",
        items: [
          { id: "m8-t-1", task: "Understand engineering standards for API quality, testing, observability, and documentation" },
          { id: "m8-t-2", task: "Understand technical roadmap planning with risk/impact prioritization" },
          { id: "m8-t-3", task: "Understand technical debt program design with measurable reduction targets" },
          { id: "m8-t-4", task: "Understand coaching practices for incident handling and postmortem quality improvement" },
          { id: "m8-t-5", task: "Understand architecture onboarding checklist design for new engineers" },
          { id: "m8-t-6", task: "Understand backend growth-matrix design (junior to senior) with clear expectations" },
          { id: "m8-t-7", task: "Understand design-clinic practices that improve implementation quality before coding starts" },
        ],
      },
      {
        id: "m-tech-lead-deliverable",
        title: "Learning Outcomes",
        items: [
          { id: "m8-d-1", task: "Understand how end-to-end case studies connect technical decisions with business outcomes" },
          { id: "m8-d-2", task: "Understand Tech Lead interview expectations across system design, leadership, and incidents" },
          { id: "m8-d-3", task: "Understand what a practical Tech Lead operating model includes (quality, delivery, ownership)" },
        ],
      },
    ],
  },
];

export const roadmapTracks: Record<TrackId, RoadmapTrack> = {
  sa: {
    id: "sa",
    label: "Solution Architect",
    description: "Broad Awareness track: architecture roadmap across cloud, systems, security, and leadership.",
    roadmap,
  },
  mastery: {
    id: "mastery",
    label: "Java Tech Lead Mastery",
    description: "Deep Implementation Understanding track: detailed learning checklist for Java/Spring tech leads across data, distributed systems, platform, security, and leadership.",
    roadmap: masteryRoadmap,
  },
};

export function getRoadmapByTrack(trackId: TrackId): Phase[] {
  return roadmapTracks[trackId].roadmap;
}

export function getTotalItems(trackId: TrackId = "sa"): number {
  return getRoadmapByTrack(trackId).reduce(
    (total, phase) =>
      total + phase.sections.reduce((s, sec) => s + sec.items.length, 0),
    0
  );
}
