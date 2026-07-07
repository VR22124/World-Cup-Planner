# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

The World Cup Planner platform incorporates multiple security features to protect user data and ensure operational stability during the event:

- **Rate Limiting:** Protects against DoS and brute force attacks.
- **Helmet Headers:** Hardens the application against XSS and clickjacking.
- **NoSQL Injection Prevention:** Recursively sanitizes request bodies and parameters.
- **CORS Allowlisting:** Prevents unauthorized cross-origin requests.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to security@worldcupplanner.com. All security vulnerabilities will be promptly addressed.
