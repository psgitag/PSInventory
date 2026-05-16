import { useEffect, useState, useMemo } from 'react'

function App() {
  // Store ALL sheets data here
  const [allInventory, setAllInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Ganjifa cards of Mysore");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeImage, setActiveImage] = useState(null);

  const tabs = [
    "Ganjifa cards of Mysore", 
    "Pattachitra", 
    "Channapatna Toys & Dolls", 
    "Mysore Rosewood Inlay",
    "Sandur Lambani Embroidery",
    "Udayagiri Wooden Cutlery",
    "Udupi Saree",
    "ScrewPine"
  ]; 

  const API_URL = "https://script.google.com/macros/s/AKfycbzJbVy3ZnM5gXLgRJVnjhQrpTxFJRUIUO1JnAn_63ZyYgs1YktXRYuCw3IBMpm43x0y/exec";

  // Fetch EVERYTHING only once on startup
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setAllInventory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Get current active tab items from memory (Blazing fast!)
  const items = useMemo(() => {
    return allInventory[activeTab] || [];
  }, [allInventory, activeTab]);

  const processedItems = useMemo(() => {
    let filteredResults = items.filter((item) => {
      if (!item) return false;
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (sortConfig.key !== null) {
      filteredResults.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          valA = numA;
          valB = numB;
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filteredResults;
  }, [items, sortConfig, searchTerm]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', flexDirection: 'column', gap: '10px' }}>
        <h2>Syncing with Google Sheets...</h2>
        <p style={{ color: '#666' }}>Downloading entire inventory for offline speed.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>GI Handicrafts Inventory</h1>

      {/* --- TABS & SEARCH --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => {
                setActiveTab(tab); 
                setSearchTerm("");
                setSortConfig({ key: null, direction: 'asc' });
              }} 
              style={{
                padding: '8px 16px', cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#007bff' : '#f0f0f0',
                color: activeTab === tab ? 'white' : '#333',
                border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '14px', transition: '0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <input 
          type="text"
          placeholder={`Instant search in ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
        />
      </div>

      {/* --- DATA TABLE --- */}
      <div style={{ overflowX: 'auto', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <table border="0" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              {items.length > 0 && Object.keys(items[0]).map(key => (
                <th 
                  key={key} 
                  onClick={() => requestSort(key)} 
                  style={{ cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap', color: '#495057', fontSize: '14px', textTransform: 'uppercase' }}
                >
                  {key} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ' ↕️'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedItems.length > 0 ? (
              processedItems.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  {Object.entries(item).map(([key, val], i) => {
                    const cleanKey = key.toLowerCase().replace(/[\s_]/g, '');
                    const imagePath = String(val);
                    const hasImage = imagePath.startsWith('http') || imagePath.startsWith('/images/');

                    return (
                      <td key={i} style={{ fontSize: '14px', color: '#555' }}>
                        {cleanKey.includes('image') && hasImage ? (
                          <button 
                            onClick={() => setActiveImage(imagePath)}
                            style={{
                              backgroundColor: '#28a745', color: 'white', border: 'none',
                              padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
                            }}
                          >
                            🖼️ View Image
                          </button>
                        ) : val === "" ? "-" : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- IMAGE MODAL --- */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', position: 'relative' }}>
            <img src={activeImage} alt="Product" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '4px', display: 'block' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App