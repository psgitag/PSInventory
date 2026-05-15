import { useEffect, useState } from 'react'

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Set which sheet is currently active
  const [activeTab, setActiveTab] = useState("Ganjifa cards of Mysore"); 

  // 2. List your worksheet names exactly as they appear in Google Sheets
  const tabs = ["Ganjifa cards of Mysore", "Pattachitra", "Channapatna Toys & Dolls", "Mysore Rosewood Inlay","Sandur Lambani Embroidery","Udayagiri Wooden Cutlery","Udupi Saree","ScrewPine"]; 

  const API_URL = "https://script.google.com/macros/s/AKfycbzJbVy3ZnM5gXLgRJVnjhQrpTxFJRUIUO1JnAn_63ZyYgs1YktXRYuCw3IBMpm43x0y/exec"; 

  useEffect(() => {
    setLoading(true);
    // 3. We append the sheet name to the URL
    fetch(`${API_URL}?sheet=${activeTab}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [activeTab]); // 4. This "useEffect" runs every time activeTab changes

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Warehouse Management</h1>

      {/* --- TAB NAVIGATION --- */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? '#007bff' : '#f0f0f0',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- DATA TABLE --- */}
      {loading ? (
        <p>Loading {activeTab} data...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              {items.length > 0 && Object.keys(items[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((val, i) => <td key={i}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App