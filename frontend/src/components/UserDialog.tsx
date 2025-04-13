import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid,
  FormControlLabel,
  Switch,
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

const UserDialog: React.FC<UserDialogProps> = ({ 
  open, 
  user, 
  onClose, 
  onSave 
}) => {
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!user;

  const initialValues: UserFormValues = {
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    role_id: user?.role_id || 2, // Default to Organization Admin
    organization_id: user?.organization_id || 1,
    is_active: user?.is_active !== undefined ? user.is_active : true
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Kullanıcı adı gerekli'),
    email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta gerekli'),
    password: isEditMode ? Yup.string() : Yup.string().required('Şifre gerekli'),
    first_name: Yup.string(),
    last_name: Yup.string(),
    phone: Yup.string(),
    role_id: Yup.number().required('Rol gerekli'),
    organization_id: Yup.number().required('Organizasyon gerekli')
  });

  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>
  ) => {
    try {
      setError(null);
      
      if (isEditMode) {
        await userApi.updateUser(user.id, values);
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
                    label="Şifre"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
                    name="role_id"
                    label="Rol ID"
                    type="number"
                    error={touched.role_id && Boolean(errors.role_id)}
                    helperText={touched.role_id && errors.role_id}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="organization_id"
                    label="Organizasyon ID"
                    type="number"
                    error={touched.organization_id && Boolean(errors.organization_id)}
                    helperText={touched.organization_id && errors.organization_id}
                  />
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
