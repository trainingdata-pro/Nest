# Nest

---

## Stack
### 1. Backend 
- Python 3.11
- Django 4
- DRF

### 2. Frontend
- JavaScript
- TypeScript
- React

### 3. Databases
- PostgreSQL

### 4. Task management
- Celery
- Redis (broker) 

### 5. Deployment
- Docker compose

---

## Installation

- Set global environment variables  
```bash
cp ./backend/.env.example ./backend/.env && cp ./backend/config.json.example ./backend/config.json
```
- Start service

#### 1. For local development
```bash
docker compose -f docker-compose.dev.yml up --build
```

#### 2. For production
```bash
docker compose -f docker-compose.prod.yml up -d --build
```