// src/components/ImprovedForm.tsx
// Улучшенная система форм с валидацией и анимациями

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Validator } from '../utils/validators';
import { createError, ErrorType } from '../utils/errorHandler';
import { ImprovedButton } from './ImprovedButton';
import { logError } from '../utils/logger';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'phone' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => { isValid: boolean; errors: string[] };
  value?: string;
  error?: string;
}

export interface ImprovedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitText?: string;
  loading?: boolean;
  style?: any;
  showValidation?: boolean;
  animated?: boolean;
}

export const ImprovedForm: React.FC<ImprovedFormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  style,
  showValidation = true,
  animated = true,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDefaultValidation = (type: FormField['type']) => {
    switch (type) {
      case 'email':
        return (value: string) => Validator.email(value);
      case 'password':
        return (value: string) => Validator.password(value);
      case 'phone':
        return (value: string) => Validator.phone(value);
      case 'number':
        return (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num)) {
            return { isValid: false, errors: ['Must be a valid number'] };
          }
          return { isValid: true, errors: [] };
        };
      default:
        return (value: string) => {
          if (!value || value.trim().length === 0) {
            return { isValid: false, errors: ['This field is required'] };
          }
          return { isValid: true, errors: [] };
        };
    }
  };

  const validateField = useCallback((name: string, value: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return { isValid: true, errors: [] };

    const validation = field.validation || getDefaultValidation(field.type);
    return validation(value);
  }, [fields]);

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (showValidation) {
      const validation = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: validation.isValid ? '' : validation.errors[0]
      }));
    }
  }, [validateField, showValidation]);

  const handleFieldBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.name] || '';
      const validation = validateField(field.name, value);
      
      if (!validation.isValid) {
        newErrors[field.name] = validation.errors[0];
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, formData, validateField]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      
      if (!validateForm()) {
        logError('Form validation failed', { errors });
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      const appError = createError(
        ErrorType.VALIDATION,
        'Form submission failed',
        'FORM_SUBMISSION_ERROR',
        { formData, error: error instanceof Error ? error.message : String(error) }
      );
      logError('Form submission error', appError);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm, errors]);

  const renderField = (field: FormField, index: number) => {
    const value = formData[field.name] || field.value || '';
    const error = errors[field.name] || field.error || '';
    const isTouched = touched[field.name] || false;
    const showError = showValidation && isTouched && error;

    return (
      <Animated.View
        key={field.name}
        style={[
          styles.fieldContainer,
          animated && {
            opacity: new Animated.Value(0),
            transform: [{ translateY: new Animated.Value(20) }],
          },
        ]}
      >
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              showError && styles.inputError,
            ]}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(text) => handleFieldChange(field.name, text)}
            onBlur={() => handleFieldBlur(field.name)}
            secureTextEntry={field.type === 'password'}
            keyboardType={
              field.type === 'email' ? 'email-address' :
              field.type === 'number' ? 'numeric' :
              field.type === 'phone' ? 'phone-pad' :
              'default'
            }
            autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
            autoCorrect={field.type !== 'email'}
          />
        </View>
        
        {showError && (
          <Animated.View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {fields.map((field, index) => renderField(field, index))}
        
        <ImprovedButton
          title={submitText}
          onPress={handleSubmit}
          loading={loading || isSubmitting}
          disabled={loading || isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
  },
  submitButton: {
    marginTop: 24,
  },
});