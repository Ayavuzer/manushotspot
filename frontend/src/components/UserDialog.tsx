import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { User } from '../types';
import { userApi } from '../services/userService';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

interface UserFormValues {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role_id: number;
  organization_id: number;
  is_active: boolean;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, user, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<{id: number, name: string}[]>([
    { id: 1, name: 'Super Admin' },
    { id: 2, name: 'Organization Admin' },
    { id: 3, name: 'Manager' },
    { id: 4, name: 'Staff' },
    { id: 5, name: 'Read Only' }
  ]);
  const [organizations, setOrganizations] = useState<{id: number, name: string}[]>([
    { id: 1, name: 'Demo Organization' }
  ]);

  const isEditMode = !!user;

  const initialValues: UserFormValues = {
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    role_id: user?.role_id || 4,
    organization_id: user?.organization_id || 1,
    is_active: user?.is_active !== undefined ? user.is_active : true
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Kullanıcı adı gerekli'),
    email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta gerekli'),
    password: isEditMode 
      ? Yup.string() 
      : Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gerekli'),
    first_name: Yup.string(),
    last_name: Yup.string(),
    phone: Yup.string(),
    role_id: Yup.number().required('Rol seçimi gerekli'),
    organization_id: Yup.number().required('Organizasyon seçimi gerekli')
  });

  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>
  ) => {
    try {
      setError(null);
      
      if (isEditMode) {
        // If editing and password is empty, remove it from values
        if (!values.password) {
          const { password, ...dataWithoutPassword } = values;
          await userApi.updateUser(user.id, dataWithoutPassword);
        } else {
          await userApi.updateUser(user.id, values);
        }
      } else {
        await userApi.createUser(values);
      }
      
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcı kaydedilirken bir hata oluştu');
      console.error('Error saving user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, values, handleChange }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="username"
                    label="Kullanıcı Adı"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    disabled={isEditMode}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label="E-posta"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="password"
                    label={isEditMode ? "Şifre (değiştirmek için doldurun)" : "Şifre"}
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.role_id && Boolean(errors.role_id)}>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="role_id"
                      value={values.role_id}
                      onChange={handleChange}
                      label="Rol"
                    >
                      {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                      ))}
                    </Select>
                    {touched.role_id && errors.role_id && (
                      <FormHelperText>{errors.role_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="first_name"
                    label="Ad"
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="last_name"
                    label="Soyad"
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="phone"
                    label="Telefon"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.organization_id && Boolean(errors.organization_id)}>
                    <InputLabel>Organizasyon</InputLabel>
                    <Select
                      name="organization_id"
                      value={values.organization_id}
                      onChange={handleChange}
                      label="Organizasyon"
                    >
                      {organizations.map(org => (
                        <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                      ))}
                    </Select>
                    {touched.organization_id && errors.organization_id && (
                      <FormHelperText>{errors.organization_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_active"
                        checked={values.is_active}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Aktif"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose}>İptal</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Kaydet'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserDialog;
