const labTestData = {
  categories: [
    {
      id: 'chemistry',
      name: 'Chemistry',
      subcategories: [
        {
          id: 'glucose',
          name: 'Glucose Metabolism',
          tests: [
            { id: 'glucose_fasting', name: 'Fasting Glucose', description: 'Measures blood sugar after fasting' },
            { id: 'hba1c', name: 'Hemoglobin A1c', description: 'Average blood sugar over 2-3 months' },
            { id: 'ogtt', name: 'Oral Glucose Tolerance Test', description: 'Measures body\'s response to sugar' },
          ],
        },
        {
          id: 'electrolytes',
          name: 'Electrolytes',
          tests: [
            { id: 'sodium', name: 'Sodium', description: 'Measures sodium levels in blood' },
            { id: 'potassium', name: 'Potassium', description: 'Measures potassium levels in blood' },
            { id: 'chloride', name: 'Chloride', description: 'Measures chloride levels in blood' },
            { id: 'bicarbonate', name: 'Bicarbonate', description: 'Measures CO2 levels in blood' },
          ],
        },
        {
          id: 'liver',
          name: 'Liver Function Tests',
          tests: [
            { id: 'alt', name: 'ALT (Alanine Transaminase)', description: 'Liver enzyme test' },
            { id: 'ast', name: 'AST (Aspartate Transaminase)', description: 'Liver enzyme test' },
            { id: 'alp', name: 'ALP (Alkaline Phosphatase)', description: 'Liver and bone enzyme test' },
            { id: 'bilirubin', name: 'Bilirubin', description: 'Measures bilirubin levels' },
            { id: 'albumin', name: 'Albumin', description: 'Measures protein made by the liver' },
          ],
        },
        {
          id: 'renal',
          name: 'Renal Function Tests',
          tests: [
            { id: 'bun', name: 'BUN (Blood Urea Nitrogen)', description: 'Kidney function test' },
            { id: 'creatinine', name: 'Creatinine', description: 'Kidney function test' },
            { id: 'egfr', name: 'eGFR (Estimated GFR)', description: 'Estimates kidney filtration rate' },
          ],
        },
        {
          id: 'lipids',
          name: 'Lipid Panel',
          tests: [
            { id: 'cholesterol', name: 'Total Cholesterol', description: 'Measures total cholesterol' },
            { id: 'hdl', name: 'HDL Cholesterol', description: 'Measures \'good\' cholesterol' },
            { id: 'ldl', name: 'LDL Cholesterol', description: 'Measures \'bad\' cholesterol' },
            { id: 'triglycerides', name: 'Triglycerides', description: 'Measures blood fats' },
          ],
        },
      ],
    },
    {
      id: 'hematology',
      name: 'Hematology',
      subcategories: [
        {
          id: 'cbc',
          name: 'Complete Blood Count (CBC)',
          tests: [
            { id: 'wbc', name: 'White Blood Cell Count', description: 'Measures infection-fighting cells' },
            { id: 'rbc', name: 'Red Blood Cell Count', description: 'Measures oxygen-carrying cells' },
            { id: 'hemoglobin', name: 'Hemoglobin', description: 'Measures oxygen-carrying protein' },
            { id: 'hematocrit', name: 'Hematocrit', description: 'Measures proportion of red blood cells' },
            { id: 'platelets', name: 'Platelet Count', description: 'Measures clotting cells' },
          ],
        },
        {
          id: 'coagulation',
          name: 'Coagulation Studies',
          tests: [
            { id: 'pt', name: 'Prothrombin Time (PT)', description: 'Blood clotting test' },
            { id: 'inr', name: 'International Normalized Ratio (INR)', description: 'Standardized PT result' },
            { id: 'ptt', name: 'Partial Thromboplastin Time (PTT)', description: 'Blood clotting test' },
          ],
        },
      ],
    },
    {
      id: 'immunology',
      name: 'Immunology',
      subcategories: [
        {
          id: 'autoantibodies',
          name: 'Autoantibodies',
          tests: [
            { id: 'ana', name: 'ANA (Antinuclear Antibody)', description: 'Test for autoimmune disorders' },
            { id: 'rf', name: 'Rheumatoid Factor', description: 'Test for rheumatoid arthritis' },
            { id: 'anti_ccp', name: 'Anti-CCP', description: 'Test for rheumatoid arthritis' },
          ],
        },
        {
          id: 'allergy',
          name: 'Allergy Testing',
          tests: [
            { id: 'ige_total', name: 'Total IgE', description: 'Measures overall allergy antibody levels' },
            { id: 'ige_specific', name: 'Specific IgE', description: 'Tests for specific allergies' },
          ],
        },
      ],
    },
    {
      id: 'microbiology',
      name: 'Microbiology',
      subcategories: [
        {
          id: 'cultures',
          name: 'Cultures',
          tests: [
            { id: 'blood_culture', name: 'Blood Culture', description: 'Tests for blood infections' },
            { id: 'urine_culture', name: 'Urine Culture', description: 'Tests for urinary tract infections' },
            { id: 'sputum_culture', name: 'Sputum Culture', description: 'Tests for respiratory infections' },
          ],
        },
        {
          id: 'sensitivity',
          name: 'Sensitivity Testing',
          tests: [
            {
              id: 'antibiotic_sensitivity',
              name: 'Antibiotic Sensitivity',
              description: 'Determines effective antibiotics',
            },
            { id: 'viral_sensitivity', name: 'Viral Sensitivity', description: 'Tests for antiviral effectiveness' },
          ],
        },
      ],
    },
    {
      id: 'endocrinology',
      name: 'Endocrinology',
      subcategories: [
        {
          id: 'thyroid',
          name: 'Thyroid Function',
          tests: [
            { id: 'tsh', name: 'TSH', description: 'Thyroid stimulating hormone' },
            { id: 't4', name: 'T4 (Thyroxine)', description: 'Main thyroid hormone' },
            { id: 't3', name: 'T3 (Triiodothyronine)', description: 'Active thyroid hormone' },
          ],
        },
        {
          id: 'reproductive',
          name: 'Reproductive Hormones',
          tests: [
            { id: 'cortisol', name: 'Cortisol', description: 'Stress hormone' },
            { id: 'testosterone', name: 'Testosterone', description: 'Male sex hormone' },
            { id: 'estrogen', name: 'Estrogen', description: 'Female sex hormone' },
          ],
        },
      ],
    },
    {
      id: 'toxicology',
      name: 'Toxicology',
      subcategories: [
        {
          id: 'drug_screening',
          name: 'Drug Screening',
          tests: [
            { id: 'tox_screen', name: 'Toxicology Screen', description: 'General drug screening' },
            { id: 'ethanol', name: 'Ethanol', description: 'Alcohol level test' },
          ],
        },
      ],
    },
    {
      id: 'molecular',
      name: 'Molecular Diagnostics',
      subcategories: [
        {
          id: 'genetic',
          name: 'Genetic Testing',
          tests: [
            { id: 'pcr', name: 'PCR Tests', description: 'Detects genetic material of pathogens' },
            { id: 'dna_sequencing', name: 'DNA Sequencing', description: 'Analyzes genetic sequence' },
          ],
        },
      ],
    },
    {
      id: 'other',
      name: 'Other Tests',
      subcategories: [
        {
          id: 'vitamins',
          name: 'Vitamin Tests',
          tests: [
            { id: 'vitamin_d', name: 'Vitamin D', description: 'Measures vitamin D levels' },
            { id: 'vitamin_b12', name: 'Vitamin B12', description: 'Measures vitamin B12 levels' },
          ],
        },
        {
          id: 'therapeutic',
          name: 'Therapeutic Drug Monitoring',
          tests: [
            { id: 'digoxin', name: 'Digoxin', description: 'Heart medication level' },
            { id: 'lithium', name: 'Lithium', description: 'Mood stabilizer level' },
          ],
        },
      ],
    },
  ],
};

export { labTestData };
