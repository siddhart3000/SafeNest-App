import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { FamilyMember } from "../services/familyService";
import { MemberMarker } from "../components/MemberMarker";
import { BottomSheet } from "../components/BottomSheet";
import { WeatherCard } from "../components/WeatherCard";
import { useWeather } from "../hooks/useWeather";
import { colors, radius, spacing, typography } from "../theme/theme";
import {
  formatBatteryPercentage,
  formatLastOnline,
  isOnlineFromLastOnline,
} from "../utils/formatters";

interface MapScreenProps {
  familyId: string;
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0B1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#E6EDF3" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1220" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1F2937" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9CA3AF" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export default function MapScreen({ familyId }: MapScreenProps) {
  const { members, loading } = useFamilyMembers(familyId);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!selectedMember && members.length > 0) {
      setSelectedMember(members[0]);
    }
  }, [members, selectedMember]);

  useEffect(() => {
    if (!selectedMember || !selectedMember.latitude || !selectedMember.longitude) return;

    const region: Region = {
      latitude: selectedMember.latitude,
      longitude: selectedMember.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(region, 500);
  }, [selectedMember?.id, selectedMember?.latitude, selectedMember?.longitude]);

  const selectedCoords =
    selectedMember && selectedMember.latitude && selectedMember.longitude
      ? {
          latitude: selectedMember.latitude,
          longitude: selectedMember.longitude,
        }
      : null;

  const { weather, recommendation, loading: weatherLoading } = useWeather(selectedCoords);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Syncing your family map…</Text>
      </View>
    );
  }

  const isOnline =
    selectedMember &&
    (selectedMember.isOnline || isOnlineFromLastOnline(selectedMember.lastOnline));

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        initialRegion={{
          latitude: members[0]?.latitude || 30.7333,
          longitude: members[0]?.longitude || 76.7794,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {members.map((member) => {
          if (!member.latitude || !member.longitude) return null;
          const online =
            member.isOnline || isOnlineFromLastOnline(member.lastOnline);

          return (
            <Marker
              key={member.id}
              coordinate={{
                latitude: member.latitude,
                longitude: member.longitude,
              }}
              onPress={() => setSelectedMember(member)}
            >
              <MemberMarker
                name={member.name}
                photoURL={member.photoURL}
                isOnline={online}
              />
            </Marker>
          );
        })}
      </MapView>

      <BottomSheet visible={!!selectedMember}>
        {selectedMember && (
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.memberName}>{selectedMember.name}</Text>
                {selectedMember.role && (
                  <Text style={styles.memberRole}>{selectedMember.role}</Text>
                )}
              </View>

              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: isOnline ? "rgba(34,197,94,0.1)" : "rgba(248,113,113,0.1)" },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOnline ? colors.primary : colors.danger },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isOnline ? colors.primary : colors.danger },
                  ]}
                >
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Battery</Text>
                <Text style={styles.metaValue}>
                  {formatBatteryPercentage(selectedMember.batteryLevel)}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Last online</Text>
                <Text style={styles.metaValue}>
                  {formatLastOnline(selectedMember.lastOnline)}
                </Text>
              </View>
            </View>

            <WeatherCard
              weather={weather}
              recommendation={recommendation}
              loading={weatherLoading}
            />
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loaderText: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberName: {
    ...typography.title,
    fontSize: 20,
  },
  memberRole: {
    ...typography.caption,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  metaValue: {
    ...typography.body,
  },
});