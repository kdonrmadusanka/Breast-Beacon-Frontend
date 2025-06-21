import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerClinician } from '../utils/api';

// Define interfaces for form values
interface ClinicianFormValues {
  name: string;
  email: string;
  specialty: string;
  password: string;
}

interface SecretKeyFormValues {
  secretKey: string;
}

// Clinician Signup Schema
const ClinicianSignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  specialty: Yup.string().required('Specialty is required').min(3, 'Specialty must be at least 3 characters'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const ClinicianSignup: React.FC = () => {
  const navigate = useNavigate();
  const [keyVerified, setKeyVerified] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Clinician Signup
        </h2>
        {!keyVerified ? (
          <Formik<SecretKeyFormValues>
            initialValues={{ secretKey: '' }}
            validationSchema={Yup.object().shape({
              secretKey: Yup.string().required('Secret key is required'),
            })}
            onSubmit={async (values, { setFieldError, setSubmitting }) => {
              try {
                // Simulate secret key validation (handled server-side in production)
                if (values.secretKey === 'CLINICIAN2025') {
                  setKeyVerified(true);
                } else {
                  setFieldError('secretKey', 'Invalid secret key');
                }
              } catch (error) {
                setFieldError('secretKey', 'Error verifying key');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <Field
                    type="text"
                    name="secretKey"
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    placeholder="Enter the secret key"
                  />
                  <ErrorMessage name="secretKey" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition duration-300 font-semibold"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Key'}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik<ClinicianFormValues>
            initialValues={{ name: '', email: '', specialty: '', password: '' }}
            validationSchema={ClinicianSignupSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                await registerClinician({ ...values, secretKey: 'CLINICIAN2025' });
                alert('Clinician signup successful!');
                navigate('/login');
              } catch (error: any) {
                setErrors({ email: error.response?.data?.message || 'Registration failed' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                    Specialty
                  </label>
                  <Field
                    type="text"
                    name="specialty"
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    placeholder="Enter your specialty"
                  />
                  <ErrorMessage name="specialty" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition duration-300 font-semibold"
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </button>
              </Form>
            )}
          </Formik>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};