export default function TestAPIPage() {
  const testAPI = async () => {
    try {
      console.log('Testing API...');
      const response = await fetch('/api/iocs');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      alert(`API test: ${data.status}, IOCs: ${data.iocs?.length || 0}`);
    } catch (error) {
      console.error('API test error:', error);
      alert(`API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test Page</h1>
      <button onClick={testAPI} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test IOCs API
      </button>
    </div>
  );
}
