// Script to add the missing IBRO grant and fix existing grants
import { initDb, dbAll, dbRun } from "./db/database.js";

async function fixGrants() {
  await initDb();

  // Check existing grants
  const grants = dbAll("SELECT id, name FROM grants ORDER BY id");
  console.log(`Current grants: ${grants.length}`);
  grants.forEach((g) => console.log(`  [${g.id}] ${g.name}`));

  // Check if IBRO already exists
  const ibro = dbAll("SELECT id FROM grants WHERE name LIKE '%IBRO%'");
  if (ibro.length === 0) {
    console.log("\nIBRO grant not found. Inserting...");
    dbRun(
      `INSERT INTO grants (name, organization, amount_min, amount_max, currency, deadline, is_expired,
         description, eligibility, category, relevance_score, status, requirements,
         readiness_score, estimated_success_rate, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "IBRO Neuroscience Training Grants 2026",
        "International Brain Research Organization (IBRO)",
        10000,
        50000,
        "USD",
        "2026-09-14",
        0,
        "Supporting neuroscience education and research training programs in Africa, with emphasis on building local capacity in brain research and related STEM fields.",
        JSON.stringify([
          "African educational institutions",
          "Neuroscience or related STEM programs",
          "Research training capacity",
        ]),
        "STEM",
        "MEDIUM",
        "NEW",
        JSON.stringify([]),
        60,
        25,
        "Seeded",
      ],
    );
    console.log("✓ IBRO grant inserted");
  } else {
    console.log("\nIBRO grant already exists");
  }

  // Verify final count
  const finalGrants = dbAll(
    "SELECT id, name, deadline, relevance_score, status FROM grants ORDER BY deadline ASC",
  );
  console.log(`\n=== Final grants (${finalGrants.length}) ===`);
  finalGrants.forEach((g) =>
    console.log(
      `  [${g.id}] ${g.name} | ${g.deadline} | ${g.relevance_score} | ${g.status}`,
    ),
  );

  process.exit(0);
}

fixGrants().catch((err) => {
  console.error(err);
  process.exit(1);
});
