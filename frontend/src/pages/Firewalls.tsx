import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { firewallApi } from '../services/firewallService';
import { FirewallConfig, FirewallType } from '../types';
import FirewallDialog from '../components/FirewallDialog';

const Firewalls: React.FC = () => {
  const [firewallConfigs, setFirewallConfigs] = useState<FirewallConfig[]>([]);
  const [firewallTypes, setFirewallTypes] = useState<FirewallType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFirewall, setSelectedFirewall] = useState<FirewallConfig | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);

  const fetchFirewalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const [configsResponse, typesResponse] = await Promise.all([
        firewallApi.getAllFirewallConfigs(),
        firewallApi.getAllFirewallTypes()
      ]);
      setFirewallConfigs(configsResponse.firewallConfigs || []);
      setFirewallTypes(typesResponse.firewallTypes || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Firewall yapılandırmaları yüklenirken bir hata oluştu');
      console.error('Error fetching firewalls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirewalls();
  }, []);

  const handleAddFirewall = () => {
    setSelectedFirewall(null);
    setOpenDialog(true);
  };

  const handleEditFirewall = (firewall: FirewallConfig) => {
    setSelectedFirewall(firewall);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFirewall(null);
  };

  const handleSaveFirewall = async () => {
    await fetchFirewalls();
    setOpenDialog(false);
  };

  const handleTestConnection = async (id: number) => {
    setTestingId(id);
    try {
      await firewallApi.testFirewallConnection(id);
      // In a real app, you would poll for the test result or use WebSockets
      setTimeout(() => {
        fetchFirewalls();
        setTestingId(null);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bağlantı testi başlatılırken bir hata oluştu');
      setTestingId(null);
    }
  };

  const getFirewallTypeName = (typeId: number) => {
    const type = firewallTypes.find(t => t.id === typeId);
    return type ? type.name : 'Bilinmeyen';
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'İsim', width: 150 },
    { 
      field: 'firewall_type_id', 
      headerName: 'Firewall Türü', 
      width: 150,
      valueGetter: (params) => getFirewallTypeName(params.row.firewall_type_id)
    },
    { field: 'ip_address', headerName: 'IP Adresi', width: 150 },
    { field: 'port', headerName: 'Port', width: 100 },
    { field: 'username', headerName: 'Kullanıcı Adı', width: 150 },
    { 
      field: 'connection_status', 
      headerName: 'Bağlantı Durumu', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ 
          color: params.row.connection_status === 'Connected' ? 'success.main' : 
                 params.row.connection_status === 'Failed' ? 'error.main' : 'text.secondary'
        }}>
          {params.row.connection_status || 'Bilinmeyen'}
        </Box>
      )
    },
    {
      field: 'is_active',
      headerName: 'Durum',
      width: 120,
      valueGetter: (params) => params.row.is_active ? 'Aktif' : 'Pasif',
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 220,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditFirewall(params.row as FirewallConfig)}
            sx={{ mr: 1 }}
          >
            Düzenle
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => handleTestConnection(params.row.id)}
            disabled={testingId === params.row.id}
          >
            {testingId === params.row.id ? <CircularProgress size={20} /> : 'Test Et'}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Firewall Yönetimi
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchFirewalls}
              sx={{ mr: 2 }}
            >
              Yenile
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFirewall}
            >
              Yeni Firewall
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ height: 500, width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={firewallConfigs}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            )}
          </Box>
        </Paper>

        {/* Firewall Dialog will be implemented as a separate component */}
        {openDialog && (
          <FirewallDialog
            open={openDialog}
            firewall={selectedFirewall}
            firewallTypes={firewallTypes}
            onClose={handleCloseDialog}
            onSave={handleSaveFirewall}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Firewalls;
