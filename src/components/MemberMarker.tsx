import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { colors } from "../theme/theme";

interface MemberMarkerProps {
  name: string;
  photoURL?: string | null;
  isOnline?: boolean;
  onPress?: () => void;
}

const MemberMarkerComponent: React.FC<MemberMarkerProps> = ({
  name,
  photoURL,
  isOnline = false,
  onPress,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isOnline) {
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [isOnline, pulse]);

  const borderColor = isOnline ? colors.primary : colors.muted;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          { borderColor, transform: [{ scale: pulse }] },
        ]}
      >
        <Image
          source={{
            uri:
              photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || "Member"
              )}&background=0D1117&color=E6EDF3`,
          }}
          style={styles.avatar}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const MemberMarker = React.memo(MemberMarkerComponent);

const styles = StyleSheet.create({
  container: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    padding: 2,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
});

