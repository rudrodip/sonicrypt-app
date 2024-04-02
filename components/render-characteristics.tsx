import React, { useState, useEffect } from "react";
import { View } from "tamagui";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { Text } from "tamagui";
import { Service, Characteristic } from "react-native-ble-plx";
import { useConfig } from "../context/config-context";
import { useNavigation } from "expo-router";

const RenderCharacteristicsComponent = ({ service }: { service: Service }) => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const { config, setConfig } = useConfig();
  const [loading, setLoading] = useState(true);
  const { goBack } = useNavigation();

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const characteristics = await service.characteristics();
        setCharacteristics(characteristics);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching characteristics:", error);
      }
    };

    fetchCharacteristics();
  }, [service]);

  const renderCharacteristics = ({ item }: { item: Characteristic }) => {
    return (
      <TouchableOpacity
        key={item.uuid}
        onPress={() => {
          setConfig({
            ...config,
            bleStatus: "connected",
            bleServiceUUID: service.uuid,
            bleCharacteristicUUID: item.uuid,
          });
          Alert.alert("Characteristic selected");
          goBack();
        }}
      >
        <Text marginLeft="$3" marginVertical="$1.5" fontSize="$2">
          {item.uuid}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading ? (
        <Text textAlign="center" margin="$5">
          Loading...
        </Text>
      ) : (
        <View>
          {characteristics.map((item) => renderCharacteristics({ item }))}
        </View>
      )}
    </>
  );
};
export default RenderCharacteristicsComponent;
