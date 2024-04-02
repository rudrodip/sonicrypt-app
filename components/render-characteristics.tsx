import React, { useState, useEffect, useContext } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Text } from "tamagui";
import { Service, Characteristic } from "react-native-ble-plx";
import ConfigContext from "../context/config-context";

const RenderCharacteristicsComponent = ({ service }: { service: Service }) => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const configContext = useContext(ConfigContext);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const characteristics = await service.characteristics();
        setCharacteristics(characteristics);
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
        onPress={() =>
          configContext?.setConfig({
            ...configContext.config,
            bleServiceUUID: service.uuid,
            bleCharacteristicUUID: item.uuid,
          })
        }
      >
        <Text marginLeft="$3" marginVertical="$1.5" fontSize="$2">
          {item.uuid}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={characteristics}
      renderItem={renderCharacteristics}
      keyExtractor={(item) => item.uuid}
    />
  );
};

export default RenderCharacteristicsComponent;
