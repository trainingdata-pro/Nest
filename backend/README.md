# API (Python+Django+DRF)

## Pre installation

### 1. Set global environment variables
```bash
cp .env.dev .env
```
### 2. Create virtual local-environment
```bash
python -m venv venv && source venv/bin/activate
```
### 3. Install dependencies
```bash
python pip install -r requirements.txt
```
### 4. Move to the working directory
```bash
cd src/
```
### 5. Make database migrations
```bash
python manage.py migrate
``` 
### 6. Simple start
```bash
python manage.py runserver
```