import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { userApi } from '../services/userService';
import { User } from '../types';
import UserDialog from '../components/UserDialog';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    await fetchUsers();
    setOpenDialog(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Kullanıcı Adı', width: 150 },
    { field: 'email', headerName: 'E-posta', width: 200 },
    {
      field: 'fullName',
      headerName: 'Ad Soyad',
      width: 180,
      valueGetter: (params) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    },
    { field: 'role', headerName: 'Rol', width: 150 },
    {
      field: 'is_active',
      headerName: 'Durum',
      width: 120,
      valueGetter: (params) =>
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
          onClick={() => handleEditUser(params.row as User)}
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
            Kullanıcı Yönetimi
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              sx={{ mr: 2 }}
            >
              Yenile
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Yeni Kullanıcı
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
                rows={users}
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

        {/* User Dialog will be implemented as a separate component */}
        {openDialog && (
          <UserDialog
            open={openDialog}
            user={selectedUser}
            onClose={handleCloseDialog}
            onSave={handleSaveUser}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Users;
