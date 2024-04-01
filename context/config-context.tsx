import React, { useState, useEffect } from "react";

export type Config = {
    bleServiceUUID: string;
    bleCharacteristicUUID: string;
    wifiSSID: string;
    wifiPassword: string;
    walletAddress: string;
    network: "mainnet" | "testnet" | "devnet";
}

type ConfigContextType = {
    config: Config;
    setConfig: (config: Config) => void;
}

const ConfigContext = React.createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<Config>({
        bleServiceUUID: "",
        bleCharacteristicUUID: "",
        wifiSSID: "",
        wifiPassword: "",
        walletAddress: "",
        network: "mainnet",
    });

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = React.useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};

export default ConfigContext;