import React, { FC } from 'react';
import { Text, View, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextInput } from 'react-native-paper';

interface ITextInputFieldProps {
  name: string;
  label: string;
  keyboardType?: KeyboardTypeOptions;
}

const TextInputField: FC<ITextInputFieldProps> = ({
  name,
  label,
  keyboardType,
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Field name={name}>
        {({ form, field }: FieldProps) => {
          const { setFieldValue, setFieldTouched } = form;
          const { value } = field;
          return (
            <TextInput
              mode="outlined"
              label={label}
              theme={theme}
              value={value}
              keyboardType={keyboardType}
              autoCapitalize="none"
              onChangeText={(val) => setFieldValue(name, val)}
              onBlur={() => setFieldTouched(name, true)}
              accessibilityStates
            />
          );
        }}
      </Field>
      <Text style={styles.error}>
        <ErrorMessage name={name} />
      </Text>
    </View>
  );
};

const theme = {
  colors: {
    primary: '#006aff',
  },
};

const styles = StyleSheet.create({
  fieldContainer: {
    height: 80,
    marginVertical: 5,
  },
  inputStyle: {
    margin: 5,
  },
  error: {
    color: 'red',
    marginTop: 1,
  },
});

export default TextInputField;
