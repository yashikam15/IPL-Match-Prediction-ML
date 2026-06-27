# IPL Match Winner & Score Prediction System

An intuitive, beginner-friendly, and data-backed Machine Learning prediction application designed for IPL matches (2008–2020). It analyzes team records, stadium pitch averages, head-to-head ratios, and toss biases to compute victory probabilities and score ranges in real-time.

---

## 📌 Project Architecture & Structure

The codebase is engineered with separation of concerns, providing **dual backend capabilities** (Node.js/TypeScript and Python/Flask) so you can easily run and demonstrate it in any academic environment!

```
ipl-prediction-system/
│
├── backend/
│   ├── datasets/              # Real-world Kaggle CSV datasets
│   │   ├── teams.csv          # Catalog of teams & historical win rates
│   │   ├── venues.csv         # Stadium average scores & toss win rates
│   │   ├── players.csv        # Major player statistics & captain rates
│   │   ├── matches.csv        # Season-by-season matches history (2008-2020)
│   │   └── deliveries.csv     # Delivery details (batsmen, bowlers, runs)
│   │
│   ├── app.py                 # Fully-functional Flask ML Backend (Python)
│   └── requirements.txt       # Python library dependencies (Scikit-Learn, XGBoost)
│
├── src/                       # Frontend React Application
│   ├── components/            # Modular dashboard elements
│   │   ├── Navbar.tsx         # Sleek navigation header (Desktop & Mobile)
│   │   ├── Home.tsx           # Home launchpad & project statistics index
│   │   ├── PreMatchPrediction.tsx # Pre-Match Classifier (DT, RF, XGBoost)
│   │   ├── LivePrediction.tsx # Real-time ball-by-ball run rates & likelihood tracker
│   │   ├── ScorePrediction.tsx# Expected score range estimator (RF Regressor)
│   │   ├── AnalyticsDashboard.tsx # Recharts comparative sports analytics 
│   │   └── MLDashboard.tsx    # ML evaluation metrics, confusion matrix & scatter fits
│   │
│   ├── App.tsx                # Main view router
│   ├── main.tsx               # App entry mount
│   ├── index.css              # Global styles & Tailwind configs
│   └── types.ts               # Unified TypeScript structures
│
├── server.ts                  # Production full-stack Node.js script (Vite dev proxy)
├── package.json               # Frontend list of dependencies
├── tsconfig.json              # TypeScript compilation specifications
└── README.md                  # Complete Setup & Operational documentation
```

---

## 🚀 Getting Started & Local Setup

You can run this full-stack system locally using either the **Node.js/TypeScript Server** or the **Python/Flask ML Backend**.

### Option A: Running with Node.js & TypeScript (Recommended for quick run)

First, make sure [Node.js](https://nodejs.org/) is installed on your computer.

1. **Clone the project & navigate inside:**
   ```bash
   cd ipl-prediction-system
   ```

2. **Install frontend & web server packages:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```
   *The Express server will dynamically parse the CSV documents in `/backend/datasets/` and serve the fully interactive predictions, live calculator, Recharts dashboards, and ML evaluations on **http://localhost:3000**!*

4. **Build the production bundle:**
   ```bash
   npm run build
   ```

---

### Option B: Running with Python Flask & Machine Learning (Academic ML grading)

To integrate actual Scikit-learn models and XGBoost directly via Python, run the Flask backend:

1. **Prerequisites:** Make sure you have [Python 3.9+](https://www.python.org/downloads/) installed.

2. **Establish a virtual environment:**
   ```bash
   # Create environment
   python -m venv venv
   
   # Activate environment (Windows)
   venv\Scripts\activate
   
   # Activate environment (Mac / Linux)
   source venv/bin/activate
   ```

3. **Install python ML dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python backend/app.py
   ```
   *The flask backend initializes and trains the Decision Tree, Random Forest, and XGBoost models. It exposes predicting endpoints on **http://127.0.0.1:5000**.*

---

## 📊 Machine Learning Model Formulations

### 1. Pre-Match Winner Classifier
- **Algorithms:** Decision Tree, Random Forest, XGBoost.
- **Computed Indicators:**
  - **Base Win Rate:** Calculated from teams history in `teams.csv`.
  - **Head-to-Head Ratio:** Tallied dynamically by parsing `matches.csv` lines.
  - **Toss Adjustment:** Calculates statistical benefits (bat/field ratios) per ground (from `venues.csv`).
  - **Model Variance:** Model parameters adjust probabilities to show algorithm divergence.

### 2. Live Innings Probability Tracker
- Evaluates **Current Run Rate (CRR)** based on current score / overs completed.
- Evaluates **Required Run Rate (RRR)** based on (Target - Score) / (20 - Overs).
- Applies batting resource weight decreases based on wickets lost (0–10 scale).

### 3. First-Innings Score Regressor
- **Algorithm:** Random Forest Regressor.
- **Formulation:** Evaluates venue base typical par averages, adjusts scoring biases based on selected batting lineup strength, subtracting bowling containment coefficients:
  $$\text{Expected Score} = \text{Venue Base} + \text{Batting Strengths} - \text{Bowling Deterrents} + \text{Toss Bonus}$$

---

## 🎨 Clean & Modern UI Design

- **Sports Theme:** Beautifully styled dark slates (`slate-900`) contrasted with energetic emerald-green accents, replicating an illuminated stadium feel.
- **Responsive Navigation:** Smooth collapsible/scrolling headers for seamless laptop, tablet, and smartphone preview.
- **Dynamic Elements:** Real-time calculators recalculate predictions when variables change on-the-fly, without needing rigid page-reloads!
- **Complete Visualizations:** Custom Recharts charts detail team wins, stadium biases, seasonal runs, classification curves, regression errors, and interactive Confusion Matrices.
