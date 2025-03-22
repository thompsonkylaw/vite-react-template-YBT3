import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import Login from './Login';
import Input from './Input';
import UseInflation from './UseInflation';
import OutputTable from './OutputTable';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const App = () => {
  const { t } = useTranslation();
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  const [useInflation, setUseInflation] = useState(true);
  const [inputs, setInputs] = useState({
    year: '2025',
    plan: 'Smart',
    age: 40,
    deductible: 22800,
    numberOfYears: 15,
    inflationRate: 6,
    currencyRate: 7.85
  });
  const [outputData, setOutputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('http://localhost:8000/getData', {
          year: inputs.year,
          plan: inputs.plan,
          age: inputs.age,
          deductible: inputs.deductible,
          numberOfYears: inputs.numberOfYears
        });
        setOutputData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inputs.year, inputs.plan, inputs.age, inputs.deductible, inputs.numberOfYears]);

  const handleInflationRateChange = (value) => {
    setInputs(prev => ({ ...prev, inflationRate: value }));
  };

  const handleCurrencyRateChange = (value) => {
    setInputs(prev => ({ ...prev, currencyRate: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        width: '100%',
        backgroundColor: appBarColor,
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {
              window.location.href = "https://portal.aimarketings.io/tool-list/";
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            {t('Medical Financial Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - Input Form and Results */}
          <Grid item xs={12} md={8}>
            <Input
              inputs={inputs}
              setInputs={setInputs}
              appBarColor={appBarColor}
            />
            
            {/* Loading and Results Section */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {!loading && !error && outputData.length > 0 && (
              <OutputTable 
                outputData={outputData} 
                currencyRate={inputs.currencyRate} 
                numberOfYears={inputs.numberOfYears}
                useInflation={useInflation}
                inflationRate ={inputs.inflationRate}
              />
            )}
          </Grid>

          {/* Right Column - Financial Adjustments */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <UseInflation
                inflationRate={inputs.inflationRate}
                currencyRate={inputs.currencyRate}
                useInflation={useInflation}
                setUseInflation={setUseInflation}
                onInflationRateChange={handleInflationRateChange}
                onCurrencyRateChange={handleCurrencyRateChange}
              />
            </Card>
          </Grid>
        </Grid>

        <Login />
      </Container>
    </ThemeProvider>
  );
};

export default App;