import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { colors } from "../../shared/theme/colors";
import { typography } from "../../shared/theme/typography";
import { CallbackModal } from "./pricing/CallbackModal";
import { PricingCard } from "./pricing/PricingCard";
import { pricingPlans } from "./pricing/pricingPlans.data";

export function PricingSection() {
  const [callbackVisible, setCallbackVisible] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  const GAP = 12;
  const LIST_LEFT_PADDING = 21;
  const LIST_RIGHT_PADDING = 16;
  const cardWidth = Math.floor((screenWidth - LIST_LEFT_PADDING - LIST_RIGHT_PADDING - GAP) / 1.5);
  const snapInterval = cardWidth + GAP;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Стоимость услуг подборщика</Text>

      <View>
        <FlatList
          data={pricingPlans}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={snapInterval}
          contentContainerStyle={{ paddingLeft: LIST_LEFT_PADDING, paddingRight: LIST_RIGHT_PADDING }}
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
    color: colors.text.primary,
    marginBottom: 10,
  },
});
