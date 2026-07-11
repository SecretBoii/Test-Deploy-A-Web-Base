async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitAndPoll(testName, sourceCode) {
  const submitUrl = 'http://localhost:3000/exercises/run';
  const payload = {
    userId: "1",
    exerciseId: "101",
    sourceCode: sourceCode,
    hintUsed: false
  };

  console.log(`\n--------------------------------------------------`);
  console.log(`🎬 Starting test case: ${testName}`);
  console.log(`Source Code:\n${sourceCode}`);
  console.log(`--------------------------------------------------`);

  try {
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const submitResult = await submitResponse.json();
    const activityId = submitResult.activityId;
    
    console.log(`[Queue] Submitted! Activity ID: ${activityId}`);

    const statusUrl = `http://localhost:3000/exercises/status/${activityId}`;
    let finished = false;
    let attempts = 0;

    while (!finished && attempts < 15) {
      attempts++;
      await delay(1000);
      const statusResponse = await fetch(statusUrl);
      const statusResult = await statusResponse.json();

      if (statusResult.status !== 'PENDING') {
        finished = true;
        console.log(`\n🎉 Grading finished at attempt ${attempts}!`);
        console.log(`📊 AI Assessment Results:`);
        console.log(`   - Status:`, statusResult.status);
        console.log(`   - Score:`, statusResult.score);
        console.log(`   - Exception:`, statusResult.exceptionMessage);
        console.log(`   - AI Feedback:\n`);
        console.log(statusResult.aiFeedback);
      } else {
        console.log(`   ... waiting for results (sec: ${attempts}) ...`);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function startScenarios() {
  const wrongLogicCode = `width = 10\nlength = 5\nprint(width + length)`;
  await submitAndPoll("Case 1: Wrong Logic (Logical Error)", wrongLogicCode);

  await delay(2000);

  const runtimeErrorCode = `width = 10\nprint(width * length)`;
  await submitAndPoll("Case 2: Runtime Error", runtimeErrorCode);
}

startScenarios();
