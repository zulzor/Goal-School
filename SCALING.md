# Масштабирование приложения

## Горизонтальное масштабирование

### Load Balancing

Для распределения нагрузки между несколькими инстансами приложения используется load balancer:

#### Nginx

```nginx
upstream goalschool_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://goalschool_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### HAProxy

```haproxy
frontend goalschool_frontend
    bind *:80
    default_backend goalschool_backend

backend goalschool_backend
    balance roundrobin
    server app1 app1:3000 check
    server app2 app2:3000 check
    server app3 app3:3000 check
```

### Session Management

Для поддержки нескольких инстансов приложения сессии должны быть внешними:

#### Redis для сессий

```javascript
// src/config/session.js
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

module.exports = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
```

## Вертикальное масштабирование

### Оптимизация базы данных

#### Индексация

```sql
-- Индексы для ускорения запросов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_progress_user_skill ON progress(user_id, skill);
```

#### Параметры PostgreSQL

```conf
# postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Кэширование

#### Уровень приложения

```javascript
// src/services/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 минут

const getCachedData = async (key, fetchFunction) => {
  let data = cache.get(key);
  if (!data) {
    data = await fetchFunction();
    cache.set(key, data);
  }
  return data;
};
```

#### Уровень базы данных

Использование материализованных представлений для сложных запросов:

```sql
CREATE MATERIALIZED VIEW user_progress_summary AS
SELECT
    user_id,
    AVG(level) as avg_level,
    COUNT(*) as total_skills
FROM progress
GROUP BY user_id;

CREATE INDEX idx_user_progress_summary_user_id ON user_progress_summary(user_id);
```

## Масштабирование базы данных

### Репликация

#### Master-Slave репликация

```conf
# master postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

# slave recovery.conf
standby_mode = 'on'
primary_conninfo = 'host=master port=5432 user=replicator password=password'
```

#### Подключение к репликам

```javascript
// src/config/db.js
const { Pool } = require('pg');

const masterPool = new Pool({
  connectionString: process.env.MASTER_DATABASE_URL,
});

const slavePool = new Pool({
  connectionString: process.env.SLAVE_DATABASE_URL,
});

// Использование slave для чтения
const queryRead = (text, params) => slavePool.query(text, params);

// Использование master для записи
const queryWrite = (text, params) => masterPool.query(text, params);
```

### Шардинг

Для очень больших объемов данных можно использовать шардинг:

```javascript
// src/services/sharding.js
const getShard = userId => {
  const shardCount = parseInt(process.env.SHARD_COUNT || '4');
  return userId % shardCount;
};

const getDatabaseConnection = userId => {
  const shard = getShard(userId);
  return new Pool({
    connectionString: process.env[`SHARD_${shard}_DATABASE_URL`],
  });
};
```

## Масштабирование приложения

### Cluster Mode

Использование кластера Node.js для использования нескольких ядер CPU:

```javascript
// cluster.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Запуск приложения
  require('./server.js');
}
```

### Microservices

Для очень больших приложений можно разделить на микросервисы:

#### User Service

- Управление пользователями
- Аутентификация
- Авторизация

#### Attendance Service

- Управление посещаемостью
- Статистика посещаемости

#### Progress Service

- Управление прогрессом учеников
- Навыки и достижения

#### Communication Service

- Уведомления
- Сообщения

## CDN

### Статические файлы

Использование CDN для статических файлов:

- Изображения
- CSS и JavaScript файлы
- Шрифты

### Конфигурация

```javascript
// next.config.js (для Next.js)
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
  // ...
};
```

## Monitoring и Auto-scaling

### Kubernetes

Для автоматического масштабирования можно использовать Kubernetes:

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: goalschool-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: goalschool-app
  template:
    metadata:
      labels:
        app: goalschool-app
    spec:
      containers:
        - name: goalschool-app
          image: goalschool/app:latest
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
```

#### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: goalschool-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: goalschool-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Производительность

### Оптимизация запросов

#### Пагинация

```javascript
// src/services/PaginationService.js
const getPaginatedResults = async (query, page, limit) => {
  const offset = (page - 1) * limit;
  const results = await db.query(`${query} LIMIT $1 OFFSET $2`, [limit, offset]);
  const count = await db.query(`SELECT COUNT(*) FROM (${query}) as count_table`);

  return {
    data: results.rows,
    pagination: {
      page,
      limit,
      total: parseInt(count.rows[0].count),
      pages: Math.ceil(parseInt(count.rows[0].count) / limit),
    },
  };
};
```

#### Batch Processing

```javascript
// src/services/BatchService.js
const processBatch = async (items, batchSize, processor) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(processor));
  }
};
```

## Рекомендации

### Начальный этап

1. Оптимизация базы данных (индексы, параметры)
2. Кэширование часто запрашиваемых данных
3. Использование одного сервера с вертикальным масштабированием

### Средний трафик

1. Горизонтальное масштабирование приложения
2. Master-Slave репликация базы данных
3. Использование Redis для сессий и кэширования

### Высокий трафик

1. Микросервисная архитектура
2. Шардинг базы данных
3. Использование Kubernetes для оркестрации
4. Auto-scaling на основе метрик

### Очень высокий трафик

1. Глобальное распределение (GeoDNS, CDN)
2. Multi-region deployment
3. Advanced caching strategies (Varnish, Redis Cluster)
4. Specialized databases for specific use cases

## Метрики для мониторинга масштабирования

### Application Metrics

- Response time
- Throughput (requests per second)
- Error rate
- CPU and memory usage
- Garbage collection statistics

### Database Metrics

- Query response time
- Number of active connections
- Cache hit ratio
- Disk I/O
- Lock contention

### Infrastructure Metrics

- Network latency
- Bandwidth usage
- Disk space
- Load balancer metrics

## Best Practices

1. **Start small** - начинайте с простых решений и масштабируйте по мере необходимости
2. **Measure first** - измеряйте производительность до и после изменений
3. **Plan for failure** - проектируйте систему с учетом возможных сбоев
4. **Automate scaling** - используйте автоматическое масштабирование когда это возможно
5. **Monitor continuously** - постоянно мониторьте метрики и производительность
6. **Test at scale** - тестируйте приложение при нагрузке, близкой к production
