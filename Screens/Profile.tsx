import React, { FC, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Title, Card, Button } from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { ModalStackParamList, IModalStackNavigation } from '../App';
import connectionToServer from '../utils/connectionToServer';
const defaultAvatar = require('../assets/defaultAvatar.png');

interface IProfileProps {
  route: RouteProp<ModalStackParamList, 'Profile'>;
  navigation: IModalStackNavigation;
}

const Profile: FC<IProfileProps> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const {
    id,
    name,
    picture,
    position,
    phone,
    salary,
    email,
  } = route.params.item;

  const deleteEmployee = async (id: string, name: string) => {
    try {
      setLoading(true);
      await connectionToServer.delete(`/delete/${id}`);
      setLoading(false);
      Alert.alert('Notice', `${name} was deleted successfully`, [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (err) {
      Alert.alert('Delete failed');
    }
  };

  const openDial = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };
  return (
    <View style={styles.root}>
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
      <LinearGradient
        colors={['#0033ff', '#6bc1ff']}
        style={{ height: '20%' }}
      />
      <View style={{ alignItems: 'center', marginTop: -50 }}>
        {picture ? (
          <Image
            style={{ width: 140, height: 140, borderRadius: 70 }}
            source={{ uri: picture }}
          />
        ) : (
          <Image
            style={{ width: 140, height: 140, borderRadius: 70 }}
            source={defaultAvatar}
          />
        )}
      </View>
      <View style={{ alignItems: 'center', margin: 15 }}>
        <Title>{name}</Title>
        <Text style={{ fontSize: 15 }}>{position}</Text>
      </View>
      <Card
        style={styles.myCard}
        onPress={() => Linking.openURL(`mailto:${email}`)}
        accessibilityStates
      >
        <View style={styles.cardContent}>
          <MaterialIcons name="email" size={32} color="#006aff" />
          <Text style={styles.myText}>{email}</Text>
        </View>
      </Card>
      <Card
        style={styles.myCard}
        onPress={() => openDial()}
        accessibilityStates
      >
        <View style={styles.cardContent}>
          <Entypo name="phone" size={32} color="#006aff" />
          <Text style={styles.myText}>{phone}</Text>
        </View>
      </Card>
      <Card style={styles.myCard} accessibilityStates>
        <View style={styles.cardContent}>
          <MaterialIcons name="attach-money" size={32} color="#006aff" />
          <Text style={styles.myText}>{salary}</Text>
        </View>
      </Card>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
        }}
      >
        <Button
          icon="account-edit"
          theme={theme}
          mode="contained"
          onPress={() =>
            navigation.navigate('CreateEmployee', {
              id,
              name,
              picture,
              phone,
              salary,
              email,
              position,
            })
          }
          accessibilityStates
        >
          Edit
        </Button>
        <Button
          icon="delete"
          theme={theme}
          mode="contained"
          onPress={() => deleteEmployee(id, name)}
          accessibilityStates
        >
          Delete
        </Button>
      </View>
    </View>
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
  myCard: {
    margin: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  myText: {
    fontSize: 18,
    marginLeft: 5,
  },
});

export default Profile;
