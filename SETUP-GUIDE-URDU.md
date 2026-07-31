# Naye Features — Setup Guide

## ✅ Is update mein kya complete hua hai

1. **Data delete hone wala bug fix** — Blog posts, site content, users, sab
   ab real database (Upstash Redis) mein save hote hain. Redeploy ya server
   refresh karne se ab kuch delete nahi hoga.
2. **Image uploads persistent** — Vercel Blob storage use ho rahi hai, uploads
   ab bhi refresh pe delete nahi honge.
3. **Mouse cursor trail dot** — Har page par ek chota glowing dot cursor ke
   peeche follow karta hai (smooth lag effect).
4. **Logo size control** — Admin Dashboard → Branding tab mein slider se logo
   chota/bara kar sakte hain.
5. **2FA (Two-Factor Authentication)** — Email OTP aur Authenticator app
   (Google Authenticator waghera) dono support hain. Admin Dashboard →
   Account tab mein har user ke liye alag se decide kar sakte hain kis ko
   2FA chahiye aur kaunsa method.
6. **Profile pictures** — Har user (admin/SEO) apni profile picture aur
   email add kar sakta hai Account tab se.

## 🔶 Abhi pending hai (agla step)

- **"Naya page banao" builder** — Data types aur backend storage function
  bana diye hain, lekin admin panel mein UI aur website par render karne
  wala route abhi baaki hai. Bataiye to yeh bhi continue kar dun.

## 🚀 Vercel par deploy karne ka tareeqa (zaroori)

Yeh site pehle se Vercel ke liye ready hai, bas 2 cheezein connect karni
hain taake data aur images permanently save hon:

### 1. Redis Database (data ke liye)
1. Vercel dashboard → apna project kholein → **Storage** tab
2. **Create Database** → **Upstash** → **Redis** select karein
3. Connect karte hi environment variables (`KV_REST_API_URL`,
   `KV_REST_API_TOKEN`) khud-b-khud add ho jayengi
4. Project ko **Redeploy** karein

### 2. Blob Storage (images ke liye)
1. Same **Storage** tab → **Create Database** → **Blob**
2. Connect karein → `BLOB_READ_WRITE_TOKEN` khud add ho jayega
3. Redeploy karein

### 3. Baaki environment variables
`.env.example` file dekhein — `AUTH_SECRET`, `ADMIN_USERNAME`,
`ADMIN_PASSWORD`, `SEO_USERNAME`, `SEO_PASSWORD` waghera Vercel ke
**Settings → Environment Variables** mein set karni hain.

Email OTP (2FA) ke liye `RESEND_API_KEY` bhi zaroori hai — yeh already
contact form ke liye use ho raha tha, same key 2FA emails ke liye bhi
kaam karegi.

### Local development (apne computer par test karne ke liye)
Kuch bhi extra setup ki zaroorat nahi — agar upar wali database connect
nahi ki hui to app khud-b-khud local JSON files use kar leta hai
(`npm run dev` chalayein, bas).

## Security notes
- Passwords `scrypt` (industry-standard) se hash hoke save hote hain —
  kabhi bhi plain text mein store nahi hote.
- 2FA codes 5 minute mein expire ho jate hain.
- Login par rate-limiting already lagi hui hai (bar-bar galat password
  try karne se block ho jayega).
