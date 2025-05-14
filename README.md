## MindFlow
A web-based AI chat bot.

#### Test User
```config
Email: kunaldangi345@gmail.com
Password: 12345678
```

### Demo

[Video](https://drive.google.com/file/d/1-ksCKWDKIG7IJBgO1BRM73JVtKJI6elW/view?usp=sharing)

### How to build?
Setup environment variable
```env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
GMAIL_ID=
GMAIL_KEY=
JWT_OTP_SECRET=
OTP_EXPIRY_TIME=
JWT_SESSION_SECRET=
```
```bash
git clone https://github.com/galaxone/mindflow.git
cd mindflow
npm i
# make sure to setup all environment variables
npm run dev # to start development server (good for development mode only)
# OR
npm run build
npm run start # to start production server (recommended)
```
Open [http://localhost](http://localhost) with your browser to see the result.
