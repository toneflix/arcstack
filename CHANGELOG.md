# CHANGELOG

## [0.1.1] - 2026-02-20

- Refactored the validator utility to improve type safety and error handling.
- Changed database import path from '@core/DB' to '@core/database'.
- Introduced Prisma with PostgreSQL adapter for database connection.
- Updated middleware configuration for H3 and Express to include CORS and method override.
- Added new router implementation for Express and H3 using 'clear-router'.
- Created new controller API resource stub for handling CRUD operations with resora.
- Removed deprecated passport-related files and dependencies.
- Added changelog to document recent changes.

## [0.1.0] - 2026-02-19

- Updated controller model stubs to use the new Resource class from 'resora' for handling JSON responses.
- Removed deprecated resource collection and resource stubs.
- Changed database import path from '@core/DB' to '@core/database'.
- Deleted passport-related files and dependencies as they are no longer needed.
- Updated middleware configuration for H3 and Express to include CORS and method override.
- Introduced a new router implementation for Express and H3 using 'clear-router'.
- Added new types for middleware configuration to enhance type safety.
- Created new database connection setup using Prisma with PostgreSQL adapter.
- Added new controller API resource stub for handling CRUD operations with resora.
