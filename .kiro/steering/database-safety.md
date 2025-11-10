---
inclusion: always
---

# Database Safety Rules

## CRITICAL: Never Reinitialize Database

This project uses Hibernate with `spring.jpa.hibernate.ddl-auto=update` to preserve all user data.

### Rules for AI Assistants

1. **NEVER** suggest changing `ddl-auto` to `create`, `create-drop`, or any value other than `update` or `validate`
2. **NEVER** create or suggest batch files that drop/recreate the database
3. **NEVER** suggest running SQL scripts that contain `DROP TABLE`, `TRUNCATE`, or `DELETE FROM users`
4. **NEVER** add `@PostConstruct` or `CommandLineRunner` beans that seed/reset data
5. **NEVER** suggest importing schema.sql or data.sql files

### Safe Operations

✅ Adding new columns/tables (Hibernate handles this)
✅ Updating entity classes (schema updates automatically)
✅ Creating new users through the API
✅ Restarting the application (data persists)

### Current Configuration

```properties
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store?createDatabaseIfNotExist=true
```

This configuration:
- Creates database if it doesn't exist
- Creates tables if they don't exist
- Updates schema when entities change
- **PRESERVES ALL EXISTING DATA**

### If User Reports Data Loss

1. Check if they manually dropped the database
2. Check if they ran any SQL reset scripts
3. Verify `ddl-auto=update` in application.properties
4. Check for any `@PostConstruct` or initialization code
5. Review recent code changes for data deletion logic

### Database Backup Recommendation

Suggest users backup their database periodically:
```bash
mysqldump -u root sneaker_store > backup.sql
```

But NEVER suggest restoring from backup unless explicitly requested.
