import { Label, Select, Adapt, Sheet, YStack } from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React, { useState } from "react";

type SelectItemProps = {
  label: string | null;
  items: {
    label: string;
    value: any;
  }[];
  onValueChange: (val: string) => void;
};

export default function SelectItems({
  label,
  items,
  onValueChange,
}: SelectItemProps) {
  const [val, setVal] = useState(items[0].value);

  return (
    <Select value={val} onValueChange={
      (val) => {
        setVal(val);
        onValueChange(val);
      }
    }>
      <Label>{label}</Label>
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder={label} />
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
            animation="quick"
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
          animation="quick"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>{label}</Select.Label>
            {items.map((item, index) => {
              return (
                <Select.Item key={item.value} index={index} value={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
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
  );
}
