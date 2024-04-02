import React, { useState, useEffect } from "react";
import { View, YStack } from "tamagui";
import { Alert, TouchableOpacity } from "react-native";
import { Text } from "tamagui";
import { Service, Characteristic } from "react-native-ble-plx";
import { useConfig } from "../context/config-context";
import { useNavigation } from "expo-router";
import { Toast, useToastController, useToastState } from '@tamagui/toast'

const RenderCharacteristicsComponent = ({ service }: { service: Service }) => {
  const toast = useToastController()
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
          toast.show("Characteristic selected", { duration: 1000, native: true })
          goBack();
        }}
      >
        <CurrentToast />
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

const CurrentToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}