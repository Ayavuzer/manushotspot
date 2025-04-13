import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid as MuiGrid,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Organization } from '../types';
import { organizationApi } from '../services/organizationService';

interface OrganizationDialogProps {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
  onSave: () => void;
}

interface OrganizationFormValues {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  is_active: boolean;
}

const OrganizationDialog: React.FC<OrganizationDialogProps> = ({ 
  open, 
  organization, 
  onClose, 
  onSave 
}) => {
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!organization;

  const initialValues: OrganizationFormValues = {
    name: organization?.name || '',
    description: organization?.description || '',
    address: organization?.address || '',
    phone: organization?.phone || '',
    email: organization?.email || '',
    logo_url: organization?.logo_url || '',
    is_active: organization?.is_active !== undefined ? organization.is_active : true
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Organizasyon adı gerekli'),
    email: Yup.string().email('Geçerli bir e-posta adresi girin'),
    phone: Yup.string(),
    address: Yup.string(),
    description: Yup.string(),
    logo_url: Yup.string().url('Geçerli bir URL girin').nullable()
  });

  const handleSubmit = async (
    values: OrganizationFormValues,
    { setSubmitting }: FormikHelpers<OrganizationFormValues>
  ) => {
    try {
      setError(null);
      
      if (isEditMode) {
        await organizationApi.updateOrganization(organization.id, values);
      } else {
        await organizationApi.createOrganization(values);
      }
      
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Organizasyon kaydedilirken bir hata oluştu');
      console.error('Error saving organization:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Organizasyon Düzenle' : 'Yeni Organizasyon Ekle'}</DialogTitle>
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
              
              <MuiGrid container spacing={2}>
                <MuiGrid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="Organizasyon Adı"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    label="E-posta"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="phone"
                    label="Telefon"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="address"
                    label="Adres"
                    multiline
                    rows={2}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="description"
                    label="Açıklama"
                    multiline
                    rows={3}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="logo_url"
                    label="Logo URL"
                    error={touched.logo_url && Boolean(errors.logo_url)}
                    helperText={touched.logo_url && errors.logo_url}
                  />
                </MuiGrid>
                
                <MuiGrid item xs={12}>
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
                </MuiGrid>
              </MuiGrid>
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

export default OrganizationDialog;
