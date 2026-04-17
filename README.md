# Auto EDA Chart - Interactive Data Visualization Dashboard 📊

Auto EDA Chart is a full-stack, natural language-driven Exploratory Data Analysis (EDA) tool. It allows users to upload standard CSV datasets and generate professional, customized data visualizations simply by typing what they want to see (e.g., "compare class and marks & pie chart for age").

## ✨ Features
* **Natural Language Processing:** Type prompts to generate charts without writing a single line of code.
* **Multi-Chart Generation:** Chain commands together (using `&` or `,`) to generate multiple charts simultaneously.
* **Smart Column Matching:** Automatically detects numerical and categorical columns if user prompts are ambiguous.
* **Modern UI:** Built with a fully responsive, dark-mode Tailwind CSS interface.
* **Intelligent Error Handling:** Safely handles missing data (NaN) and bypasses strict validation to ensure a seamless UX.

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Tailwind CSS v4
* React Router DOM
* Lucide React (Icons)
* Axios (API Client)

**Backend:**
* Python 3
* FastAPI & Uvicorn
* Pandas (Data Manipulation)
* Matplotlib & Seaborn (Chart Generation)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.10+)

### 1. Backend Setup
Navigate to the backend directory, install the required packages, and start the server:
```bash
#cd backend
#python -m venv venv
#source venv/bin/activate  # On Windows use: venv\Scripts\activate
#pip install fastapi uvicorn pandas matplotlib seaborn python-multipart
#uvicorn main:app --reload --port 8000
🧠 The Working Model

Your Auto EDA app is a Rule-Based Data Visualization Engine combined with a decoupled frontend/backend architecture.

    The Client (React): Manages the user interface, holds the uploaded CSV file in memory using React Context, and sends the user's text prompts to the backend via an HTTP request.

    The Server (FastAPI): Receives the CSV and loads it into a Pandas DataFrame.

    The Brain (eda_functions.py): Uses Regular Expressions (Regex) to scan the user's prompt. It looks for specific chart keywords (like "scatter" or "pie") and scans the DataFrame to see if the user typed any actual column names.

    The Artist (Matplotlib/Seaborn): Generates the mathematical plot in memory, applies your custom dark theme, converts the raw image pixels into a Base64 text string, and sends it back to React to display.

📏 Rules & Limitations

Because the app is built on logical rules rather than a massive AI model (like ChatGPT), it has specific limitations:

1. File Format Rule

    Rule: Datasets must be strictly in .csv format.

    Limitation: As you saw earlier, uploading an Excel file (.xlsx) or a JSON file will instantly crash the Python Pandas reader.

2. The Vocabulary Limitation

    Rule: The prompt must contain specific trigger words: "scatter", "pie", "bar", "compare", "box", "hist", or "dist".

    Limitation: If a user types, "Show me a line graph of sales over time", the backend will not recognize "line graph" and will fail to generate it.

3. The Spelling Limitation

    Rule: Column names in the prompt must perfectly match the spelling in the CSV (capitalization doesn't matter, but spelling does).

    Limitation: If your CSV has a column named Student_Marks, and the user types "pie chart for marks", the backend might not find it unless you build a fuzzy-matching algorithm.

4. Data Volume & Memory

    Limitation: Because you are uploading the entire CSV file on every request, sending a massive dataset (like 500,000 rows / 1GB) will cause the browser to freeze or the FastAPI server to run out of memory. This tool is best for datasets under 10MB.# Auto-eda-Chart
