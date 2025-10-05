# Database Configuration

## DigitalOcean Managed PostgreSQL

### Connection Details
- **Host**: `db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com`
- **Port**: `25060`
- **Database**: `arunz_cricklog_dev`
- **Username**: `arunz_developer`
- **Password**: `[Your Database Password]`

### Connection String Format
```
postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev
```

## Environment Variables

### Production Environment (.env)
```bash
# Database Configuration
DATABASE_URL=postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
API_PORT=4000
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.cricklog.com
```

### Development Environment (.env.local)
```bash
# Database Configuration (Development)
DATABASE_URL=postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev

# Redis Configuration (Local)
REDIS_URL=redis://localhost:6379

# JWT Secret (Development)
JWT_SECRET=dev-jwt-secret-key

# API Configuration
API_PORT=4000
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50), -- batsman, bowler, all-rounder, wicket-keeper
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    format VARCHAR(20) NOT NULL, -- T20, ODI, Test
    venue VARCHAR(255),
    match_date TIMESTAMP NOT NULL,
    team1_id UUID REFERENCES teams(id),
    team2_id UUID REFERENCES teams(id),
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match innings table
CREATE TABLE match_innings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    batting_team_id UUID REFERENCES teams(id),
    innings_number INTEGER NOT NULL,
    total_runs INTEGER DEFAULT 0,
    total_wickets INTEGER DEFAULT 0,
    total_overs DECIMAL(4,1) DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balls table (for detailed scoring)
CREATE TABLE balls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    innings_id UUID REFERENCES match_innings(id),
    over_number INTEGER NOT NULL,
    ball_number INTEGER NOT NULL,
    batsman_id UUID REFERENCES players(id),
    bowler_id UUID REFERENCES players(id),
    runs_scored INTEGER DEFAULT 0,
    is_wicket BOOLEAN DEFAULT FALSE,
    wicket_type VARCHAR(50), -- bowled, caught, lbw, run_out, stumped
    extras_type VARCHAR(50), -- wide, no_ball, byes, leg_byes
    extras_runs INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics table
CREATE TABLE player_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    match_id UUID REFERENCES matches(id),
    runs_scored INTEGER DEFAULT 0,
    balls_faced INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    wickets_taken INTEGER DEFAULT 0,
    overs_bowled DECIMAL(4,1) DEFAULT 0.0,
    runs_conceded INTEGER DEFAULT 0,
    maidens INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Connection Pool Configuration

### Prisma Configuration (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  firstName    String
  lastName     String
  role         String   @default("user")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  teams        Team[]
  matches      Match[]
}

model Team {
  id          String   @id @default(uuid())
  name        String
  description String?
  logoUrl     String?
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  players     Player[]
  matches1    Match[]  @relation("Team1")
  matches2    Match[]  @relation("Team2")
}

model Player {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  email     String?
  phone     String?
  role      String?
  teamId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  team      Team     @relation(fields: [teamId], references: [id])
}

model Match {
  id        String   @id @default(uuid())
  name      String
  format    String
  venue     String?
  matchDate DateTime
  team1Id   String
  team2Id   String
  status    String   @default("scheduled")
  createdBy String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  team1     Team     @relation("Team1", fields: [team1Id], references: [id])
  team2     Team     @relation("Team2", fields: [team2Id], references: [id])
  creator   User     @relation(fields: [createdBy], references: [id])
}
```

## Security Configuration

### SSL Connection
```bash
# Enable SSL for production
DATABASE_URL=postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev?sslmode=require
```

### Connection Pool Settings
```javascript
// Database connection pool configuration
const poolConfig = {
  host: 'db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com',
  port: 25060,
  database: 'arunz_cricklog_dev',
  user: 'arunz_developer',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};
```

## Migration Commands

### Prisma Migrations
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Manual Database Setup
```sql
-- Create database (if not exists)
CREATE DATABASE arunz_cricklog_dev;

-- Create user (if not exists)
CREATE USER arunz_developer WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE arunz_cricklog_dev TO arunz_developer;
```

## Backup and Recovery

### Automated Backups
```bash
# Daily backup script
pg_dump -h db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com \
        -p 25060 \
        -U arunz_developer \
        -d arunz_cricklog_dev \
        -f /opt/cricklog/backups/db_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup
```bash
# Restore database
psql -h db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com \
     -p 25060 \
     -U arunz_developer \
     -d arunz_cricklog_dev \
     -f /opt/cricklog/backups/db_20231201_120000.sql
```

---

## Next Steps
1. **Update your password** in the environment variables
2. **Test database connection** from your application
3. **Run database migrations** to create tables
4. **Set up connection pooling** for production
5. **Configure automated backups**
