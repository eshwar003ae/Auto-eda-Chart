import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import re 

# --- MODERN DARK THEME UPGRADE ---
plt.style.use('dark_background')
sns.set_theme(style="darkgrid", palette="pastel")
plt.rcParams.update({
    "figure.facecolor": "#1c1c24",
    "axes.facecolor": "#1c1c24",    
    "savefig.facecolor": "#1c1c24",
    "text.color": "#e5e7eb",
    "axes.labelcolor": "#e5e7eb",
    "xtick.color": "#9ca3af",
    "ytick.color": "#9ca3af",
    "axes.edgecolor": "#374151",
    "grid.color": "#374151",
    "font.family": "sans-serif",
    "font.size": 12
})
# ----------------------------------

def get_plot_from_prompt(df, prompt):
    if not prompt:
        return None
        
    prompt_lower = prompt.lower()
    plt.figure(figsize=(8, 5))
    
    try:
        df.columns = df.columns.str.strip()
        found_cols = [col for col in df.columns if col.lower() in prompt_lower]
        
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        cat_cols = df.select_dtypes(exclude=['number']).columns.tolist()
        
        if "scatter" in prompt_lower:
            x_col = found_cols[0] if len(found_cols) > 0 else (numeric_cols[0] if len(numeric_cols) > 0 else df.columns[0])
            y_col = found_cols[1] if len(found_cols) > 1 else (numeric_cols[1] if len(numeric_cols) > 1 else df.columns[1])
            sns.scatterplot(data=df, x=x_col, y=y_col, color="#8b5cf6", s=100)
            plt.title(f"Scatter Plot: {x_col} vs {y_col}")

        elif "pie" in prompt_lower:
            col = found_cols[0] if len(found_cols) > 0 else (cat_cols[0] if len(cat_cols) > 0 else df.columns[0])
            # BUG FIX: Use Seaborn's color palette explicitly to prevent the Matplotlib crash
            df[col].value_counts().plot.pie(autopct='%1.1f%%', startangle=90, colors=sns.color_palette("pastel"))
            plt.ylabel("")
            plt.title(f"Distribution of {col}")
            
        elif "bar" in prompt_lower or "compare" in prompt_lower:
            if len(found_cols) >= 2:
                sns.barplot(data=df, x=found_cols[0], y=found_cols[1], palette="pastel")
                plt.title(f"Comparison: {found_cols[1]} by {found_cols[0]}")
            else:
                x_col = found_cols[0] if len(found_cols) > 0 else (cat_cols[0] if len(cat_cols) > 0 else df.columns[0])
                sns.countplot(data=df, x=x_col, palette="pastel")
                plt.title(f"Count of {x_col}")

        elif "box" in prompt_lower:
            if len(found_cols) >= 2:
                sns.boxplot(data=df, x=found_cols[0], y=found_cols[1], palette="pastel")
                plt.title(f"Boxplot of {found_cols[1]} by {found_cols[0]}")
            else:
                y_col = found_cols[0] if len(found_cols) > 0 else (numeric_cols[0] if len(numeric_cols) > 0 else df.columns[0])
                sns.boxplot(data=df, y=y_col, color="#8b5cf6")
                plt.title(f"Boxplot of {y_col}")
                
        elif "hist" in prompt_lower or "dist" in prompt_lower:
            x_col = found_cols[0] if len(found_cols) > 0 else (numeric_cols[0] if len(numeric_cols) > 0 else df.columns[0])
            sns.histplot(data=df, x=x_col, kde=True, color="#ec4899")
            plt.title(f"Distribution of {x_col}")

        else:
            return None 

        plt.tight_layout()
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png", bbox_inches='tight', transparent=True)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        return image_base64

    except Exception as e:
        print(f"Backend Plotting Error: {e}")
        plt.close()
        return None

def analyze_multiple_prompts(df, prompt):
    if not prompt:
        return []
        
    # BUG FIX: Removed "and" so we only split when the user types "&" or ","
    sub_prompts = re.split(r'\s*&\s*|\s*,\s*', prompt.lower())
    
    results = []
    for sp in sub_prompts:
        sp = sp.strip()
        if not sp: continue
        
        plot_b64 = get_plot_from_prompt(df, sp)
        if plot_b64:
            results.append({"prompt": sp, "plot_base64": plot_b64})
            
    return results