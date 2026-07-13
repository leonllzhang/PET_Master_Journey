# Docker 部署指南

## 目录结构

部署相关文件：
```
Dockerfile          # 构建镜像（多阶段构建）
docker-compose.yml  # Docker Compose 配置（App + PostgreSQL）
.dockerignore       # 构建时忽略的文件
```

---

## 方式一：全新部署（使用 docker-compose 自带 PostgreSQL）

服务器上首次部署，会同时启动 App 和 PostgreSQL 数据库。

```bash
# 1. 将项目上传到服务器（或用 git clone）

# 2. 构建并启动
docker compose up -d

# 3. 查看日志
docker compose logs -f app

# 4. 访问 http://服务器IP:6001
```

首次启动时，App 会自动执行 `npx prisma db push` 创建数据库表。

---

## 方式二：连接已有的 PostgreSQL（你的服务器场景）

如果服务器上已有 PostgreSQL 容器（`medical_online_exam-db-1`），只部署 App 即可。

### 方案 A：与已有 PostgreSQL 在同一个 Docker 网络

```bash
# 1. 确认两个容器在同一个 Docker 网络
docker network ls

# 2. 修改 docker-compose.yml —— 删除 db 服务，只保留 app 服务：
#    services:
#      app:
#        build: .
#        ports:
#          - "6001:6001"
#        environment:
#          DATABASE_URL: "postgresql://pet_user:pet_pass_2026@medical_online_exam-db-1:5432/pet_master_journey"
#        restart: unless-stopped

# 3. 启动（需要--force-recreate重建容器）
docker compose up -d --force-recreate
```

### 方案 B：通过宿主机 IP 连接

```bash
# 修改 docker-compose.yml 中 app 的环境变量：
#   DATABASE_URL: "postgresql://pet_user:pet_pass_2026@host.docker.internal:5432/pet_master_journey"
#
# 或者在 docker-compose.yml 同目录创建 .env 文件：
#   DATABASE_URL=postgresql://pet_user:pet_pass_2026@81.70.175.41:5432/pet_master_journey
```

---

## 常用命令

```bash
# 构建并启动
docker compose up -d

# 查看日志
docker compose logs -f app

# 停止
docker compose down

# 停止并删除数据卷（⚠️ 会删除数据库数据！）
docker compose down -v

# 重新构建镜像（代码更新后）
docker compose build --no-cache app
docker compose up -d

# 进入容器
docker compose exec app sh

# 手动执行数据库迁移
docker compose exec app npx prisma db push --skip-generate

# 查看容器状态
docker compose ps
```

---

## 更新部署

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建并重启
docker compose build app
docker compose up -d

# 3. 如果需要更新数据库表
docker compose exec app npx prisma db push --skip-generate
```

---

## 数据库备份

```bash
# 备份 PostgreSQL
docker compose exec db pg_dump -U pet_user pet_master_journey > backup_$(date +%Y%m%d).sql

# 恢复备份
cat backup_20240713.sql | docker compose exec -T db psql -U pet_user pet_master_journey
```

---

## 注意事项

1. **端口冲突**：如果服务器上已有服务使用 6001 或 5432 端口，修改 `docker-compose.yml` 中 `ports` 映射
2. **数据持久化**：PostgreSQL 数据存储在 Docker 卷 `pgdata` 中，删除容器不会丢失数据
3. **日志轮转**：建议限制日志大小，在 `/etc/docker/daemon.json` 中配置：
   ```json
   { "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
   ```
4. **安全**：建议修改数据库密码后再部署到生产环境
