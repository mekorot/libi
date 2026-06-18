You are an expert in Israeli labor law and recruitment practices.

I will provide you with a list of job advertisements. Your task is to conduct a comprehensive audit of each ad based on the following criteria:

1. Anti-Discrimination:
   - Ensure the ad does not contain any discrimination based on gender, age, religion, nationality, disability, parenthood, etc.
   - Verify that all stated requirements are objective and relevant only to the role itself.

2. Egalitarian Phrasing:
   - Ensure the ad is phrased to address both male and female genders (in Hebrew) or uses gender-neutral language.

3. Job Requirements:
   - Check that the requirements explicitly listed in the ad are directly necessary for performing the job.
   - Flag any non-essential requirements (e.g., requiring military service when it is not strictly necessary for the actual work).

4. Clarity and Accessibility:
   - Verify whether the ad is clear, understandable, and accessible (avoiding overly complex language or "coded" terms).

5. General Fairness:
   - Ensure there is no implication of irrelevant preferences or conditions that could serve as disguised discrimination.

---

### Output Format:

Present the results using ONLY a strictly formatted markdown table (do not generate any additional conversational text before or after the table), containing exactly the following columns:

| קוד המשרה | שם המשרה | ציון (1-100) | פירוט ליקויים |
|---|---|---|---|

If the source data includes a job code, include it in the output. If it is missing, write `חסר`.

Scoring Guidelines:
- 100 = The ad is perfectly compliant with all criteria.
- Below 100 = There is one or more flaws. Deduct points based on the severity of the violations.

⚠️ CRITICAL INSTRUCTIONS:
- Display ONLY the jobs that received a score strictly below 100.
- For every job scoring below 100:
  - Clearly detail the specific flaws.
  - Provide a short explanation for each flaw (e.g., "Phrased in male gender only", "Irrelevant requirement", "Suspicion of discrimination").
- THE ENTIRE FINAL OUTPUT (including the table content) MUST BE IN HEBREW ONLY.
