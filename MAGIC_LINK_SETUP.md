# Magic Link Authentication Setup

Trayyy now supports magic link authentication, allowing users to sign in with just their email address.

## Setup Instructions

### 1. Email Server Configuration

Add these environment variables to your `.env.local` file:

```bash
# Email Server for Magic Links
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@trayyy.com
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_SERVER_PASSWORD`

### 3. Alternative Email Providers

You can use other SMTP providers by changing the configuration:

#### Outlook/Hotmail:
```bash
EMAIL_SERVER_HOST=smtp-mail.outlook.com
EMAIL_SERVER_PORT=587
```

#### SendGrid:
```bash
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
```

#### Custom SMTP:
```bash
EMAIL_SERVER_HOST=your-smtp-server.com
EMAIL_SERVER_PORT=587
```

### 4. Testing

1. Start your development server: `npm run dev`
2. Go to `/auth/signin`
3. Enter your email address
4. Click "Send magic link"
5. Check your email for the sign-in link
6. Click the link to sign in

### 5. Security Notes

- Magic links expire after a short time
- Each link can only be used once
- Users must have access to the email address
- Consider rate limiting for production use

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check your email server configuration
2. **No email received**: Check spam folder and email server settings
3. **Connection timeout**: Verify SMTP server and port settings
4. **Authentication failed**: Ensure app password is correct (for Gmail)

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
NEXTAUTH_DEBUG=true
```

This will show detailed authentication logs in your console.
