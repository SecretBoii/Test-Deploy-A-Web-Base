async function runTest() {
  const submitUrl = 'http://localhost:3000/exercises/run';
  
  const payload = {
    userId: "1",
    exerciseId: "101",
    sourceCode: "width = 10\nlength = 5\nprint(width * length)",
    hintUsed: false
  };

  console.log("1. Sending asynchronous code run request...");
  console.log("Payload:", payload);

  try {
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!submitResponse.ok) {
      throw new Error(`Submit Failed: ${submitResponse.statusText}`);
    }

    const submitResult = await submitResponse.json();
    console.log("\n2. Immediate response received:");
    console.log(submitResult);

    const activityId = submitResult.activityId;
    if (!activityId) {
      console.error("Activity ID not found in response");
      return;
    }

    const statusUrl = `http://localhost:3000/exercises/status/${activityId}`;
    console.log(`\n3. Starting status polling loop for ID: ${activityId}...`);

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      console.log(`[Attempt ${attempts}] Checking status...`);

      try {
        const statusResponse = await fetch(statusUrl);
        const statusResult = await statusResponse.json();

        if (statusResult.status !== 'PENDING') {
          clearInterval(interval);
          console.log("\n4. Execution finished!");
          console.log("Full Result:");
          console.log(JSON.stringify(statusResult, null, 2));
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Error fetching status:", err.message);
      }
    }, 1000);

  } catch (error) {
    console.error("Test execution failed:", error.message);
  }
}

runTest();
