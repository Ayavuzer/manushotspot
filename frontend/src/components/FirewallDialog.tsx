import React, { useState } from 'react';
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
import { FirewallConfig, FirewallType, FirewallConfigRequest } from '../types';
import { firewallApi } from '../services/firewallService';

interface FirewallDialogProps {
  open: boolean;
  firewall: FirewallConfig | null;
  firewallTypes: FirewallType[];
  onClose: () => void;
  onSave: () => void;
}

interface FirewallFormValues {
  name: string;
  firewall_type_id: number;
  ip_address: string;
  port: string;
  username: string;
  password: string;
  api_key: string;
  is_active: boolean;
  organization_id: number;
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
    firewall_type_id: firewall?.firewall_type_id || (firewallTypes[0]?.id || 1),
    ip_address: firewall?.ip_address || '',
    port: firewall?.port?.toString() || '',
    username: firewall?.username || '',
    password: '',
    api_key: '',
    is_active: firewall?.is_active !== undefined ? firewall.is_active : true,
    organization_id: firewall?.organization_id || 1
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Firewall adı gerekli'),
    firewall_type_id: Yup.number().required('Firewall türü seçimi gerekli'),
    ip_address: Yup.string().required('IP adresi gerekli'),
    port: Yup.string(),
    username: Yup.string(),
    password: isEditMode ? Yup.string() : Yup.string(),
    api_key: Yup.string(),
    organization_id: Yup.number().required('Organizasyon seçimi gerekli')
  });

  const handleSubmit = async (
    values: FirewallFormValues,
    { setSubmitting }: FormikHelpers<FirewallFormValues>
  ) => {
    try {
      setError(null);
      
      // Convert port to number if provided
      const port = values.port ? parseInt(values.port) : undefined;
      
      // Prepare data for API
      const data: FirewallConfigRequest = {
        name: values.name,
        firewall_type_id: values.firewall_type_id,
        ip_address: values.ip_address,
        port,
        username: values.username || undefined,
        organization_id: values.organization_id,
        is_active: values.is_active
      };
      
      // Only include password and api_key if provided
      if (values.password) {
        data.password = values.password;
      }
      
      if (values.api_key) {
        data.api_key = values.api_key;
      }
      
      if (isEditMode) {
        await firewallApi.updateFirewallConfig(firewall.id, data);
      } else {
        await firewallApi.createFirewallConfig(data);
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
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="Firewall Adı"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.firewall_type_id && Boolean(errors.firewall_type_id)}>
                    <InputLabel>Firewall Türü</InputLabel>
                    <Select
                      name="firewall_type_id"
                      value={values.firewall_type_id}
                      onChange={handleChange}
                      label="Firewall Türü"
                    >
                      {firewallTypes.map(type => (
                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                      ))}
                    </Select>
                    {touched.firewall_type_id && errors.firewall_type_id && (
                      <FormHelperText>{errors.firewall_type_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="ip_address"
                    label="IP Adresi"
                    error={touched.ip_address && Boolean(errors.ip_address)}
                    helperText={touched.ip_address && errors.ip_address}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
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
                    name="password"
                    label={isEditMode ? "Şifre (değiştirmek için doldurun)" : "Şifre"}
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="api_key"
                    label={isEditMode ? "API Anahtarı (değiştirmek için doldurun)" : "API Anahtarı"}
                    error={touched.api_key && Boolean(errors.api_key)}
                    helperText={touched.api_key && errors.api_key}
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

export default FirewallDialog;
