import { useEffect, useState, useMemo } from 'react'

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Ganjifa cards of Mysore");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // State to track which image is currently being viewed in a popup
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

  useEffect(() => {
    setLoading(true);
    setItems([]); 
    fetch(`${API_URL}?sheet=${encodeURIComponent(activeTab)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        else setItems([]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setItems([]);
        setLoading(false);
      });
  }, [activeTab]);

  const processedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

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
          placeholder={`Search in ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
        />
      </div>

      {/* --- DATA TABLE --- */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><p>Fetching {activeTab} data...</p></div>
      ) : (
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
                    {Object.entries(item).map(([key, val], i) => (
                      <td key={i} style={{ fontSize: '14px', color: '#555' }}>
                        {/* If this is the Image URL column and a link exists, show an on-demand button */}
                        {key.toLowerCase() === 'image url' && val ? (
                          <button 
                            onClick={() => setActiveImage(String(val))}
                            style={{
                              backgroundColor: '#28a745', color: 'white', border: 'none',
                              padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                            }}
                          >
                            🖼️ View Image
                          </button>
                        ) : val === "" ? "-" : String(val)}
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

      {/* --- IMAGE MODAL (POPUP) --- */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)} // Click outside to close
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000, cursor: 'pointer'
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', position: 'relative' }}>
            <button 
              onClick={() => setActiveImage(null)}
              style={{
                position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'red',
                color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer'
              }}
            >
              X
            </button>
            <img 
              src={activeImage} 
              alt="Product" 
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '4px', display: 'block' }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App