# Exercise and Nutrition Agent

## Installation

**Requirements:** Windows 10/11, [Python](https://www.python.org/downloads/), [Node.js](https://nodejs.org/), and an internet connection. Make sure Python and Node.js are available on your system PATH.

### Step 1: Download

1. Click the green **Code** button on GitHub.
2. Select **Download ZIP**.
3. Extract the ZIP file.

### Step 2: Obtain a Gemini API key

1. Open [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with your Google account.
3. Create and copy an API key. Free-tier access is subject to Google's availability and limits.

### Step 3: Install

1. Open the extracted project folder.
2. Double-click `install.bat`.
3. Paste your Gemini API key when prompted and press Enter.
4. Wait for installation to finish.

### Step 4: Run

1. Double-click `start.bat`.
2. Keep both command prompt windows open.
3. Open **http://localhost:5173** in your browser.

## Notes

- The installer saves your API key locally in `backend/.env`. An existing configured key is preserved when reinstalling.
- Do not upload or share your `.env` file.
- An internet connection is required for AI features.
- To stop the application, close both command prompt windows.
