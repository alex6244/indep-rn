import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { colors } from "../../shared/theme/colors";
import { typography } from "../../shared/theme/typography";
import { CallbackModal } from "./pricing/CallbackModal";
import { PricingCard } from "./pricing/PricingCard";
import { pricingPlans } from "./pricing/pricingPlans.data";

export function PricingSection() {
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const [callbackVisible, setCallbackVisible] = useState(false);

  const GAP = 12;
  const w = containerWidth || screenWidth;
  const cardWidth = Math.round(w * 0.76);
  const snapInterval = cardWidth + GAP;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Стоимость услуг подборщика</Text>

      <View
        onLayout={(e) => {
          setContainerWidth(e.nativeEvent.layout.width);
        }}
      >
        <FlatList
          data={pricingPlans}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={snapInterval}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item, index }) => {
            const marginRight = index === pricingPlans.length - 1 ? 0 : GAP;

            return (
              <View style={{ marginRight }}>
                <PricingCard
                  plan={item}
                  width={cardWidth}
                  onOrderPress={() => setCallbackVisible(true)}
                />
              </View>
            );
          }}
        />
      </View>
      <CallbackModal visible={callbackVisible} onClose={() => setCallbackVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 10,
  },
});
