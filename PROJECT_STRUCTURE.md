.
├── analytics-services
│   ├── ai-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── requirements.txt
│   │   └── tests
│   ├── analytics-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── ml-pipeline-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── requirements.txt
│   │   └── tests
│   └── user-analytics-service
│       ├── app
│       ├── artifacts
│       ├── Dockerfile
│       ├── logs
│       ├── requirements.txt
│       ├── uploads
│       └── workspace
├── BUILD_GUIDE.md
├── cleanup-localStorage.js
├── clear-localStorage.js
├── config
│   └── environment.md
├── content-services
│   ├── content-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── uploads
│   ├── media-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── uploads
│   └── metadata-service
│       ├── app
│       ├── Dockerfile
│       └── requirements.txt
├── core-services
│   ├── api-gateway
│   │   ├── api-gateway
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── main.go
│   │   ├── middleware.go
│   │   └── proxy.go
│   ├── auth-service
│   │   ├── auth-service
│   │   ├── database.go
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── handlers.go
│   │   ├── main.go
│   │   ├── middleware.go
│   │   └── models.go
│   └── user-service
│       ├── Dockerfile
│       ├── logs
│       ├── pom.xml
│       ├── src
│       └── target
├── data
│   ├── elasticsearch
│   ├── mongodb
│   ├── postgres
│   ├── redis
│   └── timescaledb
├── deployments
│   └── k8s
│       ├── configmaps
│       ├── deployments
│       ├── ingress
│       ├── namespace.yaml
│       ├── secrets
│       └── services
├── devops
│   ├── kubernetes
│   │   ├── configmaps
│   │   ├── deployments
│   │   ├── deploy.sh
│   │   ├── ingress
│   │   ├── namespace.yml
│   │   ├── secrets
│   │   └── services
│   ├── monitoring
│   │   ├── grafana-dashboards
│   │   └── prometheus.yml
│   ├── README.md
│   └── terraform
│       ├── iam.tf
│       ├── main.tf
│       └── variables.tf
├── docker-compose
├── docker-compose.yml
├── docker-setup.sh
├── docs
│   ├── DEVELOPMENT_AUTOMATION.md
│   ├── docker-k8s-improvements.md
│   ├── go-naming-conventions.md
│   ├── multi-group-api-guide.md
│   ├── QUICK_START.md
│   ├── README.md
│   ├── redis-architecture.md
│   └── redis-quick-reference.md
├── erp-services
│   ├── crm-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── ecommerce-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── finance-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── hrm-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── hr-service
│   │   └── src
│   ├── integration-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── inventory-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── inventory-service
│   │   ├── pkg
│   │   └── scripts
│   ├── procurement-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   └── report-service
│       └── src
├── GETTING_STARTED.md
├── health-check.sh
├── I3M_PLATFORM_DOCUMENTATION.markdown
├── industry-services
│   ├── agriculture-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   └── healthcare-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── infrastructure-services
│   ├── cost-optimization-service
│   │   ├── cmd
│   │   ├── cost-optimization-service
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   └── pkg
│   ├── load-balancer-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── load-balancer-service
│   │   └── pkg
│   ├── observability-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── secrets-management-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── pkg
│   │   └── secrets-management-service
│   └── security-service
│       ├── cmd
│       ├── Dockerfile
│       ├── go.mod
│       ├── go.sum
│       ├── internal
│       ├── pkg
│       └── security-service
├── integration-services
│   ├── api-documentation-service
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   ├── currency-exchange-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── tests
│   └── integration-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── k8s-improvements
│   ├── networking-improvements.yaml
│   ├── persistent-storage.yaml
│   └── user-service-fixed.yaml
├── LOGIN_INTEGRATION_SUMMARY.md
├── logs
├── Makefile
├── marketplace-services
│   ├── installation-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── installation-service
│   │   └── internal
│   ├── preview-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   └── template-marketplace-service
│       ├── app
│       ├── Dockerfile
│       ├── package.json
│       ├── package-lock.json
│       ├── requirements.txt
│       └── src
├── monitoring
│   ├── grafana
│   └── prometheus
├── PROJECT_STRUCTURE.md
├── README.md
├── scripts
│   ├── build-all-services.sh
│   ├── build-all.sh
│   ├── build-and-deploy.sh
│   ├── build-service.sh
│   ├── build-ui.sh
│   ├── check-and-build-services.sh
│   ├── clean-build.sh
│   ├── deploy-ui.sh
│   ├── dev.sh
│   ├── dev-ui.sh
│   ├── docker-k8s-monitor.sh
│   ├── quick-start.sh
│   ├── rebuild-service.sh
│   ├── restart-system.sh
│   ├── setup-dev-ui.sh
│   ├── start-all-services.sh
│   ├── start-core-services.sh
│   ├── start-dev-ui.sh
│   ├── stop-services.sh
│   └── test-services.sh
├── security-improvements.yaml
├── setup-tenant-and-user.sql
├── setup-user-primary-group-fixed.sql
├── setup-user-primary-group.sql
├── shared
│   ├── mongodb
│   │   └── init
│   ├── monitoring
│   │   ├── grafana
│   │   └── prometheus.yml
│   └── sql
│       ├── init
│       └── migrations
├── shared-services
│   ├── billing-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── notification-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   └── workflow-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── STARTUP_GUIDE.md
├── SYSTEM_STATUS.md
├── terraform
├── test-backend-login.sh
├── test-connectivity.sh
├── test-login-fresh.js
├── test-migration.html
└── ui
    └── master-dashboard
        ├── AUTH_SETUP.md
        ├── Dockerfile
        ├── Dockerfile.dev
        ├── env.example
        ├── index.html
        ├── mock-data
        ├── nginx.conf
        ├── package.json
        ├── package-lock.json
        ├── public
        ├── README.md
        ├── src
        ├── src_backup_before_migration.zip
        ├── tsconfig.node.json
        └── vite.config.ts

166 directories, 174 files
