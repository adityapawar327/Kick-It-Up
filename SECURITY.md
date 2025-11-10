# 🔒 Security Guidelines

## ⚠️ Important Security Notes

### Before Deploying to Production

1. **Change JWT Secret**
   - Generate a strong random secret (min 256 bits)
   - Use: `openssl rand -base64 64`
   - Update in `application.properties`

2. **Environment Variables**
   - Never commit `.env` files
   - Use environment variables in production
   - Keep API keys secure

3. **Database Credentials**
   - Use strong passwords
   - Never commit credentials
   - Use environment variables

4. **CORS Configuration**
   - Update `cors.allowed.origins` with your production URL
   - Remove localhost origins in production

5. **API Keys**
   - Keep Google Gemini API key secure
   - Use environment variables
   - Rotate keys regularly

## 🔐 Security Checklist

### Backend Security
- ✅ JWT authentication implemented
- ✅ Password encryption with BCrypt
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (JPA/Hibernate)
- ⚠️ Change JWT secret before production
- ⚠️ Configure proper CORS origins
- ⚠️ Use HTTPS in production

### Frontend Security
- ✅ Secure token storage (localStorage)
- ✅ Protected routes
- ✅ Input sanitization
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for API calls

### Database Security
- ✅ Prepared statements (JPA)
- ✅ Password hashing
- ⚠️ Use strong database passwords
- ⚠️ Restrict database access
- ⚠️ Regular backups

## 🚨 Never Commit

- `.env` files with real credentials
- `application.properties` with production secrets
- API keys
- Database passwords
- JWT secrets
- Private keys or certificates

## 📝 Environment Variables

### Development
Copy `.env.example` to `.env` and fill in your values:
```bash
cp frontend/.env.example frontend/.env
```

### Production
Set environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Railway: Project → Variables
- Heroku: Settings → Config Vars

## 🔄 Rotating Secrets

If you accidentally commit secrets:

1. **Immediately revoke/regenerate** the exposed credentials
2. **Update** all instances with new credentials
3. **Force push** to remove from history (if needed)
4. **Audit** for any unauthorized access

## 📞 Reporting Security Issues

If you discover a security vulnerability:
1. **Do NOT** open a public issue
2. Email the maintainer directly
3. Provide detailed information
4. Allow time for a fix before disclosure

## 🛡️ Best Practices

1. **Keep dependencies updated**
   ```bash
   npm audit fix
   ./gradlew dependencyUpdates
   ```

2. **Use HTTPS everywhere in production**

3. **Implement rate limiting**

4. **Regular security audits**

5. **Monitor logs for suspicious activity**

6. **Use strong passwords** (min 12 characters)

7. **Enable 2FA** where possible

8. **Regular backups**

9. **Principle of least privilege**

10. **Keep secrets out of version control**

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Remember: Security is an ongoing process, not a one-time task!**
