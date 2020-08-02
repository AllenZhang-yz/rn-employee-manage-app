import React, { useState, FC } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, ProgressBar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import connectionToServer from '../utils/connectionToServer';
import TextInputField from '../components/TextInputField';
import { IModalStackNavigation, ModalStackParamList } from '../App';

interface IInputValues {
  name: string;
  phone: string;
  email: string;
  salary?: string;
  picture?: string;
  position?: string;
}

const validationSchema = yup.object({
  name: yup.string().trim().required('*Required'),
  phone: yup.string().required('*Required'),
  email: yup.string().email('*Invalid email format').required('*Required'),
});

const DismissKeyboard: FC = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

interface ICreateEmployeeProps {
  navigation: IModalStackNavigation;
  route: RouteProp<ModalStackParamList, 'CreateEmployee'>;
}

const CreateEmployee: FC<ICreateEmployeeProps> = ({ navigation, route }) => {
  let initialValues: IInputValues;
  if (route.params) {
    initialValues = {
      name: route.params.name,
      phone: route.params.phone,
      email: route.params.email,
      position: route.params.position,
      salary: route.params.salary,
    };
  } else {
    initialValues = {
      name: '',
      phone: '',
      email: '',
      salary: '',
      position: '',
    };
  }
  const [modal, setModal] = useState(false);
  const [picture, setPicture] = route.params
    ? useState(route.params.picture)
    : useState('');
  const [percentage, setPercentage] = useState(0);
  const [uploadFinish, setUploadFinish] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!data.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `test/${data.uri.split('.')[1]}`,
          name: `test.${data.uri.split('.')[1]}`,
        };
        handleUpload(newFile);
      }
    } else {
      Alert.alert('You need to get permission');
    }
  };

  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!data.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `test/${data.uri.split('.')[1]}`,
          name: `test.${data.uri.split('.')[1]}`,
        };
        handleUpload(newFile);
      }
    } else {
      Alert.alert('You need to get permission');
    }
  };

  const handleUpload = (image: any) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'employeeapp');
    data.append('cloud_name', 'ddq39dd0i');
    setUploadStart(true);
    axios
      .post('https://api.cloudinary.com/v1_1/ddq39dd0i/image/upload', data, {
        onUploadProgress: (e) => {
          setPercentage(Math.round((e.loaded * 100) / e.total) || 0);
        },
      })
      .then((res) => {
        setPicture(res.data.url);
        setModal(false);
        setUploadStart(false);
        setUploadFinish(true);
        setPercentage(0);
        setTimeout(() => {
          setUploadFinish(false);
        }, 1000);
      });
  };

  const onBackdropPress = () => {
    if (percentage === 0 || uploadFinish) {
      setModal(false);
    }
  };

  const submitData = async (values: IInputValues) => {
    const valuesAll = { ...values, picture };
    if (route.params) {
      try {
        setLoading(true);
        await connectionToServer.patch('/update', {
          ...valuesAll,
          id: route.params.id,
        });
        setLoading(false);
        Alert.alert(
          'Congratulations!',
          `${valuesAll.name} is updated successfully`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } catch (err) {
        Alert.alert('Employee update failed');
      }
    } else {
      try {
        setLoading(true);
        await connectionToServer.post('/send-data', valuesAll);
        setLoading(false);
        Alert.alert(
          'Congratulations!',
          `${valuesAll.name} is added successfully`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
        // navigation.navigate('Home');
      } catch (err) {
        Alert.alert('Employee data save failed');
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.root}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator />
        </View>
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={submitData}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => {
          return (
            <View>
              <View style={{ marginHorizontal: 5 }}>
                <DismissKeyboard>
                  <View>
                    <TextInputField name="name" label="Name" />
                    <TextInputField
                      name="phone"
                      label="Phone"
                      keyboardType="number-pad"
                    />
                    <TextInputField
                      name="email"
                      label="Email"
                      keyboardType="email-address"
                    />
                    <TextInputField
                      name="salary"
                      label="Salary"
                      keyboardType="number-pad"
                    />
                    <TextInputField name="position" label="Position" />
                  </View>
                </DismissKeyboard>
                <Button
                  icon={picture ? 'check' : 'upload'}
                  mode="contained"
                  style={styles.inputStyle}
                  theme={theme}
                  onPress={() => setModal(true)}
                  accessibilityStates
                >
                  Upload Image
                </Button>
                {route.params ? (
                  <Button
                    icon="content-save"
                    mode="contained"
                    style={styles.inputStyle}
                    theme={theme}
                    onPress={handleSubmit}
                    accessibilityStates
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    icon="content-save"
                    mode="contained"
                    style={styles.inputStyle}
                    theme={theme}
                    onPress={handleSubmit}
                    accessibilityStates
                  >
                    Save
                  </Button>
                )}
              </View>
            </View>
          );
        }}
      </Formik>

      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={modal}
        hasBackdrop
        backdropOpacity={0.3}
        onBackdropPress={onBackdropPress}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBtnView}>
            <Button
              icon="camera"
              mode="contained"
              theme={theme}
              disabled={uploadStart && !uploadFinish}
              onPress={() => pickFromCamera()}
              accessibilityStates
            >
              Camera
            </Button>
            <Button
              icon="image-area"
              mode="contained"
              theme={theme}
              disabled={uploadStart && !uploadFinish}
              onPress={() => pickFromGallery()}
              accessibilityStates
            >
              Gallery
            </Button>
          </View>
          <Button
            theme={theme}
            disabled={uploadStart && !uploadFinish}
            onPress={() => setModal(false)}
            accessibilityStates
          >
            cancel
          </Button>
        </View>
      </Modal>
      {uploadStart && !uploadFinish && (
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressText}>{percentage}%</Text>
          <ProgressBar
            progress={percentage / 100}
            accessibilityStates
            color="#6b34eb"
            style={styles.progressBar}
          />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const theme = {
  colors: {
    primary: '#006aff',
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  modalBackground: {
    backgroundColor: 'red',
    opacity: 0.8,
  },
  inputStyle: {
    marginVertical: 5,
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    bottom: 2,
    backgroundColor: 'white',
  },
  modalBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  progressBarContainer: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    zIndex: 10,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b34eb',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
});

export default CreateEmployee;
