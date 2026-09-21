# Deployment Guide — Bangur Durga Puja 2026

This guide walks you through deploying the Google Apps Script backend and running or deploying the frontend.

---

## Part 1: Google Apps Script Backend Setup

1. **Open your Google Sheet**:
   - Go to [Bangur Durga Puja Google Sheet](https://docs.google.com/spreadsheets/d/1oLa7_OfSUHLGej-LQ0_Y3Q9ITyPA2CbnHSuQ0IGHDaE/edit).

2. **Open the Apps Script Editor**:
   - In the top menu, click **Extensions** > **Apps Script**.

3. **Paste the Backend Code**:
   - In the script editor, replace all existing code in `Code.gs` with the entire content of [`apps-script/Code.gs`](apps-script/Code.gs).
   - Click **Save** (Ctrl+S or 💾 icon).

4. **One-Click Sheet Initialization**:
   - In the toolbar dropdown (which says `myFunction` or `doGet`), select `setupSheet`.
   - Click **Run**.
   - If Google asks for authorization (*Review permissions*), approve it with your Google account.
   - You will see the three tabs automatically created and styled in your spreadsheet:
     - `Contributions` (Timestamp, Name, Amount, Mode)
     - `Expenses` (Date, Item, Category, Amount, Paid To, Notes)
     - `Performances` (Timestamp, Name, Act Name, Category, Contact)

5. **Deploy as Web App**:
   - Click the blue **Deploy** button (top right) > **New deployment**.
   - Click the gear icon next to *Select type* and choose **Web app**.
   - Fill in:
     - **Description**: `Bangur Puja 2026 Production API`
     - **Execute as**: `Me (<your-email>)`
     - **Who has access**: `Anyone` *(Crucial: allows public form submissions without Google login)*
   - Click **Deploy**.
   - Authorize access if prompted.
   - **Copy the Web App URL** (it ends with `/exec`).

---

## Part 2: Frontend Configuration

1. In the project root, create or update `.env`:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```

2. Start local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## Part 3: Deploying Frontend to GitHub / Vercel / Netlify

### GitHub Pages / Repository
Push to your repository:
```bash
git add .
git commit -m "feat: complete Phase 1 Bangur Durga Puja 2026 web app"
git push -u origin main
```

### Vercel / Netlify
- Import the GitHub repo: `https://github.com/adiii0209/Bangur-Complex-Durgotsav.git`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable in the dashboard:
  `VITE_APPS_SCRIPT_URL` = `<Your Google Apps Script Web App URL>`
