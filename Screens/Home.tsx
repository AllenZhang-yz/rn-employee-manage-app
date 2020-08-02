import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import connectionToServer from '../utils/connectionToServer';
import { IModalStackNavigation } from '../App';
const defaultAvatar = require('../assets/defaultAvatar.png');

export interface IItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  salary: string;
  position: string;
  picture: string;
}

interface IHomeProps {
  navigation: IModalStackNavigation;
}

const Home: FC<IHomeProps> = ({ navigation }) => {
  const [fetchedData, setFetchedData] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const { data }: { data: IItem[] } = await connectionToServer.get('/');
      setFetchedData(data);
      setLoading(false);
    } catch (err) {
      Alert.alert('Connection to the server failed');
    }
  };

  useEffect(() => {
    getData();
  });

  const swipeDelete = async (id: string) => {
    try {
      await connectionToServer.delete(`/delete/${id}`);
    } catch (err) {
      Alert.alert('Delete failed');
    }
  };

  const renderItem = ({ item }: { item: IItem }) => (
    <Card
      style={styles.myCard}
      onPress={() => navigation.navigate('Profile', { item })}
      accessibilityStates
    >
      <View style={styles.cardView}>
        {item.picture ? (
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={{ uri: item.picture } || defaultAvatar}
          />
        ) : (
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={defaultAvatar}
          />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.text}>{item.name}</Text>
          <Text>{item.position}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <SwipeListView
        useFlatList={true}
        data={fetchedData}
        renderItem={renderItem}
        renderHiddenItem={(rowData, rowMap) => (
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => swipeDelete(rowData.item.id)}
          >
            <Text style={styles.delText}>Delete</Text>
          </TouchableOpacity>
        )}
        useNativeDriver={false}
        rightOpenValue={-75}
        stopRightSwipe={-75}
        keyExtractor={(item: IItem) => item.id}
        onRefresh={() => getData()}
        refreshing={loading}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        theme={{ colors: { accent: '#006aff' } }}
        onPress={() => navigation.navigate('CreateEmployee')}
        accessibilityStates
      />
    </View>
  );
};

const styles = StyleSheet.create({
  myCard: {
    margin: 5,
  },
  cardView: {
    flexDirection: 'row',
    padding: 6,
  },
  text: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  backRow: {
    margin: 5,
    width: 77,
    height: 71,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Home;
