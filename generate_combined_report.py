from pathlib import Path
import pandas as pd
from openpyxl.worksheet.table import Table, TableStyleInfo

ROOT = Path(__file__).resolve().parent
REPORT_DIR = ROOT / "Report"
MASTER_FILE = ROOT / "DB" / "JobdAds.xlsx"
OUTPUT_FILE = REPORT_DIR / "CombinedFailReport.xlsx"

INPUT_EXCLUDE = {OUTPUT_FILE.name, "CombinedReport.xlsx"}

COLUMN_ALIASES = {
    "job_code": ["קוד משרה", "קוד המשרה", "Job Code", "job code"],
    "job_title": ["שם המשרה", "Job Title", "job title"],
    "score": ["ציון (1-100)", "score", "Score"],
    "feedback": ["פירוט ליקויים", "feedback", "comments", "remarks"],
    "test_name": ["שם המבחן שבוצע", "שם במהחן שבוצע", "שם המבחן", "מבחן"]
}


def normalize_column(column_name):
    if isinstance(column_name, str):
        return column_name.strip().strip("'\"").strip()
    return column_name


def find_column(columns, aliases):
    for alias in aliases:
        if alias in columns:
            return alias
    return None


def read_report_file(path: Path) -> pd.DataFrame:
    xls = pd.ExcelFile(path)
    if not xls.sheet_names:
        return pd.DataFrame()
    sheet = xls.sheet_names[0]
    df = pd.read_excel(path, sheet_name=sheet)
    normalized_columns = [normalize_column(col) for col in df.columns.tolist()]
    df.columns = normalized_columns

    mapped = {}
    mapped["job_code"] = find_column(normalized_columns, COLUMN_ALIASES["job_code"])
    mapped["job_title"] = find_column(normalized_columns, COLUMN_ALIASES["job_title"])
    mapped["score"] = find_column(normalized_columns, COLUMN_ALIASES["score"])
    mapped["feedback"] = find_column(normalized_columns, COLUMN_ALIASES["feedback"])
    mapped["test_name"] = find_column(normalized_columns, COLUMN_ALIASES["test_name"])

    missing = [key for key, col in mapped.items() if key in {"job_code", "job_title", "score", "feedback"} and col is None]
    if missing:
        raise ValueError(f"Missing required column(s) in {path.name}: {missing}")

    result = df[[mapped["job_code"], mapped["job_title"], mapped["score"], mapped["feedback"]]].copy()
    result.columns = ["קוד משרה", "שם המשרה", "ציון (1-100)", "פירוט ליקויים"]
    if mapped["test_name"]:
        result["שם המבחן"] = df[mapped["test_name"]].astype(str).fillna("")
    else:
        result["שם המבחן"] = path.stem

    result["source_file"] = path.name
    return result


def load_report_data(report_dir: Path) -> pd.DataFrame:
    rows = []
    for path in sorted(report_dir.glob("*.xlsx")):
        if path.name in INPUT_EXCLUDE or path.name.startswith("~$"):
            continue
        df = read_report_file(path)
        if not df.empty:
            rows.append(df)
    if not rows:
        return pd.DataFrame(columns=["קוד משרה", "שם המשרה", "ציון (1-100)", "פירוט ליקויים", "שם המבחן", "source_file"])
    return pd.concat(rows, ignore_index=True)


def load_master_jobs(master_file: Path) -> pd.DataFrame:
    xls = pd.ExcelFile(master_file)
    if not xls.sheet_names:
        raise FileNotFoundError(f"Master file has no sheets: {master_file}")
    sheet = xls.sheet_names[0]
    df = pd.read_excel(master_file, sheet_name=sheet)
    if "קוד משרה" not in df.columns:
        raise ValueError(f"Master file missing required column 'קוד משרה': {master_file}")
    if "כותרת משרה" in df.columns:
        df = df.rename(columns={"כותרת משרה": "שם המשרה"})
    if "שם המשרה" not in df.columns:
        raise ValueError(f"Master file missing required job title column: {master_file}")
    return df[["קוד משרה", "שם המשרה"]].drop_duplicates()


def build_combined_report(master_df: pd.DataFrame, tests_df: pd.DataFrame) -> pd.DataFrame:
    tests_df["ציון (1-100)"] = pd.to_numeric(tests_df["ציון (1-100)"], errors="coerce")
    tests_df["נכשל"] = tests_df["ציון (1-100)"] < 100
    tests_df["feedback_summary"] = tests_df.apply(
        lambda row: f"[{row['שם המבחן']}] {row['פירוט ליקויים']}" if pd.notna(row['שם המבחן']) and row['שם המבחן'] else row['פירוט ליקויים'],
        axis=1,
    )

    agg = (
        tests_df
        .groupby(["קוד משרה", "שם המשרה"], dropna=False)
        .agg(
            ממוצע_ציון=("ציון (1-100)", "mean"),
            מבחנים_נכשלו=("נכשל", "sum"),
            משובים_מכל_המבחנים=("feedback_summary", lambda values: " | ".join(str(v) for v in values if pd.notna(v) and str(v).strip()))
        )
    )

    agg = agg.reset_index()
    agg = agg.sort_values(by=["מבחנים_נכשלו", "ממוצע_ציון"], ascending=[False, True])

    report_df = master_df.merge(agg, on=["קוד משרה", "שם המשרה"], how="left")
    report_df["ממוצע_ציון"] = report_df["ממוצע_ציון"].round(2).fillna(0)
    report_df["מבחנים_נכשלו"] = report_df["מבחנים_נכשלו"].fillna(0).astype(int)
    report_df["משובים_מכל_המבחנים"] = report_df["משובים_מכל_המבחנים"].fillna("")

    final_cols = [
        "קוד משרה",
        "שם המשרה",
        "מבחנים_נכשלו",
        "ממוצע_ציון",
        "משובים_מכל_המבחנים",
    ]
    return report_df[final_cols].sort_values(by=["מבחנים_נכשלו", "ממוצע_ציון"], ascending=[False, True])


def write_excel_table(df: pd.DataFrame, output_path: Path):
    final_path = output_path
    if output_path.exists():
        try:
            output_path.unlink()
        except PermissionError:
            fallback = output_path.with_name(f"{output_path.stem}_new{output_path.suffix}")
            final_path = fallback
            print(f"Output file is locked, writing to fallback file: {final_path}")

    with pd.ExcelWriter(final_path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="CombinedReport")
        workbook = writer.book
        worksheet = writer.sheets["CombinedReport"]

        table_ref = f"A1:{chr(ord('A') + len(df.columns) - 1)}{len(df) + 1}"
        table = Table(displayName="CombinedFailReportTable", ref=table_ref)
        style = TableStyleInfo(
            name="TableStyleMedium9",
            showFirstColumn=False,
            showLastColumn=False,
            showRowStripes=True,
            showColumnStripes=False,
        )
        table.tableStyleInfo = style
        worksheet.add_table(table)

        for idx, column in enumerate(df.columns, start=1):
            max_length = max(
                df[column].astype(str).map(len).max() if len(df) > 0 else 0,
                len(str(column))
            ) + 2
            worksheet.column_dimensions[worksheet.cell(row=1, column=idx).column_letter].width = min(max_length, 50)
    return final_path


def main():
    master_df = load_master_jobs(MASTER_FILE)
    tests_df = load_report_data(REPORT_DIR)
    combined = build_combined_report(master_df, tests_df)
    output_path = write_excel_table(combined, OUTPUT_FILE)
    print(f"Combined report written to: {output_path}")


if __name__ == "__main__":
    main()
