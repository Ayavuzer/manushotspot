import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Grid, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { organizationApi } from '../services/organizationService';
import { Organization } from '../types';
import OrganizationDialog from '../components/OrganizationDialog';

const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await organizationApi.getAllOrganizations();
      setOrganizations(response.organizations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Organizasyonlar yüklenirken bir hata oluştu');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAddOrganization = () => {
    setSelectedOrganization(null);
    setOpenDialog(true);
  };

  const handleEditOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrganization(null);
  };

  const handleSaveOrganization = async () => {
    await fetchOrganizations();
    setOpenDialog(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'İsim', width: 200 },
    { field: 'email', headerName: 'E-posta', width: 200 },
    { field: 'phone', headerName: 'Telefon', width: 150 },
    { field: 'address', headerName: 'Adres', width: 250 },
    {
      field: 'is_active',
      headerName: 'Durum',
      width: 120,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.is_active ? 'Aktif' : 'Pasif',
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditOrganization(params.row as Organization)}
        >
          Düzenle
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Organizasyon Yönetimi
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchOrganizations}
              sx={{ mr: 2 }}
            >
              Yenile
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOrganization}
            >
              Yeni Organizasyon
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
                rows={organizations}
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

        {openDialog && (
          <OrganizationDialog
            open={openDialog}
            organization={selectedOrganization}
            onClose={handleCloseDialog}
            onSave={handleSaveOrganization}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Organizations;
