--- ./ui/master-dashboard/node_modules/is-mobile/tea.yaml ---
# https://tea.xyz/what-is-this-file
---
version: 1.0.0
codeOwners:
  - '0xE7DEE1B8Bb97C3065850Cf582D6DED57C6009587'
quorum: 1
--- ./security-improvements.yaml ---
# Pod Security Standards
apiVersion: v1
kind: Namespace
metadata:
  name: i3m-platform-secure
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
# Network Policy for i3m-platform
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: i3m-platform-network-policy
  namespace: i3m-platform
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: i3m-platform
    - namespaceSelector:
        matchLabels:
          name: monitoring
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: i3m-platform
    - namespaceSelector:
        matchLabels:
          name: monitoring
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
---
# Resource Quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: i3m-platform-quota
  namespace: i3m-platform
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "10"
    pods: "50"
    services: "20"
---
# Limit Range
apiVersion: v1
kind: LimitRange
metadata:
  name: i3m-platform-limits
  namespace: i3m-platform
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
--- ./k8s-improvements/networking-improvements.yaml ---
# Networking Improvements for I3M Platform
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-nodeport
  namespace: i3m-platform
  labels:
    app: api-gateway
    tier: core
spec:
  type: NodePort
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30000
    protocol: TCP
    name: http
  selector:
    app: api-gateway
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: i3m-platform-ingress
  namespace: i3m-platform
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
spec:
  rules:
  - host: i3m-platform.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 3000
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 3009
---
apiVersion: v1
kind: Service
metadata:
  name: registry-service
  namespace: i3m-platform
spec:
  type: ExternalName
  externalName: host.docker.internal
  ports:
  - port: 5000
    targetPort: 5000
    protocol: TCP
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-registry-access
  namespace: i3m-platform
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 5000
---
apiVersion: v1
kind: Service
metadata:
  name: monitoring-nodeport
  namespace: monitoring
spec:
  type: NodePort
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30001
    protocol: TCP
    name: grafana
  selector:
    app.kubernetes.io/name: grafana
--- ./k8s-improvements/user-service-fixed.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
    tier: core
    version: 1.0.0
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3009"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
      - name: user-service
        image: i3m-platform-user-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3009
          name: http
          protocol: TCP
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres-service:5432/i3m_platform?sslmode=disable"
        - name: SPRING_DATASOURCE_USERNAME
          value: "i3m_user"
        - name: SPRING_DATASOURCE_PASSWORD
          value: "i3m_password"
        - name: SPRING_REDIS_HOST
          value: "redis-service"
        - name: SPRING_REDIS_PORT
          value: "6379"
        - name: DATABASE_URL
          value: "postgresql://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "i3m_platform"
        - name: DB_USER
          value: "i3m_user"
        - name: DB_PASSWORD
          value: "i3m_password"
        - name: DB_SSLMODE
          value: "disable"
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 300
          periodSeconds: 60
          timeoutSeconds: 30
          failureThreshold: 3
          successThreshold: 1
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 300
          periodSeconds: 30
          timeoutSeconds: 30
          failureThreshold: 3
          successThreshold: 1
        startupProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 30
          failureThreshold: 10
          successThreshold: 1
--- ./k8s-improvements/persistent-storage.yaml ---
# Persistent Storage for I3M Platform
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/postgres"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongodb-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/mongodb"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/redis"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
--- ./deployments/k8s/secrets/app-secrets.yaml ---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: i3m-platform
type: Opaque
data:
  # Database Passwords (base64 encoded)
  POSTGRES_PASSWORD: aTNtX3Bhc3N3b3Jk  # i3m_password
  MONGODB_PASSWORD: aTNtX3Bhc3N3b3Jk   # i3m_password
  REDIS_PASSWORD: aTNtX3Bhc3N3b3Jk     # i3m_password
  
  # JWT Secret
  JWT_SECRET: eW91ci1zdXBlci1zZWNyZXQtand0LWtleS1oZXJl  # your-super-secret-jwt-key-here
  
  # Database URLs
  DATABASE_URL: cG9zdGdyZXM6Ly9pM21fdXNlcjppM21fcGFzc3dvcmRAcG9zdGdyZXMtc2VydmljZTo1NDMyL2kzbV9wbGF0Zm9ybT9zc2xtb2RlPWRpc2FibGU=  # postgres://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable
  REDIS_URL: cmVkaXM6Ly86aTNtX3Bhc3N3b3JkQHJlZGlzLXNlcnZpY2U6NjM3OQ==  # redis://:i3m_password@redis-service:6379
  MONGODB_URL: bW9uZ29kYjovL2kzbV91c2VyOmkzbV9wYXNzd29yZEBtb25nb2RiLXNlcnZpY2U6MjcwMTcvaTPtX3BsYXRmb3Jt  # mongodb://i3m_user:i3m_password@mongodb-service:27017/i3m_platform

---
apiVersion: v1
kind: Secret
metadata:
  name: registry-secret
  namespace: i3m-platform
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6eyJyZWdpc3RyeS5jb20iOnsidXNlcm5hbWUiOiJ1c2VyIiwicGFzc3dvcmQiOiJwYXNzIiwiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=  # Replace with actual registry credentials
--- ./deployments/k8s/namespace.yaml ---
apiVersion: v1
kind: Namespace
metadata:
  name: i3m-platform
  labels:
    name: i3m-platform
    environment: production
    version: "1.0.0"
  annotations:
    description: "I3M Platform - Microservices Architecture"
    contact: "devops@i3m.com"
--- ./deployments/k8s/ingress/ui-dashboard-ingress.yaml ---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ui-dashboard-ingress
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
spec:
  ingressClassName: nginx
  rules:
  - host: dashboard.i3m.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-service
            port:
              number: 80
  - host: localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-service
            port:
              number: 80
--- ./deployments/k8s/ingress/ui-dashboard-dev-ingress.yaml ---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ui-dashboard-dev-ingress
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
spec:
  ingressClassName: nginx
  rules:
  - host: dev.i3m.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-dev-service
            port:
              number: 5173
  - host: localhost
    http:
      paths:
      - path: /dev
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-dev-service
            port:
              number: 5173
--- ./deployments/k8s/deployments/ui-dashboard-deployment.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui-dashboard
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ui-dashboard
  template:
    metadata:
      labels:
        app: ui-dashboard
        component: frontend
    spec:
      containers:
      - name: ui-dashboard
        image: i3m-platform/ui-dashboard:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_BASE_URL
          value: "http://api-gateway-service:8080"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
      volumes:
      - name: nginx-config
        configMap:
          name: ui-dashboard-config
--- ./deployments/k8s/deployments/ui-dashboard-dev-deployment.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui-dashboard-dev
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ui-dashboard-dev
  template:
    metadata:
      labels:
        app: ui-dashboard-dev
        component: frontend
        environment: development
    spec:
      containers:
      - name: ui-dashboard-dev
        image: i3m-platform/ui-dashboard-dev:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5173
        env:
        - name: NODE_ENV
          value: "development"
        - name: VITE_API_BASE_URL
          value: "http://api-gateway-service:8080"
        - name: CHOKIDAR_USEPOLLING
          value: "true"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        volumeMounts:
        - name: node-modules
          mountPath: /app/node_modules
      volumes:
      - name: node-modules
        emptyDir: {}
--- ./deployments/k8s/services/ui-dashboard-service.yaml ---
apiVersion: v1
kind: Service
metadata:
  name: ui-dashboard-service
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: ui-dashboard
--- ./deployments/k8s/services/databases.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: i3m-platform
  labels:
    app: postgres
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
        tier: database
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_DB
          value: i3m_platform
        - name: POSTGRES_USER
          value: i3m_user
        - name: POSTGRES_PASSWORD
          value: i3m_password
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: i3m-platform
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
    name: postgres
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: i3m-platform
  labels:
    app: redis
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        tier: database
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
          name: redis
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: i3m-platform
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
    name: redis
--- ./deployments/k8s/services/auth-service.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: i3m-platform
  labels:
    app: auth-service
    tier: core
    version: "1.0.0"
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3008"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: auth-service
        image: i3m-platform-auth-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3008
          name: http
        env:
        - name: PORT
          value: "3008"
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: DATABASE_URL
          value: "postgres://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "i3m_platform"
        - name: DB_USER
          value: "i3m_user"
        - name: DB_PASSWORD
          value: "i3m_password"
        - name: DB_SSLMODE
          value: "disable"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: REDIS_HOST
          value: "redis-service"
        - name: REDIS_PORT
          value: "6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3008
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3008
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: i3m-platform
  labels:
    app: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - port: 3008
    targetPort: 3008
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 2
  maxReplicas: 6
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/services/ui-dashboard-dev-service.yaml ---
apiVersion: v1
kind: Service
metadata:
  name: ui-dashboard-dev-service
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
spec:
  type: ClusterIP
  ports:
  - port: 5173
    targetPort: 5173
    protocol: TCP
    name: dev-server
  selector:
    app: ui-dashboard-dev
--- ./deployments/k8s/services/api-gateway.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: i3m-platform
  labels:
    app: api-gateway
    tier: gateway
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
        tier: gateway
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3004"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: api-gateway
        image: i3m-platform-api-gateway:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3004
          name: http
        env:
        - name: PORT
          value: "3004"
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        - name: AUTH_SERVICE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: AUTH_SERVICE_URL
        - name: USER_SERVICE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: USER_SERVICE_URL
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3004
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3004
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: i3m-platform
  labels:
    app: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
  - port: 3004
    targetPort: 3004
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  namespace: i3m-platform
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  tls:
  - hosts:
    - api.i3m.com
    secretName: api-gateway-tls
  rules:
  - host: api.i3m.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 3004

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/services/user-service.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
    tier: core
    version: "1.0.0"
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3009"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
      - name: user-service
        image: i3m-platform-user-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3009
          name: http
        env:
        - name: SERVER_PORT
          value: "3009"
        - name: SPRING_PROFILES_ACTIVE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres-service:5432/i3m_platform?sslmode=disable"
        - name: SPRING_DATASOURCE_USERNAME
          value: "i3m_user"
        - name: SPRING_DATASOURCE_PASSWORD
          value: "i3m_password"
        - name: SPRING_REDIS_HOST
          value: "redis-service"
        - name: SPRING_REDIS_PORT
          value: "6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "300m"
          limits:
            memory: "1Gi"
            cpu: "1500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 3009
    targetPort: 3009
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/configmaps/ui-dashboard-config.yaml ---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ui-dashboard-config
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
data:
  nginx.conf: |
    events {
        worker_connections 1024;
    }

    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        # Logging
        log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log /var/log/nginx/access.log main;
        error_log /var/log/nginx/error.log;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/json
            application/javascript
            application/xml+rss
            application/atom+xml
            image/svg+xml;

        server {
            listen 80;
            server_name localhost;
            root /usr/share/nginx/html;
            index index.html;

            # Security headers
            add_header X-Frame-Options "SAMEORIGIN" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header X-XSS-Protection "1; mode=block" always;
            add_header Referrer-Policy "no-referrer-when-downgrade" always;

            # Handle client-side routing
            location / {
                try_files $uri $uri/ /index.html;
            }

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }

            # API proxy
            location /api/ {
                proxy_pass http://api-gateway-service:8080/;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Health check
            location /health {
                access_log off;
                return 200 "healthy\n";
                add_header Content-Type text/plain;
            }
        }
    }
--- ./deployments/k8s/configmaps/app-config.yaml ---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: i3m-platform
data:
  # Database Configuration
  POSTGRES_HOST: "postgres-service"
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "i3m_platform"
  MONGODB_HOST: "mongodb-service"
  MONGODB_PORT: "27017"
  MONGODB_DB: "i3m_platform"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  TIMESCALEDB_HOST: "timescaledb-service"
  TIMESCALEDB_PORT: "5432"
  ELASTICSEARCH_HOST: "elasticsearch-service"
  ELASTICSEARCH_PORT: "9200"
  
  # Kafka Configuration
  KAFKA_BROKERS: "kafka-service:9092"
  KAFKA_ZOOKEEPER: "zookeeper-service:2181"
  
  # Service URLs
  API_GATEWAY_URL: "http://api-gateway-service:3004"
  AUTH_SERVICE_URL: "http://auth-service:3008"
  USER_SERVICE_URL: "http://user-service:3009"
  
  # Application Configuration
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  
  # CORS Configuration
  CORS_ALLOWED_ORIGINS: "https://app.i3m.com,https://admin.i3m.com"
  
  # Rate Limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: "100"
  
  # Cache Configuration
  CACHE_TTL: "600"
  
  # Monitoring
  PROMETHEUS_ENABLED: "true"
  METRICS_ENABLED: "true"

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: i3m-platform
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
            namespaces:
              names:
                - i3m-platform
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: i3m-platform
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-service:9090
        access: proxy
        isDefault: true
      - name: PostgreSQL
        type: postgres
        url: postgres-service:5432
        database: i3m_platform
        user: i3m_user
        secureJsonData:
          password: i3m_password
      - name: Elasticsearch
        type: elasticsearch
        url: http://elasticsearch-service:9200
        access: proxy
        database: "[logstash-]YYYY.MM.DD"
