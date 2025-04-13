import React from 'react';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 140,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gösterge Paneli
        </Typography>
        
        <Grid container spacing={3}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={3}>
              <Typography variant="h6" color="primary">
                Aktif Kullanıcılar
              </Typography>
              <Typography variant="h3">0</Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={3}>
              <Typography variant="h6" color="primary">
                Toplam Oturumlar
              </Typography>
              <Typography variant="h3">0</Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={3}>
              <Typography variant="h6" color="primary">
                Firewall Bağlantıları
              </Typography>
              <Typography variant="h3">0</Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard elevation={3}>
              <Typography variant="h6" color="primary">
                Organizasyonlar
              </Typography>
              <Typography variant="h3">0</Typography>
            </StatCard>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Son Aktiviteler
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Henüz aktivite bulunmuyor.
              </Typography>
            </StyledPaper>
          </Grid>
          
          {/* System Status */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Sistem Durumu
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Backend:</strong> Çalışıyor
                </Typography>
                <Typography variant="body2">
                  <strong>Veritabanı:</strong> Bağlı
                </Typography>
                <Typography variant="body2">
                  <strong>Redis:</strong> Bağlı
                </Typography>
                <Typography variant="body2">
                  <strong>RabbitMQ:</strong> Bağlı
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
