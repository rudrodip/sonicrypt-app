import { ChevronDown } from "@tamagui/lucide-icons";
import { Accordion, Square, ScrollView, View, Text, Button } from "tamagui";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, Service } from "react-native-ble-plx";
import { useState, useEffect } from "react";
import { useConfig } from "../context/config-context";
import RenderCharacteristicsComponent from "../components/render-characteristics";
import base64 from "react-native-base64";

const bleManager = new BleManager();

export default function ModalScreen() {
  const { config, setConfig } = useConfig();
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        requestPermissions(() => setIsScanning(true));
        setConfig({ ...config, bleStatus: "disconnected" });
      } else {
        Alert.alert("BLE is not enabled");
      }
    }, true);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isScanning) {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          setIsScanning(false);
        } else if (device) {
          setDevices((prevDevices) => {
            const isDeviceAlreadyAdded = prevDevices.some(
              (d) => d.id === device.id
            );
            if (!isDeviceAlreadyAdded) {
              const updatedDevices = [...prevDevices, device];
              return updatedDevices;
            }
            return prevDevices;
          });
        }
      });

      return () => {
        bleManager.stopDeviceScan();
      };
    }

    return undefined;
  }, [isScanning]);

  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      setConnectedDevice(device);
      setConfig({ ...config, bleStatus: "connected" });
      setConfig({ ...config, device: device });

      await bleManager.connectToDevice(device.id);
      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();
      setServices(services);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <Button
        onPress={() => setIsScanning(!isScanning)}
        backgroundColor={isScanning ? "$accentBackground" : "$color"}
        color={isScanning ? "$color" : "$accentBackground"}
      >
        {isScanning ? "Scanning" : "Scan devices"}
      </Button>
      <Accordion
        overflow="hidden"
        width="unset"
        gap="$2"
        marginTop="$5"
        type="multiple"
      >
        {devices.length === 0 && (
          <Text fontSize="$5" textAlign="center">
            No devices found
          </Text>
        )}
        {devices.map((device) => {
          return (
            <Accordion.Item
              value={device.id}
              key={device.id}
              borderRadius="$5"
              borderWidth="$0.25"
              borderColor="$color"
            >
              <Accordion.Trigger
                flexDirection="row"
                justifyContent="space-between"
                borderWidth="$0"
                borderRadius="$5"
                backfaceVisibility="hidden"
                onPress={() =>
                  connectedDevice?.id !== device.id && connectToDevice(device)
                }
                disabled={!!connectedDevice}
              >
                {({ open }: { open: boolean }) => (
                  <>
                    <View>
                      <Text>{device.name || "Anonymous"}</Text>
                      <Text fontSize="$1" color="$color075" marginLeft="$1">
                        {device.id}
                      </Text>
                    </View>
                    <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                      <ChevronDown size="$1" />
                    </Square>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.Content borderRadius="$5">
                {!loading ? (
                  services.reverse().map((service) => {
                    return (
                      <View key={service.uuid}>
                        <View
                          display="flex"
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          marginVertical="$2"
                          borderBottomWidth="$0.25"
                          borderColor={"$color"}
                        >
                          <Text fontSize="$3">{service.uuid}</Text>
                          <ChevronDown size="$1" />
                        </View>
                        <RenderCharacteristicsComponent service={service} />
                      </View>
                    );
                  })
                ) : (
                  <Text textAlign="center" margin="$5">
                    Loading...
                  </Text>
                )}
              </Accordion.Content>
              {connectedDevice?.id === device.id && (
                <Button
                  backgroundColor="$red10"
                  borderTopRightRadius="$0"
                  borderTopLeftRadius="$0"
                  onPress={disconnectDevice}
                >
                  Disconnect
                </Button>
              )}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </ScrollView>
  );
}

const requestPermissions = async (callback: () => void) => {
  if (Platform.OS === "ios") {
    callback();
    return true;
  }
  if (
    Platform.OS === "android" &&
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ) {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      callback();

      return (
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  }
  return false;
};

export const writeToDevice = async (
  device: Device,
  serviceUUID: string,
  characteristicUUID: string,
  message: string
) => {
  const maxMessageLength = 20;

  try {
    // divide message into chunks
    const messageChunks = message.match(
      new RegExp(`.{1,${maxMessageLength}}`, "g")
    );
    if (!messageChunks) {
      return;
    }
    console.log(messageChunks);
    for (const chunk of messageChunks) {
      console.log(chunk);
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64.encode(chunk)
      );
    }
  } catch (error) {
    console.error(error);
  }
};
