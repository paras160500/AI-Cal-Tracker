import { useAuth, useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import {
  Beef,
  Bell,
  Fish,
  Flame,
  Grape,
  LogOut,
  Plus
} from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Background from '../components/Background';
import { Colors } from '../constants/Colors';
import { useUserSync } from '../hooks/useUserSync';

const { width } = Dimensions.get('window');

const MacroCard = ({ icon: Icon, label, value, color, delay }: any) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(800).springify()}
    style={[styles.macroCard, { borderLeftColor: color }]}
  >
    <View style={[styles.macroIcon, { backgroundColor: color + '20' }]}>
      <Icon size={20} color={color} />
    </View>
    <View>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  </Animated.View>
);

export default function Index() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const scale = useSharedValue(1);

  // Sync user data to Firestore on load
  useUserSync();

  const onLogoutPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await signOut();
    } catch (err) {
      console.error('Logout error', err);
      alert('Failed to sign out. Please try again.');
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <Background />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        entering={FadeInDown.duration(1000).springify().damping(12)}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800).springify()}
          style={styles.header}
        >
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{user?.firstName || 'Healthy Friend'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.circleBtn}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => alert('Notifications coming soon!')}
            >
              <Bell size={22} color="#1E293B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogoutPress}
              style={[styles.circleBtn, styles.logoutBtn]}
              accessibilityRole="button"
              accessibilityLabel="Logout"
            >
              <LogOut size={22} color={Colors.light.error} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Main Calorie Card */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify().damping(15)}
          style={[styles.mainCard, styles.glassEffect]}
        >
          <View style={styles.mainCardHeader}>
            <View>
              <Text style={styles.mainCardTitle}>Daily Progress</Text>
              <Text style={styles.mainCardSubtitle}>Calories burned today</Text>
            </View>
            <Flame color="#F59E0B" size={28} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.countText}>1,250</Text>
              <Text style={styles.totalText}>/ 2,400 kcal</Text>
            </View>
          </View>

          <View style={styles.mainCardFooter}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>8,432</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Exercise min</Text>
            </View>
          </View>
        </Animated.View>

        {/* Macros Section */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInRight.delay(600).duration(800)}
            style={styles.sectionTitle}
          >
            Macros Breakdown
          </Animated.Text>
          <View style={styles.macrosGrid}>
            <MacroCard icon={Beef} label="Protein" value="84g / 180g" color="#EF4444" delay={700} />
            <MacroCard icon={Grape} label="Carbs" value="120g / 250g" color="#10B981" delay={800} />
            <MacroCard icon={Fish} label="Fats" value="42g / 80g" color="#3B82F6" delay={900} />
          </View>
        </View>

        {/* Floating Action Hint */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(800).springify()}
          style={styles.actionSection}
        >
          <TouchableOpacity
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.addBtn, animatedButtonStyle]}>
              <Plus color="#fff" size={28} />
              <Text style={styles.addBtnText}>Log New Meal</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greetingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutBtn: {
    backgroundColor: '#FFF1F2',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glassEffect: {
    backdropFilter: 'blur(20px)', // For web support, will be ignored by native but good to have
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: '#F1F5F9',
    borderTopColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
  },
  totalText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  macrosGrid: {
    gap: 12,
  },
  macroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  macroIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});
