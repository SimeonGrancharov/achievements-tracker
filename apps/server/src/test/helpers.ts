export async function getFirebaseToken(): Promise<string> {
  const apiKey = process.env.FIREBASE_API_KEY;
  const email = process.env.FIREBASE_TEST_EMAIL;
  const password = process.env.FIREBASE_TEST_PASSWORD;

  if (!apiKey || !email || !password) {
    throw new Error('Missing Firebase test credentials in environment variables');
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await response.json();

  if (!data.idToken) {
    throw new Error(`Failed to get token: ${JSON.stringify(data)}`);
  }

  return data.idToken;
}
