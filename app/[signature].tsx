
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'tamagui';

export default function Page() {
  const { signature } = useLocalSearchParams();

  return (
    <View flex={1} alignItems='center'>
      <Text>Signature: {signature}</Text>
    </View>
  );
}
