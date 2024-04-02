import {
  View,
  Input,
  Form,
  FormTrigger,
  Button,
  Label,
  Text,
  Select,
  Adapt,
  Sheet,
  YStack,
} from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { useConfig } from "../context/config-context";
import type { Config } from "../context/config-context";
import { writeToDevice } from "../app/bluetooth-modal";

export default function ConfigForm() {
  const { config, setConfig } = useConfig();

  const sendMessageToDevice = async () => {
    console.log(config);
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
        <Select
          value="mainnet"
          onValueChange={(val: "mainnet" | "devnet" | "testnet") =>
            setConfig({ ...config, network: val })
          }
        >
          <Label>Network</Label>
          <Select.Trigger width="unset" iconAfter={ChevronDown}>
            <Select.Value placeholder="network" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet
              native={false}
              modal
              dismissOnSnapToBottom
              animationConfig={{
                type: "spring",
                damping: 20,
                mass: 1.2,
                stiffness: 250,
              }}
            >
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Sheet>
          </Adapt>
          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3"
            >
              <YStack zIndex={10}>
                <ChevronUp size={20} />
              </YStack>
            </Select.ScrollUpButton>

            <Select.Viewport
              // to do animations:
              animation="quick"
              animateOnly={["transform", "opacity"]}
              enterStyle={{ o: 0, y: -10 }}
              exitStyle={{ o: 0, y: 10 }}
              minWidth={200}
            >
              <Select.Group>
                <Select.Label>Blockchain network</Select.Label>
                <Select.Item index={1} value="mainnet">
                  <Select.ItemText>Main net</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item index={1} value="devnet">
                  <Select.ItemText>Dev net</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item index={1} value="testnet">
                  <Select.ItemText>Testnet net</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3"
            >
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
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
