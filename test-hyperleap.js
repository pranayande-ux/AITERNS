// Quick test script to verify AIterns integration
// This demonstrates the working AIterns bot API integration
const testAIternsIntegration = async () => {
  const BASE_URL = 'https://api.hyperleapai.com';
  const API_KEY = 'your-api-key-here'; // Replace with actual key
  const AITERNS_APP_ID = 'your-aiterns-app-id-here'; // Replace with actual AIterns app ID

  try {
    // 1. Create an AIterns conversation
    console.log('1. Creating AIterns conversation...');
    const createResponse = await fetch(`${BASE_URL}/apps/${AITERNS_APP_ID}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hl-api-key': API_KEY,
      },
      body: JSON.stringify({
        externalUserId: 'test-user-123'
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create AIterns conversation: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const conversationId = createData.conversationId || createData.id;
    console.log('✅ AIterns conversation created:', conversationId);

    // 2. Continue the AIterns conversation - expecting greeting
    console.log('2. Sending initial message to AIterns...');
    const continueResponse = await fetch(`${BASE_URL}/apps/${AITERNS_APP_ID}/conversations/${conversationId}/continue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hl-api-key': API_KEY,
      },
      body: JSON.stringify({
        message: 'Hello'
      })
    });

    if (!continueResponse.ok) {
      throw new Error(`Failed to continue AIterns conversation: ${continueResponse.status}`);
    }

    const continueData = await continueResponse.json();
    console.log('✅ AIterns Response:', continueData);

    // Check if response contains expected AIterns greeting
    const reply = continueData.reply || continueData.response || continueData.message || '';
    const isAIternsResponse = reply.includes('AIterns') && reply.includes('Here to help you');
    
    console.log(`AIterns greeting detected: ${isAIternsResponse ? '✅ YES' : '❌ NO'}`);

    return {
      success: true,
      conversationId,
      response: continueData,
      isAIternsBot: isAIternsResponse,
      reply: reply
    };
  } catch (error) {
    console.error('❌ AIterns test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Usage: testAIternsIntegration().then(console.log);
export { testAIternsIntegration };

// Test via Supabase edge function (real integration)
const testViaSupabase = async () => {
  try {
    console.log('Testing via Supabase edge function...');
    const response = await fetch('https://emmlxczljiqfssipmevx.supabase.co/functions/v1/hyperleap-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello',
        externalUserId: 'test-user-via-supabase'
      })
    });

    if (!response.ok) {
      throw new Error(`Supabase test failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Supabase edge function response:', data);
    
    const isAIternsResponse = data.reply && data.reply.includes('AIterns') && data.reply.includes('Here to help you');
    console.log(`AIterns greeting via Supabase: ${isAIternsResponse ? '✅ YES' : '❌ NO'}`);

    return {
      success: true,
      response: data,
      isAIternsBot: isAIternsResponse
    };
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export { testViaSupabase };