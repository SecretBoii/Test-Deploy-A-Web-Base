const { Client } = require('./srv/node_modules/pg');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const connectionString = 'postgresql://postgres:1234@localhost:5432/python_exercises?schema=public';

async function resetDb() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Clearing previous activities for user 1 & exercise 101...');
  await client.query('DELETE FROM activity WHERE user_id = 1 AND exercise_id = 101');
  await client.end();
  console.log('DB cleaned successfully.');
}

async function submitAndPoll(attemptNum, sourceCode) {
  const submitUrl = 'http://localhost:3000/exercises/run';
  const payload = {
    userId: "1",
    exerciseId: "101",
    sourceCode: sourceCode,
    hintUsed: false
  };

  console.log(`\n--------------------------------------------------`);
  console.log(`🎬 Triggering Attempt ${attemptNum}`);
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

    while (!finished && attempts < 20) {
      attempts++;
      await delay(1000);
      const statusResponse = await fetch(statusUrl);
      const statusResult = await statusResponse.json();

      if (statusResult.status !== 'PENDING') {
        finished = true;
        console.log(`\n🎉 Attempt ${attemptNum} finished!`);
        console.log(`   - Status:`, statusResult.status);
        console.log(`   - Score:`, statusResult.score);
        console.log(`   - Exception:`, statusResult.exceptionMessage);
        console.log(`   - AI Feedback:\n`);
        console.log(statusResult.aiFeedback);
        console.log(`\n--------------------------------------------------`);
      } else {
        process.stdout.write('.');
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function runTest() {
  try {
    await resetDb();

    const wrongCode = `width = 10\nheight = 5\n# Wrong formula: using addition instead of multiplication\nprint(width + height)`;

    await submitAndPoll(1, wrongCode);
    await delay(3000);

    await submitAndPoll(2, wrongCode);
    await delay(3000);

    await submitAndPoll(3, wrongCode);
    await delay(3000);

    await submitAndPoll(4, wrongCode);
    await delay(3000);

    await submitAndPoll(5, wrongCode);

  } catch (e) {
    console.error(e);
  }
}

runTest();
