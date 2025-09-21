# Vercel Deployment Guide for BDS PRO

## 🚀 **Deployment Steps**

### 1. **Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `teambdspro/BDSPRO`
5. Click "Deploy"

### 2. **Environment Variables Setup**
In Vercel dashboard, go to your project → Settings → Environment Variables and add:

#### **Database Configuration:**
```
MYSQL_HOST = your_mysql_host
MYSQL_PORT = your_mysql_port
MYSQL_USER = your_mysql_user
MYSQL_PASSWORD = your_mysql_password
MYSQL_DATABASE = your_mysql_database
```

#### **JWT Configuration:**
```
JWT_SECRET = your_production_jwt_secret_key_here
```

#### **Email Configuration:**
```
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_app_password
EMAIL_FROM = Your App <noreply@yourapp.com>
```

#### **Application Configuration:**
```
NEXT_PUBLIC_BASE_URL = https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_URL = https://your-vercel-domain.vercel.app
```

#### **Google OAuth Configuration:**
```
GOOGLE_CLIENT_ID = your_google_client_id_here
GOOGLE_CLIENT_SECRET = your_google_client_secret_here
```

#### **NextAuth Configuration:**
```
NEXTAUTH_URL = https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET = your_production_nextauth_secret_key_here
```

### 3. **Google Cloud Console Setup for Production**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
5. Save changes

### 4. **Deploy**
1. After adding all environment variables, click "Deploy"
2. Vercel will automatically build and deploy your app
3. Your app will be available at: `https://your-vercel-domain.vercel.app`

## 🔧 **Post-Deployment Verification**

### **Test Google Sign-in:**
1. Go to your Vercel URL
2. Navigate to `/login`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify you're redirected to dashboard

### **Test Database Connection:**
1. Sign up with a new account
2. Check if user is created in database
3. Test deposit/withdrawal functionality

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Google OAuth not working:**
   - Verify redirect URI in Google Cloud Console
   - Check `NEXTAUTH_URL` environment variable
   - Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

2. **Database connection issues:**
   - Verify all MySQL environment variables
   - Check if database is accessible from Vercel

3. **NextAuth session issues:**
   - Ensure `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

## 📋 **Environment Variables Checklist**

- [ ] MYSQL_HOST
- [ ] MYSQL_PORT  
- [ ] MYSQL_USER
- [ ] MYSQL_PASSWORD
- [ ] MYSQL_DATABASE
- [ ] JWT_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] EMAIL_FROM
- [ ] NEXT_PUBLIC_BASE_URL
- [ ] NEXT_PUBLIC_APP_URL
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET

## 🎉 **Success!**

Once deployed, your BDS PRO application will have:
- ✅ Working Google OAuth authentication
- ✅ Database connectivity
- ✅ Email functionality
- ✅ All features working in production
- ✅ Secure environment variable management

## 📞 **Support**

If you encounter any issues during deployment, check:
1. Vercel deployment logs
2. Google Cloud Console OAuth settings
3. Database connection status
4. Environment variable configuration