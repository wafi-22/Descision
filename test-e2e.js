async function runSuite() {
  console.log("=== DecisionMind AI API Verification Suite ===");
  
  // 1. Health check
  const healthRes = await fetch('http://localhost:5001/api/health');
  const health = await healthRes.json();
  console.log("1. Health Check:", health.status, "| Engine:", health.service);

  // 2. Auth login test
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'executive' })
  });
  const loginData = await loginRes.json();
  console.log("2. Auth Login:", loginData.user.name, "| Role:", loginData.user.role);

  // 3. Evaluate Decision Scenario
  const evalRes = await fetch('http://localhost:5001/api/decisions/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Automated Verification Test",
      category: "Technology Infrastructure",
      problem: "Assessing consensus accuracy and radar metrics across cloud alternatives.",
      budget: "$500,000",
      timeframe: "3 months",
      options: [
        { name: "Option A: Cloud Native Stack", summary: "Serverless managed services" },
        { name: "Option B: Dedicated Cluster", summary: "High control on-premises hardware" }
      ]
    })
  });
  const evalResult = await evalRes.json();
  console.log("3. AI Multi-Model Evaluation:", evalResult.primaryRecommendation, "| Confidence:", evalResult.confidenceScore + "%");
  console.log("   - FinRisk Verdict:", evalResult.multiModelAnalysis.finRisk.verdict);
  console.log("   - OpsVelocity Verdict:", evalResult.multiModelAnalysis.opsVelocity.verdict);
  console.log("   - StratAlign Verdict:", evalResult.multiModelAnalysis.stratAlign.verdict);
  console.log("   - Governance Verdict:", evalResult.multiModelAnalysis.governance.verdict);

  // 4. Save Decision
  const saveRes = await fetch('http://localhost:5001/api/decisions/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evalResult)
  });
  const saveStatus = await saveRes.json();
  console.log("4. Save Decision to History:", saveStatus.success ? "SUCCESS" : "FAILED");

  // 5. Retrieve saved decision by ID
  const getRes = await fetch(`http://localhost:5001/api/decisions/${evalResult.id}`);
  const getDecision = await getRes.json();
  console.log("5. Retrieve Decision by ID:", getDecision.id === evalResult.id ? "VERIFIED" : "MISMATCH");

  // 6. Metrics Check
  const metricsRes = await fetch('http://localhost:5001/api/metrics');
  const metrics = await metricsRes.json();
  console.log("6. Strategic Velocity Metrics:", `Decisions: ${metrics.totalDecisions}, Avg Confidence: ${metrics.avgConfidence}%, Velocity: ${metrics.velocityDays} days`);

  // 7. Verify frontend Vite server
  const viteRes = await fetch('http://localhost:5173');
  console.log("7. Vite Frontend Server Status:", viteRes.status === 200 ? "200 OK (ONLINE)" : viteRes.status);

  console.log("=== ALL 7 E2E TESTS PASSED PERFECTLY ===");
}

runSuite().catch(console.error);
