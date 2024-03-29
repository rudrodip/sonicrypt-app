import ConfigForm from "../../components/config-form";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

const bleManager = new BleManager();

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        requestPermissions();
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
          console.log("Found device:", device.name || device.id);
          console.log("here it is")
          console.log(devices.map((d) => d.id));
          setDevices((prevDevices) => {
            const isDeviceAlreadyAdded = prevDevices.some(
              (d) => d.id === device.id
            );
            if (!isDeviceAlreadyAdded) {
              const updatedDevices = [...prevDevices, device];
              console.log("Updated devices:", updatedDevices);
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

  const requestPermissions = async () => {
    if (Platform.OS === "ios") {
      scanDevices();
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

        scanDevices();

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

  const scanDevices = () => {
    setIsScanning(true);
  };

  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      setConnectedDevice(device);
      await bleManager.connectToDevice(device.id);
      const services = await device.discoverAllServicesAndCharacteristics();
      console.log("Services:", services);
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

  const renderDeviceItem = ({ item }: { item: Device }) => {
    return (
      <TouchableOpacity
        onPress={() => connectToDevice(item)}
        disabled={!!connectedDevice}
      >
        <Text>{item.name || item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={scanDevices}
          disabled={isScanning}
        >
          <Text>{isScanning ? "Scanning..." : "Scan Devices"}</Text>
        </TouchableOpacity>
        {devices.length > 0 ? (
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      ) : (
        <Text>No devices found</Text>
      )}
        {connectedDevice && (
          <View>
            <Text>
              Connected to: {connectedDevice.name || connectedDevice.id}
            </Text>
            <TouchableOpacity onPress={disconnectDevice}>
              <Text>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ConfigForm />
    </View>
  );
}