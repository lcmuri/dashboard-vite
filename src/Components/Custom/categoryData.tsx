export const categoryData = [
  {
    name: "Therapeutic Use",
    children: [
      {
        name: "Cardiovascular",
        children: [
          { name: "Antihypertensives" },
          { name: "Lipid-lowering agents" },
        ],
      },
      {
        name: "Central Nervous System",
        children: [
          {
            name: "Analgesics",
            children: [{ name: "NSAIDs" }, { name: "Opioids" }],
          },
          { name: "Antidepressants" },
        ],
      },
    ],
  },
  {
    name: "Dosage Form",
    children: [
      { name: "Tablets", children: [{ name: "Coated Tablets" }] },
      { name: "Syrups" },
    ],
  },
];
