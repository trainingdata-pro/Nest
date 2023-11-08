FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install poetry
ENV POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update -y
RUN apt-get upgrade -y

WORKDIR /backend

COPY ./pyproject.toml ./poetry.lock ./

RUN poetry install

COPY ./src ./src
COPY ./db_merge ./db_merge
WORKDIR /backend/src