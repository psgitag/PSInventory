import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, 
  Button, Container, Box, Tabs, Tab, TextField, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel,
  CircularProgress, IconButton, Dialog, DialogContent
} from '@mui/material';
import { 
  Home as HomeIcon, Info, ContactPage, Help, ShoppingBag, 
  Search, Close, Image 
} from '@mui/icons-material';

// --- UPDATED MATERIAL DESIGN 3 THEME CONFIGURATION ---
const md3Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6750A4' },      // M3 Baseline Purple
    secondary: { main: '#625B71' },    // M3 Secondary
    background: { default: '#FEF7FF', paper: '#FFFFFF' },
    surfaceVariant: '#E7E0EC',
    text: {
      primary: '#1D1B20',              // Dark charcoal for main text
      secondary: '#49454F'             // Highly legible gray for secondary text
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#1D1B20' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '100px', textTransform: 'none' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: '12px' } } },
    
    // --- THIS FIXED THE TAB CONTRAST ---
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#49454F',            // Darker color for unselected tabs
          fontWeight: '600',           // Slightly bolder text for easier reading
          opacity: 0.85,               // Keeps it crisp
          '&.Mui-selected': {
            color: '#6750A4',          // Primary purple for the active tab
            opacity: 1,
          },
        },
      },
    },
  }
});

const API_URL = "https://script.google.com/macros/s/AKfycbzJbVy3ZnM5gXLgRJVnjhQrpTxFJRUIUO1JnAn_63ZyYgs1YktXRYuCw3IBMpm43x0y/exec";

const tabNames = [
  "Ganjifa cards of Mysore", "Pattachitra", "Channapatna Toys & Dolls", 
  "Mysore Rosewood Inlay", "Sandur Lambani Embroidery", 
  "Udayagiri Wooden Cutlery", "Udupi Saree", "ScrewPine"
];

export default function App() {
  const [allInventory, setAllInventory] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Excel data ONCE on startup to maintain instant tab switching
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => { setAllInventory(data); setLoading(false); })
      .catch(err => { console.error("Fetch error:", err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={md3Theme}>
        <Box display="flex" height="100vh" flexDirection="column" justifyContent="center" alignItems="center" bg="background.default">
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2, color: 'secondary.main' }}>Syncing GI Inventory...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={md3Theme}>
      <CssBaseline />
      <Router>
        <NavigationHeader />
        <Container sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/shop" element={<ShopView allInventory={allInventory} />} />
            <Route path="/faq" element={<FaqView />} />
            <Route path="/contact" element={<ContactView />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

// --- UPDATED NAVIGATION APP BAR COMPONENT ---
function NavigationHeader() {
  const location = useLocation();

  // Helper function to handle button styles dynamically
  const getButtonStyles = (path) => {
    const isActive = location.pathname === path;
    return {
      borderRadius: '100px',
      textTransform: 'none',
      fontWeight: '600',
      padding: '6px 16px',
      // If active, use M3 Purple. If inactive, use highly visible charcoal gray
      color: isActive ? '#6750A4' : '#49454F', 
      backgroundColor: isActive ? 'rgba(103, 80, 164, 0.08)' : 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(103, 80, 164, 0.04)',
      }
    };
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#6750A4', fontWeight: 'bold' }}>
          GI Handicrafts
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/" startIcon={<HomeIcon />} sx={getButtonStyles('/')}>
            Home
          </Button>
          <Button component={Link} to="/about" startIcon={<Info />} sx={getButtonStyles('/about')}>
            About
          </Button>
          <Button component={Link} to="/shop" startIcon={<ShoppingBag />} sx={getButtonStyles('/shop')}>
            Shop
          </Button>
          <Button component={Link} to="/faq" startIcon={<Help />} sx={getButtonStyles('/faq')}>
            FAQ
          </Button>
          <Button component={Link} to="/contact" startIcon={<ContactPage />} sx={getButtonStyles('/contact')}>
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// --- 1. HOME VIEW ---
function HomeView() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h4" gutterBottom color="primary">Welcome to GI Handicrafts Explorer</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxW: '600px', mx: 'auto', mb: 4 }}>
        Discover and track authentic Geographical Indication (GI) protected crafts across regions. Beautifully cataloged and verified in real time.
      </Typography>
      <Button component={Link} to="/shop" variant="contained" size="large" startIcon={<ShoppingBag />}>
        Browse Inventory
      </Button>
    </Box>
  );
}

// --- 2. ABOUT VIEW ---
function AboutView() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>About Geographical Indications</Typography>
      <Typography variant="body1" paragraph>
        A Geographical Indication (GI) is a sign used on products that have a specific geographical origin and possess qualities or a reputation that are due to that origin.
      </Typography>
      <Typography variant="body1">
        This platform ensures artisans have their stock monitored smoothly while allowing administrative dashboards to review batch quantities dynamically.
      </Typography>
    </Box>
  );
}

// --- 3. SHOP / INVENTORY VIEW (EXCEL TAB ENGINE) ---
function ShopView({ allInventory }) {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeImage, setActiveImage] = useState(null);

  const activeTabName = tabNames[currentTabIdx];
  const items = allInventory[activeTabName] || [];

  const handleSort = (key) => {
    const isAsc = sortKey === key && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortKey(key);
  };

  const processedItems = useMemo(() => {
    let results = [...items];
    if (searchTerm) {
      results = results.filter(item => 
        Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (sortKey) {
      results.sort((a, b) => {
        let valA = a[sortKey], valB = b[sortKey];
        const numA = parseFloat(valA), numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) { valA = numA; valB = numB; }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return results;
  }, [items, searchTerm, sortKey, sortDirection]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Product Catalog</Typography>
      
      {/* M3 Style Dynamic Tabs */}
      <Tabs 
        value={currentTabIdx} 
        onChange={(e, newIdx) => { setCurrentTabIdx(newIdx); setSearchTerm(""); setSortKey(null); }}
        variant="scrollable" 
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        {tabNames.map((name, i) => <Tab label={name} key={i} />)}
      </Tabs>

      {/* Modern Search Field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder={`Search items inside ${activeTabName}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
        sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}
      />

      {/* Material Data Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(103, 80, 164, 0.05)' }}>
            <TableRow>
              {items.length > 0 && Object.keys(items[0]).map(key => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortKey === key}
                    direction={sortKey === key ? sortDirection : 'asc'}
                    onClick={() => handleSort(key)}
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}
                  >
                    {key}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedItems.length > 0 ? (
              processedItems.map((item, rIdx) => (
                <TableRow key={rIdx} hover>
                  {Object.entries(item).map(([key, val], cIdx) => {
                    const cleanKey = key.toLowerCase().replace(/[\s_]/g, '');
                    const imagePath = String(val);
                    const hasImage = imagePath.startsWith('http') || imagePath.startsWith('/images/');

                    return (
                      <TableCell key={cIdx}>
                        {cleanKey.includes('image') && hasImage ? (
                          <Button 
                            variant="outlined" 
                            color="success" 
                            size="small" 
                            startIcon={<Image />}
                            onClick={() => setActiveImage(imagePath)}
                          >
                            View
                          </Button>
                        ) : val === "" ? "-" : String(val)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No records matching your filters were found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* M3 Dialog popup overlay for On-Demand Images */}
      <Dialog open={Boolean(activeImage)} onClose={() => setActiveImage(null)} maxWidth="md">
        <Box sx={{ position: 'relative', p: 1 }}>
          <IconButton onClick={() => setActiveImage(null)} sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
            <Close />
          </IconButton>
          <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={activeImage} alt="Product Detail" style={{ maxWidth: '100%', maxHeight: '75vh', display: 'block', borderRadius: '4px' }} />
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
}

// --- 4. FAQ VIEW ---
function FaqView() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>Frequently Asked Questions</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Q: How quickly does inventory update?</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>A: Instantly. When you refresh the application, it pulls raw data straight from your master Google Sheet rows.</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Q: Are the photos eating up heavy bandwidth data?</Typography>
        <Typography variant="body2" color="text.secondary">A: No. We optimize them to WebP and use an on-demand trigger, saving you bandwidth data until you click View.</Typography>
      </Box>
    </Box>
  );
}

// --- 5. CONTACT VIEW ---
function ContactView() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>Contact Procurement & Warehousing</Typography>
      <Typography variant="body1" color="text.secondary">
        For updates regarding wholesale batches, artisan enlistment, or technical dashboard clearance, please get in touch with the central inventory operations manager.
      </Typography>
    </Box>
  );
}