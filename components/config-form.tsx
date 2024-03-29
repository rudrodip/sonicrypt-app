import {
  Text,
  View,
  Input,
  YStack,
  XStack,
  Select,
  Separator,
  Label,
  Adapt,
  Sheet,
} from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import React from "react";

export default function ConfigForm() {
  const [selectedValue, setSelectedValue] = React.useState("mainnet");

  return (
    <View flex={1} alignItems="center" padding="$4">
      <Text fontSize={20} fontWeight="bold" marginBottom="$4">
        Sonicrypt
      </Text>

      <YStack width="100%" maxWidth={500} gap="$2">
        <Input placeholder="Wifi SSID" />
        <Input placeholder="Wifi Password" />
        <Input placeholder="Wallet Address" />

        <YStack style={{ position: "relative" }}>
          <Select
            id="network"
            value={selectedValue}
            onValueChange={setSelectedValue}
          >
            <Select.Trigger f={1} iconAfter={ChevronDown}>
              <Select.Value placeholder="Network" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet
                native={true}
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
                <LinearGradient
                  start={[0, 0]}
                  end={[0, 1]}
                  fullscreen
                  colors={["$background", "transparent"]}
                  borderRadius="$4"
                />
              </Select.ScrollUpButton>
              <Select.Viewport
                animation="quick"
                animateOnly={["transform", "opacity"]}
                enterStyle={{ o: 0, y: -10 }}
                exitStyle={{ o: 0, y: 10 }}
                minWidth={200}
              >
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item index={1} key="mainnet" value="mainnet">
                    <Select.ItemText>mainnet</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item index={2} key="devnet" value="devnet">
                    <Select.ItemText>devnet</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item index={3} key="testnet" value="testnet">
                    <Select.ItemText>testnet</Select.ItemText>
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
                <LinearGradient
                  start={[0, 0]}
                  end={[0, 1]}
                  fullscreen
                  colors={["transparent", "$background"]}
                  borderRadius="$4"
                />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </YStack>
      </YStack>
    </View>
  );
}
