import { Wallet2 } from '@tamagui/lucide-icons';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'tamagui';

import { useAuthorization } from '../utils/useAuthorization';
import { useMobileWallet } from '../utils/useMobileWallet';

export default function WalletConnectButton() {
  const { authorizeSession, selectedAccount } = useAuthorization();
  const { connect, disconnect } = useMobileWallet();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);

  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }

      if (selectedAccount) {
        await disconnect();
        return;
      }
      setAuthorizationInProgress(true);
      await connect();
    } catch (err: any) {
      console.log(err);
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizationInProgress, authorizeSession]);

  return (
    <Button
      style={styles.button}
      backgroundColor={selectedAccount ? '$color' : '$background'}
      disabled={authorizationInProgress}
      onPress={handleConnectPress}
    >
      <Wallet2 color={selectedAccount ? '$background' : '$color'} />
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
