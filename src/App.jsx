import { useEffect, useState, useMemo } from 'react'

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Set which sheet is currently active
  const [activeTab, setActiveTab] = useState("Ganjifa cards of Mysore");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 2. List your worksheet names exactly as they appear in Google Sheets
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

  useEffect(() => {
    setLoading(true);
    // Clear items when switching tabs to prevent filtering old data
    setItems([]); 
    
    fetch(`${API_URL}?sheet=${encodeURIComponent(activeTab)}`)
      .then(res => res.json())
      .then(data => {
        // Validation: Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Received data is not an array:", data);
          setItems([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setItems([]);
        setLoading(false);
      });
  }, [activeTab]);

  // 1. SMART SORTING & SEARCH LOGIC (Updated with safety checks)
  const processedItems = useMemo(() => {
    // Defense: If items is not an array, return empty list immediately
    if (!Array.isArray(items)) return [];

    // FIRST: Filter by Search Term
    let filteredResults = items.filter((item) => {
      if (!item) return false;
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // SECOND: Sort the filtered results
    if (sortConfig.key !== null) {
      filteredResults.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Numeric check: Convert to numbers if possible for logical sorting
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

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>GI Handicrafts Inventory</h1>

      {/* --- TOP BAR: Tabs & Search --- */}
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
                padding: '8px 16px', 
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#007bff' : '#f0f0f0',
                color: activeTab === tab ? 'white' : '#333',
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '14px',
                transition: '0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <input 
          type="text"
          placeholder={`Search in ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
      </div>

      {/* --- DATA TABLE --- */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Fetching {activeTab} data...</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <table border="0" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                {items.length > 0 && Object.keys(items[0]).map(key => (
                  <th 
                    key={key} 
                    onClick={() => requestSort(key)} 
                    style={{ 
                      cursor: 'pointer', 
                      textAlign: 'left', 
                      whiteSpace: 'nowrap',
                      color: '#495057',
                      fontSize: '14px',
                      textTransform: 'uppercase'
                    }}
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
                    {Object.values(item).map((val, i) => (
                      <td key={i} style={{ fontSize: '14px', color: '#555' }}>
                        {val === "" ? "-" : String(val)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="100%" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    {searchTerm ? "No matching records found." : "No data available in this sheet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App