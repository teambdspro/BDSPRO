import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('=== Google OAuth Callback Debug ===');
    console.log('URL:', request.url);
    console.log('Code:', code);
    console.log('Error:', error);

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=' + error, request.url));
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    try {
      console.log('Exchanging code for token...');
      
      // Exchange code for token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('Token response:', tokenData);

      if (!tokenData.access_token) {
        console.error('No access token received:', tokenData);
        return NextResponse.redirect(new URL('/login?error=no_access_token', request.url));
      }

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: 'Bearer ' + tokenData.access_token,
        },
      });

      const userData = await userResponse.json();
      console.log('Google user data:', userData);

      // Check if user exists in database
      console.log('Checking if Google user exists in database for email:', userData.email);
      try {
        const [users] = await db.execute(
          'SELECT * FROM users WHERE email = ?',
          [userData.email]
        ) as any;

        let user;
        if (users.length > 0) {
          // User exists, update their info
          user = users[0];
          console.log('Existing user found:', user);
        } else {
          // Create new user
          console.log('Creating new user for Google OAuth');
          const referralCode = 'REF' + Math.random().toString(36).substr(2, 8).toUpperCase();
          
          const [result] = await db.execute(
            'INSERT INTO users (name, email, password, referral_code, created_at) VALUES (?, ?, ?, ?, NOW())',
            [userData.name, userData.email, 'google_oauth_user', referralCode]
          ) as any;

          user = {
            user_id: result.insertId,
            name: userData.name,
            email: userData.email,
            referral_code: referralCode,
            created_at: new Date()
          };
          console.log('New user created:', user);
        }

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
          { 
            userId: user.user_id, 
            email: user.email,
            name: user.name 
          },
          process.env.JWT_SECRET || 'demo_jwt_secret_key_for_development',
          { expiresIn: '7d' }
        );

        console.log('JWT token generated for user:', user.user_id);

        // Redirect to dashboard with token and user data
        const dashboardUrl = new URL('/dashboard', request.url);
        dashboardUrl.searchParams.set('token', token);
        dashboardUrl.searchParams.set('user', encodeURIComponent(JSON.stringify({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          referral_code: user.referral_code
        })));

        console.log('Redirecting to dashboard:', dashboardUrl.toString());
        return NextResponse.redirect(dashboardUrl.toString());

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.redirect(new URL('/login?error=database_error', request.url));
      }

    } catch (error) {
      console.error('Error processing Google OAuth:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_processing_error', request.url));
    }

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}

// Database connection
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "hopper.proxy.rlwy.net",
  port: Number(process.env.MYSQL_PORT) || 50359,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "QxNkIyShqDFSigZzxHaxiyZmqtzekoXL",
  database: process.env.MYSQL_DATABASE || "railway",
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});
