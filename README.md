# Partner Integration Platform

A backend application that simulates onboarding external partners to an API platform through connectivity setup, testing, certification, and production readiness.

The project follows a partner through each stage of the onboarding lifecycle and publishes events as key milestones are completed.

I built this project to better understand how partner API onboarding programs are managed, how certification workflows are tracked, and how event-driven patterns can be used to decouple downstream processes such as notifications and reporting.

## Features

- Partner API onboarding
- Connectivity tracking
- Testing management
- Certification management
- Go-live readiness
- Audit history
- Dashboard reporting
- PostgreSQL persistence
- Kafka event publishing and consumption
- Notification processing

## Architecture

Partner API

→ PostgreSQL

→ Kafka Events

→ Kafka Consumer

→ Notifications

## Technology Stack

- Node.js
- Express
- PostgreSQL
- Kafka
- Docker
- KafkaJS

## Getting Started

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
brew services start postgresql
```

Start Kafka:

```bash
docker compose -f docker-compose.kafka.yml up -d
```

Create database:

```bash
createdb partner_integration
```

Create tables:

```bash
psql -d partner_integration -f db/schema.sql

psql -d partner_integration -f db/lifecycle-schema.sql

psql -d partner_integration -f db/event-notification-schema.sql
```

Run the application:

```bash
npm run dev
```

## Sample APIs

Create Partner

```http
POST /partners
```

Update Connectivity

```http
PATCH /partners/{partnerId}/connectivity
```

Update Testing

```http
PATCH /partners/{partnerId}/testing
```

Update Certification

```http
PATCH /partners/{partnerId}/certification
```

Update Go-Live

```http
PATCH /partners/{partnerId}/go-live
```

Partner Lifecycle View

```http
GET /partners/{partnerId}/full
```

Events

```http
GET /events
```

Notifications

```http
GET /notifications
```

## Example Flow

Partner Created

→ Connectivity Completed

→ Testing Passed

→ Certification Completed

→ Go-Live Ready

Lifecycle events are published to Kafka and consumed by downstream services that generate notifications and maintain operational records.

## Known Design Gaps

- Kafka outbox and retry: lifecycle updates currently persist state and attempt to publish Kafka events inline. A production design should use a durable outbox table with retry workers so events can be recovered after broker or network failures.
- Dead-letter queue: consumer failures currently rely on Kafka retry behavior only. A production design should route poison messages to a DLQ with enough metadata for investigation and replay.
- Lifecycle history versus current state: lifecycle stage tables currently append records. The platform should explicitly decide whether these tables are immutable history, current state, or a split model with both history and one authoritative current record per partner and stage.
