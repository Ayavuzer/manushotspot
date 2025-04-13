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
import { FirewallConfig, FirewallType } from '../types';
import { firewallApi } from '../services/firewallService';

interface FirewallDialogProps {
  open: boolean;
  firewall: FirewallConfig | null;
  firewallTypes?: FirewallType[];
  onClose: () => void;
  onSave: () => void;
}

interface FirewallFormValues {
  name: string;
  firewall_type_id: number;
  ip_address: string;
  port: number;
  username: string;
  password: string;
  api_key: string;
  organization_id: number;
  is_active: boolean;
}

const FirewallDialog: React.FC<FirewallDialogProps> = ({ 
  open, 
  firewall, 
  firewallTypes,
  onClose, 
  onSave 
}) => {
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!firewall;

  const initialValues: FirewallFormValues = {
    name: firewall?.name || '',
    firewall_type_id: firewall?.firewall_type_id || 1, // Default to Sophos
    ip_address: firewall?.ip_address || '',
    port: firewall?.port || 443,
    username: firewall?.username || '',
    password: firewall?.password || '',
    api_key: firewall?.api_key || '',
    organization_id: firewall?.organization_id || 1,
    is_active: firewall?.is_active !== undefined ? firewall.is_active : true
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Firewall adı gerekli'),
    firewall_type_id: Yup.number().required('Firewall tipi gerekli'),
    ip_address: Yup.string().required('IP adresi gerekli'),
    port: Yup.number().required('Port gerekli'),
    username: Yup.string(),
    password: Yup.string(),
    api_key: Yup.string(),
    organization_id: Yup.number().required('Organizasyon gerekli')
  });

  const handleSubmit = async (
    values: FirewallFormValues,
    { setSubmitting }: FormikHelpers<FirewallFormValues>
  ) => {
    try {
      setError(null);
      
      if (isEditMode) {
        await firewallApi.updateFirewall(firewall.id, values);
      } else {
        await firewallApi.createFirewall(values);
      }
      
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Firewall kaydedilirken bir hata oluştu');
      console.error('Error saving firewall:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Firewall Düzenle' : 'Yeni Firewall Ekle'}</DialogTitle>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="Firewall Adı"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="firewall_type_id"
                    label="Firewall Tipi"
                    type="number"
                    error={touched.firewall_type_id && Boolean(errors.firewall_type_id)}
                    helperText={touched.firewall_type_id && errors.firewall_type_id}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="ip_address"
                    label="IP Adresi"
                    error={touched.ip_address && Boolean(errors.ip_address)}
                    helperText={touched.ip_address && errors.ip_address}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="port"
                    label="Port"
                    type="number"
                    error={touched.port && Boolean(errors.port)}
                    helperText={touched.port && errors.port}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="username"
                    label="Kullanıcı Adı"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
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
                
                <Grid size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="api_key"
                    label="API Anahtarı"
                    error={touched.api_key && Boolean(errors.api_key)}
                    helperText={touched.api_key && errors.api_key}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
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
                
                <Grid size={{ xs: 12 }}>
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

export default FirewallDialog;
