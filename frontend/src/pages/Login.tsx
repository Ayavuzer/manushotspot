import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Kullanıcı adı gerekli'),
  password: Yup.string().required('Şifre gerekli')
});

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues: LoginFormValues = {
    username: '',
    password: ''
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setError(null);
      await login(values.username, values.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5">
            Hotspot Yönetim Paneli
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%', marginTop: '1rem' }}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Kullanıcı Adı"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Şifre"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || isLoading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {(isSubmitting || isLoading) ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
