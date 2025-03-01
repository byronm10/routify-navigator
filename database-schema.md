
# Database Schema for Routify

## Overview
This document outlines the database schema for the Routify application. This is a PostgreSQL schema design 
for a multi-tenant bus fleet management application.

## Tables

### companies
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### users
```sql
CREATE TYPE user_role AS ENUM (
    'ADMIN',           -- System administrator
    'OPERADOR',        -- Operations manager
    'CONDUCTOR',       -- Bus driver
    'PASAJERO',        -- Passenger
    'TECNICO',         -- Maintenance technician
    'JEFE_TALLER',     -- Maintenance supervisor
    'ADMINISTRATIVO',  -- Company administrator
    'AYUDANTE'         -- Driver's helper
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cognito_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    company_id UUID REFERENCES companies(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### vehicles
```sql
CREATE TYPE vehicle_status AS ENUM (
    'ACTIVO',          -- Active and ready for use
    'EN_RUTA',         -- Currently on route
    'MANTENIMIENTO',   -- Under maintenance
    'INACTIVO',        -- Inactive
    'BAJA',            -- Decommissioned
    'AVERIADO'         -- Broken down
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    company_number VARCHAR(50) NOT NULL,
    vin VARCHAR(50) UNIQUE,
    status vehicle_status NOT NULL DEFAULT 'ACTIVO',
    company_id UUID NOT NULL REFERENCES companies(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### routes
```sql
CREATE TYPE route_status AS ENUM (
    'ACTIVA',
    'EN_EJECUCION',
    'COMPLETADA',
    'SUSPENDIDA'
);

CREATE TYPE repetition_period AS ENUM (
    'DIARIO',
    'SEMANAL',
    'MENSUAL'
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    start_point VARCHAR(255) NOT NULL,
    end_point VARCHAR(255) NOT NULL,
    intermediate_stops JSONB,
    departure_time TIMESTAMP NOT NULL,
    estimated_duration INTEGER NOT NULL, -- in minutes
    repetition_frequency INTEGER,
    repetition_period repetition_period,
    status route_status NOT NULL DEFAULT 'ACTIVA',
    company_id UUID NOT NULL REFERENCES companies(id),
    vehicle_id UUID REFERENCES vehicles(id),
    base_price DECIMAL(10, 2) NOT NULL,
    driver_id UUID REFERENCES users(id),
    helper_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### route_executions
```sql
CREATE TABLE route_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    actual_start_time TIMESTAMP NOT NULL,
    actual_end_time TIMESTAMP,
    actual_duration INTEGER, -- in minutes
    incidents JSONB,
    status route_status NOT NULL DEFAULT 'EN_EJECUCION',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### maintenance
```sql
CREATE TYPE maintenance_type AS ENUM (
    'PREVENTIVO',
    'CORRECTIVO',
    'REVISION'
);

CREATE TYPE maintenance_status AS ENUM (
    'PROGRAMADO',
    'EN_PROGRESO',
    'COMPLETADO',
    'CANCELADO'
);

CREATE TABLE maintenances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    maintenance_type maintenance_type NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    technician_id UUID REFERENCES users(id),
    status maintenance_status NOT NULL DEFAULT 'PROGRAMADO',
    cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### incidents
```sql
CREATE TYPE incident_severity AS ENUM (
    'BAJA',
    'MEDIA',
    'ALTA',
    'CRITICA'
);

CREATE TYPE incident_status AS ENUM (
    'REPORTADO',
    'EN_REVISION',
    'RESUELTO',
    'CERRADO'
);

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_execution_id UUID REFERENCES route_executions(id),
    vehicle_id UUID REFERENCES vehicles(id),
    reported_by UUID NOT NULL REFERENCES users(id),
    description TEXT NOT NULL,
    location VARCHAR(255),
    severity incident_severity NOT NULL,
    status incident_status NOT NULL DEFAULT 'REPORTADO',
    reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Multi-tenancy Design
- Every table that belongs to a tenant has a `company_id` foreign key reference.
- All queries are filtered by `company_id` to ensure data isolation between tenants.
- Global admins have access to all tenants' data.

## Authentication & Authorization
- AWS Cognito is used for authentication.
- Users are organized into Cognito Groups corresponding to their roles.
- Company admins are in their own company's Cognito Group.
- Role-based access control enforces appropriate permissions.
