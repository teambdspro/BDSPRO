import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import mysql from 'mysql2/promise';

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

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log('Google sign-in attempt for:', user.email);
          
          // Check if user exists in database
          const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [user.email]
          ) as any;

          if (users.length === 0) {
            // Create new user
            console.log('Creating new user for Google OAuth');
            const referralCode = 'REF' + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            await db.execute(
              'INSERT INTO users (name, email, password, referral_code, created_at) VALUES (?, ?, ?, ?, NOW())',
              [user.name, user.email, 'google_oauth_user', referralCode]
            );
            
            console.log('New user created with referral code:', referralCode);
          } else {
            console.log('Existing user found:', users[0].name);
          }
          
          return true;
        } catch (error) {
          console.error('Database error during sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        try {
          // Get user data from database
          const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [user.email]
          ) as any;

          if (users.length > 0) {
            const dbUser = users[0];
            token.userId = dbUser.user_id;
            token.referralCode = dbUser.referral_code;
            token.name = dbUser.name;
            token.email = dbUser.email;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.referralCode = token.referralCode as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
