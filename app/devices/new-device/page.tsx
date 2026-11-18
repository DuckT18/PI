"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import {
  ArrowLeftIcon,
  BluetoothIcon,
  CheckIcon,
  DongleIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  RefreshIcon,
  WifiIcon,
  getDeviceIcon,
} from "@/components/icons";
import {
  rooms as fallbackRooms,
  type Device,
  type DeviceConnectionType,
  type DeviceType,
  type Room,
} from "@/data/mockData";
import { createDevice } from "@/lib/api";
import { markNewDeviceAsFavorite } from "@/lib/favorites";
import { useApi } from "@/lib/useApi";

interface DeviceTypeOption {
  type: DeviceType;
  label: string;
  codePrefix: string;
  placeholder: string;
}

interface BluetoothCandidate {
  id: string;
  name: string;
  code: string;
  signal: number;
  detail: string;
}

interface DongleReceptor {
  id: string;
  name: string;
  band: string;
}

const CURRENT_WIFI_SSID = "Automate_Home_5G";

const DEVICE_TYPES: DeviceTypeOption[] = [
  {
    type: "portable",
    label: "Portáteis",
    codePrefix: "PRT",
    placeholder: "Ex: Fone Bluetooth, Smartwatch, Teclado...",
  },
  {
    type: "light",
    label: "Iluminação",
    codePrefix: "LUZ",
    placeholder: "Ex: Luz do Teto",
  },
  {
    type: "ac",
    label: "Ar Condicionado",
    codePrefix: "ARC",
    placeholder: "Ex: Ar Condicionado Quarto",
  },
  {
    type: "tv",
    label: "Smart TV",
    codePrefix: "TVS",
    placeholder: "Ex: Smart TV Sala",
  },
  {
    type: "speaker",
    label: "Caixa de Som",
    codePrefix: "SOM",
    placeholder: "Ex: Caixa de Som Estúdio",
  },
  {
    type: "camera",
    label: "Câmera",
    codePrefix: "CAM",
    placeholder: "Ex: Câmera da Entrada",
  },
  {
    type: "lock",
    label: "Fechadura",
    codePrefix: "FEC",
    placeholder: "Ex: Fechadura Principal",
  },
  {
    type: "sensor",
    label: "Sensor",
    codePrefix: "SEN",
    placeholder: "Ex: Sensor de Movimento",
  },
  {
    type: "plug",
    label: "Tomada",
    codePrefix: "TOM",
    placeholder: "Ex: Tomada Inteligente",
  },
  {
    type: "fan",
    label: "Ventilador",
    codePrefix: "VEN",
    placeholder: "Ex: Exaustor Cozinha",
  },
  {
    type: "curtain",
    label: "Cortina",
    codePrefix: "COR",
    placeholder: "Ex: Cortina Inteligente",
  },
];

const PORTABLE_BLUETOOTH_DEVICES: BluetoothCandidate[] = [
  {
    id: "bt-sony-xm5",
    name: "Sony WH-1000XM5 (Fone)",
    code: "BT-SNY-1000",
    signal: 96,
    detail: "ANC • Multiponto",
  },
  {
    id: "bt-apple-watch",
    name: "Apple Watch Series 10 (Relógio)",
    code: "BT-APL-1042",
    signal: 94,
    detail: "Wearable • BLE",
  },
  {
    id: "bt-keychron-k2",
    name: "Keychron K2 Pro (Teclado)",
    code: "BT-KEY-2080",
    signal: 91,
    detail: "Mecânico • Bluetooth 5.1",
  },
  {
    id: "bt-mx-master",
    name: "Logitech MX Master 3S (Mouse)",
    code: "BT-LOG-3095",
    signal: 89,
    detail: "Multi-Device • BLE",
  },
  {
    id: "bt-airpods-pro",
    name: "AirPods Pro 2 (Fone)",
    code: "BT-APL-2049",
    signal: 86,
    detail: "AAC • Multiponto",
  },
];

const SMART_BLUETOOTH_BY_TYPE: Partial<Record<DeviceType, BluetoothCandidate[]>> = {
  light: [
    { id: "bt-lgt-1", name: "Lâmpada Smart RGB BLE", code: "BT-LGT-1042", signal: 94, detail: "BLE Mesh • 16M Cores" },
    { id: "bt-lgt-2", name: "Fita LED Ambiente Pro", code: "BT-LGT-2280", signal: 87, detail: "Bluetooth 5.2 • Dimerizável" },
  ],
  speaker: [
    { id: "bt-spk-1", name: "Echo Studio Soundbar", code: "BT-SPK-4401", signal: 95, detail: "Áudio HD • Bluetooth 5.3" },
    { id: "bt-spk-2", name: "JBL Charge 5 Smart", code: "BT-SPK-5520", signal: 89, detail: "Stereo • PartyBoost" },
  ],
  lock: [
    { id: "bt-lck-1", name: "Fechadura Biométrica Pro", code: "BT-LCK-7712", signal: 93, detail: "BLE Criptografado" },
    { id: "bt-lck-2", name: "Trava Smart Entrada", code: "BT-LCK-8034", signal: 86, detail: "Auto-Lock • BLE 5.1" },
  ],
  sensor: [
    { id: "bt-sen-1", name: "Sensor Presença BLE 5.0", code: "BT-SEN-1904", signal: 91, detail: "Bateria 24 meses" },
    { id: "bt-sen-2", name: "Sensor Porta/Janela Mini", code: "BT-SEN-2045", signal: 84, detail: "Alerta Instantâneo" },
  ],
};

const DONGLE_RECEPTORS: DongleReceptor[] = [
  {
    id: "dng-usbc",
    name: "Dongle USB-C 2.4GHz",
    band: "2.4 GHz",
  },
  {
    id: "dng-usba",
    name: "Receptor Wireless USB-A Lightspeed",
    band: "2.4 GHz",
  },
  {
    id: "dng-hub",
    name: "Adaptador Universal Dongle BT/RF",
    band: "2.4 GHz",
  },
];

const CONNECTION_LABELS: Record<DeviceConnectionType, string> = {
  wifi: "Wi-Fi",
  bluetooth: "Bluetooth",
  dongle: "Dongle USB 2.4GHz",
  other: "Outros",
};

function getBluetoothCandidates(
  type: DeviceType,
  label: string,
  prefix: string,
): BluetoothCandidate[] {
  if (type === "portable") return PORTABLE_BLUETOOTH_DEVICES;
  if (SMART_BLUETOOTH_BY_TYPE[type]) return SMART_BLUETOOTH_BY_TYPE[type]!;

  return [
    {
      id: `bt-${type}-1`,
      name: `${label} Smart BLE Pro`,
      code: `BT-${prefix}-1024`,
      signal: 93,
      detail: "Pareamento Rápido BLE",
    },
    {
      id: `bt-${type}-2`,
      name: `${label} Compact Hub`,
      code: `BT-${prefix}-2088`,
      signal: 84,
      detail: "Bluetooth 5.2 • Baixo Consumo",
    },
  ];
}

function generateProductCode(prefix: string): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `AUT-${prefix}-${digits}`;
}

function getDefaultDeviceValue(
  type: DeviceType,
  isOn: boolean,
  connectionType?: DeviceConnectionType,
): string {
  if (!isOn) return "Desl.";

  switch (type) {
    case "portable":
      if (connectionType === "dongle") return "Conectado • 2.4GHz";
      if (connectionType === "bluetooth") return "Conectado • BT";
      return "Conectado";
    case "light":
      return "100%";
    case "ac":
      return "23°C";
    case "tv":
      return "Ligada";
    case "speaker":
      return "Conectado";
    case "camera":
      return "Gravando";
    case "lock":
      return "Trancada";
    case "sensor":
      return "Ativo";
    case "plug":
      return "Ligada";
    case "fan":
      return "Médio";
    case "curtain":
      return "Aberta";
    default:
      return "Ativo";
  }
}

export default function NewDevicePage() {
  const router = useRouter();
  const { data: apiRooms } = useApi<Room[]>("/rooms");

  const availableRooms = useMemo(() => {
    const source = apiRooms && apiRooms.length > 0 ? apiRooms : fallbackRooms;
    return source.filter((room) => room.id !== "all");
  }, [apiRooms]);

  const [deviceType, setDeviceType] = useState<DeviceType>("portable");
  const [name, setName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [showProductCode, setShowProductCode] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [hasChosenRoom, setHasChosenRoom] = useState(false);
  const [connectionType, setConnectionType] =
    useState<DeviceConnectionType>("bluetooth");
  const [pairedDevice, setPairedDevice] = useState<string>("");
  const [initialIsOn, setInitialIsOn] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRoom = useMemo(() => {
    if (
      hasChosenRoom &&
      availableRooms.some((room) => room.id === selectedRoom)
    ) {
      return selectedRoom;
    }
    if (deviceType === "portable") {
      const portableRoom = availableRooms.find((room) => room.id === "portable");
      if (portableRoom) return portableRoom.id;
    }
    if (availableRooms.some((room) => room.id === selectedRoom)) {
      return selectedRoom;
    }
    return availableRooms[0]?.id ?? "portable";
  }, [availableRooms, deviceType, hasChosenRoom, selectedRoom]);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  const selectedTypeMeta =
    DEVICE_TYPES.find((item) => item.type === deviceType) ?? DEVICE_TYPES[0];

  const bluetoothCandidates = useMemo(
    () =>
      getBluetoothCandidates(
        deviceType,
        selectedTypeMeta.label,
        selectedTypeMeta.codePrefix,
      ),
    [deviceType, selectedTypeMeta.codePrefix, selectedTypeMeta.label],
  );

  const isPortable = deviceType === "portable";

  const triggerScan = () => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setIsScanning(true);
    scanTimerRef.current = setTimeout(() => {
      setIsScanning(false);
    }, 850);
  };

  const handleSelectType = (nextType: DeviceType) => {
    setDeviceType(nextType);
    setPairedDevice("");
    setFormError(null);

    if (nextType === "portable" && connectionType === "wifi") {
      setConnectionType("bluetooth");
    } else if (nextType !== "portable" && connectionType === "dongle") {
      setConnectionType("wifi");
    }
  };

  const handleSelectConnection = (nextConnection: DeviceConnectionType) => {
    setConnectionType(nextConnection);
    setPairedDevice("");
    setFormError(null);

    if (nextConnection === "bluetooth" || nextConnection === "dongle") {
      triggerScan();
    }
  };

  const handleSelectBluetoothDevice = (candidate: BluetoothCandidate) => {
    setPairedDevice(candidate.name);
    setFormError(null);
  };

  const handleSelectDongle = (receptor: DongleReceptor) => {
    setPairedDevice(receptor.name);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Informe um nome para identificar o dispositivo.");
      return;
    }

    if (connectionType === "bluetooth" && !pairedDevice) {
      setFormError("Selecione um dispositivo Bluetooth próximo na lista para parear.");
      return;
    }

    if (connectionType === "dongle" && !pairedDevice) {
      setFormError("Selecione um receptor Dongle USB 2.4GHz detectado para sincronizar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createDevice({
        name: trimmedName,
        room: activeRoom,
        type: deviceType,
        isOn: initialIsOn,
        value: getDefaultDeviceValue(deviceType, initialIsOn, connectionType),
        productCode: productCode.trim() || undefined,
        connectionType,
      });
      if (isFavorite) {
        markNewDeviceAsFavorite(created.id);
      }
      router.push("/devices");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o dispositivo no banco de dados.",
      );
      setIsSubmitting(false);
    }
  };

  const selectedRoomLabel =
    availableRooms.find((room) => room.id === activeRoom)?.name ?? "Não definido";

  const previewValue = getDefaultDeviceValue(
    deviceType,
    initialIsOn,
    connectionType,
  );

  const previewDevice: Device = {
    id: "preview",
    name: name.trim() || `Novo ${selectedTypeMeta.label}`,
    room: activeRoom,
    type: deviceType,
    isOn: initialIsOn,
    value: previewValue,
    productCode: productCode.trim() || undefined,
    connectionType,
    pairedDevice:
      connectionType === "wifi" ? CURRENT_WIFI_SSID : pairedDevice || undefined,
  };

  const fieldStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const maskedProductCode = productCode.trim()
    ? showProductCode
      ? productCode.trim()
      : "•".repeat(Math.min(productCode.trim().length, 10))
    : "Não informado";

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in-up">
        <Link
          href="/devices"
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl mb-4 transition-colors hover:text-white"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
        >
          <ArrowLeftIcon size={15} />
          <span>Voltar para Dispositivos</span>
        </Link>

        <h1 className="page-title">Adicionar Dispositivo</h1>
        <p className="page-subtitle">
          Configure e conecte um novo equipamento ao Automate
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Column */}
        <form
          id="add-device-form"
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6"
        >
          {/* Section 1: Device Type */}
          <div
            className="glass-card-static p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  1. Tipo de Dispositivo
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  Escolha uma das categorias suportadas pelo sistema
                </p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(0,229,160,0.1)",
                  color: "#00e5a0",
                }}
              >
                {selectedTypeMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {DEVICE_TYPES.map((item) => {
                const isSelected = deviceType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleSelectType(item.type)}
                    className="relative flex flex-col items-start gap-2.5 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer"
                    style={{
                      background: isSelected
                        ? "rgba(0,229,160,0.12)"
                        : "rgba(255,255,255,0.03)",
                      border: isSelected
                        ? "1px solid rgba(0,229,160,0.6)"
                        : "1px solid rgba(255,255,255,0.07)",
                      boxShadow: isSelected
                        ? "0 0 18px rgba(0,229,160,0.12)"
                        : undefined,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        background: isSelected
                          ? "rgba(0,229,160,0.18)"
                          : "rgba(255,255,255,0.05)",
                        color: isSelected ? "#00e5a0" : "#94a3b8",
                      }}
                    >
                      {getDeviceIcon(item.type, 18)}
                    </div>
                    <span
                      className="text-xs font-semibold truncate w-full"
                      style={{ color: isSelected ? "#ffffff" : "#cbd5e1" }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Basic Details */}
          <div
            className="glass-card-static p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-base font-bold text-white mb-1">
              2. Informações do Dispositivo
            </h2>
            <p className="text-xs mb-5" style={{ color: "#64748b" }}>
              Defina o nome, código de identificação e cômodo
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label
                  htmlFor="device-name"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "#94a3b8" }}
                >
                  Nome do Dispositivo *
                </label>
                <input
                  id="device-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder={selectedTypeMeta.placeholder}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#00e5a0]"
                  style={fieldStyle}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="product-code"
                    className="block text-xs font-medium"
                    style={{ color: "#94a3b8" }}
                  >
                    Código do Produto
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setProductCode(generateProductCode(selectedTypeMeta.codePrefix))
                    }
                    className="text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80"
                    style={{ color: "#00e5a0" }}
                  >
                    Gerar código
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="product-code"
                    type={showProductCode ? "text" : "password"}
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder={`Ex: AUT-${selectedTypeMeta.codePrefix}-4821`}
                    className="w-full rounded-xl pl-4 pr-11 py-3 text-sm text-white outline-none uppercase"
                    style={fieldStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowProductCode((prev) => !prev)}
                    aria-label={
                      showProductCode
                        ? "Ocultar código do produto"
                        : "Mostrar código do produto"
                    }
                    title={
                      showProductCode
                        ? "Ocultar código do produto"
                        : "Mostrar código do produto"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                  >
                    {showProductCode ? (
                      <EyeIcon size={17} />
                    ) : (
                      <EyeOffIcon size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span
                className="block text-xs font-medium mb-2"
                style={{ color: "#94a3b8" }}
              >
                Cômodo
              </span>
              <div className="flex flex-wrap gap-2">
                {availableRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoom(room.id);
                      setHasChosenRoom(true);
                    }}
                    className={`chip ${activeRoom === room.id ? "active" : ""}`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Connectivity & Pairing */}
          <div
            className="glass-card-static p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <h2 className="text-base font-bold text-white mb-1">
              3. Conectividade e Pareamento
            </h2>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              {isPortable
                ? "Selecione como o dispositivo portátil irá se conectar ao sistema"
                : "Escolha o protocolo de conexão do dispositivo"}
            </p>

            {isPortable && (
              <div
                className="rounded-xl px-4 py-3 mb-4 text-xs flex items-center gap-2.5"
                style={{
                  background: "rgba(0,180,216,0.08)",
                  border: "1px solid rgba(0,180,216,0.22)",
                  color: "#7dd3fc",
                }}
              >
                <DongleIcon size={16} className="shrink-0 text-[#00b4d8]" />
                <span>
                  Dispositivos portáteis (fones, relógios, teclados e periféricos)
                  conectam via <strong className="text-white">Bluetooth</strong>,{" "}
                  <strong className="text-white">Receptor USB Dongle (2.4GHz)</strong>{" "}
                  ou <strong className="text-white">Outros</strong>.
                </span>
              </div>
            )}

            {/* Connection Mode Cards + "Outros" square */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {!isPortable && (
                  <button
                    type="button"
                    onClick={() => handleSelectConnection("wifi")}
                    className="flex items-center gap-3.5 p-4 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background:
                        connectionType === "wifi"
                          ? "rgba(0,229,160,0.12)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        connectionType === "wifi"
                          ? "1px solid rgba(0,229,160,0.6)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          connectionType === "wifi"
                            ? "rgba(0,229,160,0.18)"
                            : "rgba(255,255,255,0.05)",
                        color: connectionType === "wifi" ? "#00e5a0" : "#94a3b8",
                      }}
                    >
                      <WifiIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Wi-Fi</p>
                      <p className="text-xs truncate" style={{ color: "#64748b" }}>
                        {CURRENT_WIFI_SSID}
                      </p>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSelectConnection("bluetooth")}
                  className="flex items-center gap-3.5 p-4 rounded-xl text-left transition-all cursor-pointer"
                  style={{
                    background:
                      connectionType === "bluetooth"
                        ? "rgba(0,229,160,0.12)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      connectionType === "bluetooth"
                        ? "1px solid rgba(0,229,160,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        connectionType === "bluetooth"
                          ? "rgba(0,229,160,0.18)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        connectionType === "bluetooth" ? "#00e5a0" : "#94a3b8",
                    }}
                  >
                    <BluetoothIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Bluetooth</p>
                    <p className="text-xs truncate" style={{ color: "#64748b" }}>
                      {isPortable ? "Bluetooth 5.3" : "Conexão Direta BLE"}
                    </p>
                  </div>
                </button>

                {isPortable && (
                  <button
                    type="button"
                    onClick={() => handleSelectConnection("dongle")}
                    className="flex items-center gap-3.5 p-4 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background:
                        connectionType === "dongle"
                          ? "rgba(0,229,160,0.12)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        connectionType === "dongle"
                          ? "1px solid rgba(0,229,160,0.6)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          connectionType === "dongle"
                            ? "rgba(0,229,160,0.18)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          connectionType === "dongle" ? "#00e5a0" : "#94a3b8",
                      }}
                    >
                      <DongleIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Dongle USB 2.4GHz
                      </p>
                      <p className="text-xs truncate" style={{ color: "#64748b" }}>
                        Receptor Wireless
                      </p>
                    </div>
                  </button>
                )}
              </div>

              {/* "Outros" square button */}
              <button
                type="button"
                onClick={() => handleSelectConnection("other")}
                className="sm:w-24 sm:shrink-0 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background:
                    connectionType === "other"
                      ? "rgba(0,229,160,0.12)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    connectionType === "other"
                      ? "1px solid rgba(0,229,160,0.6)"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <PlusIcon
                  size={20}
                  className={
                    connectionType === "other"
                      ? "text-[#00e5a0]"
                      : "text-[#94a3b8]"
                  }
                />
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: connectionType === "other" ? "#ffffff" : "#cbd5e1",
                  }}
                >
                  Outros
                </span>
              </button>
            </div>

            {/* Subpanel: Bluetooth Device List */}
            {connectionType === "bluetooth" && (
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`status-dot ${
                        isScanning ? "warning animate-pulse-dot" : "online"
                      }`}
                    />
                    <span className="text-xs font-semibold text-white">
                      {isScanning
                        ? "Buscando dispositivos Bluetooth próximos..."
                        : "Dispositivos Bluetooth Próximos"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={triggerScan}
                    disabled={isScanning}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#cbd5e1",
                      opacity: isScanning ? 0.6 : 1,
                    }}
                  >
                    <RefreshIcon
                      size={14}
                      className={isScanning ? "animate-spin" : ""}
                    />
                    <span>Buscar novamente</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {bluetoothCandidates.map((candidate) => {
                    const isPaired = pairedDevice === candidate.name;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => handleSelectBluetoothDevice(candidate)}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition-all cursor-pointer"
                        style={{
                          background: isPaired
                            ? "rgba(0,229,160,0.1)"
                            : "rgba(255,255,255,0.03)",
                          border: isPaired
                            ? "1px solid rgba(0,229,160,0.5)"
                            : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: isPaired
                                ? "rgba(0,229,160,0.18)"
                                : "rgba(255,255,255,0.05)",
                              color: isPaired ? "#00e5a0" : "#94a3b8",
                            }}
                          >
                            {getDeviceIcon(deviceType, 18)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {candidate.name}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: "#64748b" }}
                            >
                              {candidate.code} • {candidate.detail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className="text-[11px] font-medium hidden sm:inline"
                            style={{ color: "#94a3b8" }}
                          >
                            Sinal {candidate.signal}%
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              background: isPaired
                                ? "rgba(0,229,160,0.2)"
                                : "rgba(255,255,255,0.06)",
                              color: isPaired ? "#00e5a0" : "#cbd5e1",
                            }}
                          >
                            {isPaired && <CheckIcon size={12} />}
                            {isPaired ? "Pareado" : "Parear"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subpanel: Dongle USB 2.4GHz */}
            {connectionType === "dongle" && (
              <div
                className="rounded-xl p-4 space-y-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        Conexão via Dongle USB (2.4GHz)
                      </h3>
                      <p className="text-[11px]" style={{ color: "#64748b" }}>
                        Siga os 3 passos e selecione o receptor detectado
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerScan}
                      disabled={isScanning}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "#cbd5e1",
                        opacity: isScanning ? 0.6 : 1,
                      }}
                    >
                      <RefreshIcon
                        size={14}
                        className={isScanning ? "animate-spin" : ""}
                      />
                      <span>Escanear Receptores</span>
                    </button>
                  </div>

                  {/* 3-step quick guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                    {[
                      {
                        step: "1",
                        title: "Plugue o Dongle",
                        desc: "Conecte o receptor wireless no Hub ou PC",
                      },
                      {
                        step: "2",
                        title: "Modo 2.4GHz",
                        desc: "Ative a chave wireless no dispositivo",
                      },
                      {
                        step: "3",
                        title: "Vincule o Canal",
                        desc: "Escolha o receptor detectado abaixo",
                      },
                    ].map((guide) => (
                      <div
                        key={guide.step}
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
                            style={{
                              background: "rgba(0,229,160,0.15)",
                              color: "#00e5a0",
                            }}
                          >
                            {guide.step}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {guide.title}
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: "#64748b" }}>
                          {guide.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Detected Receptors */}
                  <div className="space-y-2">
                    {DONGLE_RECEPTORS.map((receptor) => {
                      const isLinked = pairedDevice === receptor.name;
                      return (
                        <button
                          key={receptor.id}
                          type="button"
                          onClick={() => handleSelectDongle(receptor)}
                          className="w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition-all cursor-pointer"
                          style={{
                            background: isLinked
                              ? "rgba(0,229,160,0.1)"
                              : "rgba(255,255,255,0.03)",
                            border: isLinked
                              ? "1px solid rgba(0,229,160,0.5)"
                              : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: isLinked
                                  ? "rgba(0,229,160,0.18)"
                                  : "rgba(255,255,255,0.05)",
                                color: isLinked ? "#00e5a0" : "#94a3b8",
                              }}
                            >
                              <DongleIcon size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {receptor.name}
                              </p>
                              <p
                                className="text-xs truncate"
                                style={{ color: "#64748b" }}
                              >
                                {receptor.band}
                              </p>
                            </div>
                          </div>

                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                            style={{
                              background: isLinked
                                ? "rgba(0,229,160,0.2)"
                                : "rgba(255,255,255,0.06)",
                              color: isLinked ? "#00e5a0" : "#cbd5e1",
                            }}
                          >
                            {isLinked && <CheckIcon size={12} />}
                            {isLinked ? "Sincronizado via RF 2.4GHz" : "Vincular"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Subpanel: Outros */}
            {connectionType === "other" && (
              <div
                className="rounded-xl p-4 text-xs"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#94a3b8",
                }}
              >
                Conexão alternativa selecionada (cabo, USB direto, Zigbee ou outro
                protocolo gerenciado externamente).
              </div>
            )}
          </div>
        </form>

        {/* Preview & Summary Column (outside form so preview toggle won't submit) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Live Preview */}
          <div
            className="glass-card-static p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-base font-bold text-white mb-1">
              Pré-visualização do Card
            </h2>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              Use o interruptor para definir o estado inicial
            </p>

            <DeviceCard
              device={previewDevice}
              onToggle={() => setInitialIsOn((prev) => !prev)}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite((prev) => !prev)}
            />
          </div>

          {/* Summary & Actions */}
          <div
            className="glass-card-static p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <h2 className="text-base font-bold text-white mb-4">
              Resumo da Configuração
            </h2>

            <div className="space-y-3 mb-5">
              {[
                { label: "Tipo", value: selectedTypeMeta.label },
                { label: "Cômodo", value: selectedRoomLabel },
                { label: "Código", value: maskedProductCode },
                { label: "Conexão", value: CONNECTION_LABELS[connectionType] },
                {
                  label:
                    connectionType === "wifi"
                      ? "Rede Wi-Fi"
                      : connectionType === "other"
                        ? "Protocolo"
                        : "Pareamento",
                  value:
                    connectionType === "wifi"
                      ? CURRENT_WIFI_SSID
                      : connectionType === "other"
                        ? "Outro protocolo"
                        : pairedDevice || "Pendente",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2 py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {row.label}
                  </span>
                  <span className="text-xs font-medium text-white truncate max-w-[180px]">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {formError && (
              <div
                className="rounded-xl px-3.5 py-2.5 mb-4 text-xs"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                }}
              >
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="submit"
                form="add-device-form"
                disabled={isSubmitting}
                className="w-full rounded-xl py-3 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
                  color: "#0a0e1a",
                }}
              >
                {isSubmitting ? "Salvando..." : "Adicionar Dispositivo"}
              </button>
              <Link
                href="/devices"
                className="w-full rounded-xl py-3 text-sm font-medium text-center transition-colors hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                }}
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
