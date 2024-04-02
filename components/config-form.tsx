import {
  View,
  Input,
  Form,
  FormTrigger,
  Button,
  Label,
  Text,
} from "tamagui";
import React from "react";
import { StyleSheet } from "react-native";
import { useConfig } from "../context/config-context";
import type { Config } from "../context/config-context";
import { writeToDevice } from "../app/bluetooth-modal";
import SelectItems from "./select-items";

export default function ConfigForm() {
  const { config, setConfig } = useConfig();

  const sendMessageToDevice = async () => {
    const device = config.device;
    const serviceUUID = config.bleServiceUUID;
    const characteristicUUID = config.bleCharacteristicUUID;

    const wifiSSID = config.wifiSSID;
    const wifiPassword = config.wifiPassword;
    const walletAddress = config.walletAddress;
    const network = config.network;

    const message = JSON.stringify({
      ssid: wifiSSID,
      password: wifiPassword,
      address: walletAddress,
      net: network,
    });

    if (device && serviceUUID && characteristicUUID) {
      await writeToDevice(device, serviceUUID, characteristicUUID, message);
      await writeToDevice(device, serviceUUID, characteristicUUID, "end");
    }
  };

  const handleSelectionChange = (val: string) => {
    setConfig({...config, network: val as "mainnet-beta" | "devnet" | "testnet" })
  }

  const networks = [
    {
      label: "Main Network",
      value: "mainnet-beta",
    },
    {
      label: "Dev Network",
      value: "devnet",
    },
    {
      label: "Test Network",
      value: "testnet"
    }
  ]

  return (
    <View style={styles.formContainer}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Configuration</Text>
      <Form onSubmit={sendMessageToDevice}>
        <InputWithLabel
          configKey="wifiSSID"
          label="Wifi SSID"
          placeholder="name of your wifi"
        />
        <InputWithLabel
          configKey="wifiPassword"
          label="Wifi Password"
          placeholder="password of your wifi network"
        />
        <InputWithLabel
          configKey="walletAddress"
          label="Wallet address"
          placeholder="your wallet address"
        />
        <SelectItems 
          label="Network"
          items={networks}
          onValueChange={handleSelectionChange}
        />
        <FormTrigger asChild>
          <Button
            style={{ marginTop: 15 }}
            backgroundColor="$color"
            color="$background"
          >
            Submit
          </Button>
        </FormTrigger>
      </Form>
    </View>
  );
}

type InputProps = {
  configKey: keyof Config;
  label: string;
  placeholder: string;
};

const InputWithLabel = ({ configKey, label, placeholder }: InputProps) => {
  const { config, setConfig } = useConfig();

  return (
    <View style={styles.input}>
      <Label style={{ fontSize: 15 }}>{label}</Label>
      <Input
        placeholder={placeholder}
        onChangeText={(val) => setConfig({ ...config, [configKey]: val })}
        value={config[configKey] as string}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    borderRadius: 5,
    width: "100%",
  },
});
