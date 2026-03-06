import { useSignUp } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Background from '../../components/Background';
import { Colors } from '../../constants/Colors';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            const msg = err?.errors?.[0]?.message ?? err?.message ?? 'Sign up failed';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace('/');
            } else if (completeSignUp.status) {
                console.log('Verification incomplete', completeSignUp.status);
                alert(`Action required: ${completeSignUp.status.replace(/_/g, ' ')}`);
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            const msg = err?.errors?.[0]?.message ?? err?.message ?? 'Verification failed';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Background />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inner}>
                            <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.topSection}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                                    <ArrowLeft size={24} color="#1E293B" />
                                </TouchableOpacity>
                                <View style={[styles.iconContainer, { backgroundColor: '#fff' }]}>
                                    <UserPlus size={40} color={Colors.light.brand} />
                                </View>
                                <Text style={styles.title}>{pendingVerification ? 'Verify' : 'Join Us!'}</Text>
                                <Text style={styles.subtitle}>
                                    {pendingVerification
                                        ? "Check your inbox for the code."
                                        : "Start your healthy journey today"}
                                </Text>
                            </Animated.View>

                            <Animated.View
                                entering={FadeInUp.delay(400).duration(1000).springify()}
                                style={styles.card}
                            >
                                {!pendingVerification ? (
                                    <View style={styles.form}>
                                        <View style={styles.row}>
                                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                                <Text style={styles.label}>First Name</Text>
                                                <View style={styles.inputWrapper}>
                                                    <TextInput
                                                        value={firstName}
                                                        placeholder="John"
                                                        placeholderTextColor="#94A3B8"
                                                        onChangeText={setFirstName}
                                                        style={styles.input}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                                <Text style={styles.label}>Last Name</Text>
                                                <View style={styles.inputWrapper}>
                                                    <TextInput
                                                        value={lastName}
                                                        placeholder="Doe"
                                                        placeholderTextColor="#94A3B8"
                                                        onChangeText={setLastName}
                                                        style={styles.input}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Email Address</Text>
                                            <View style={styles.inputWrapper}>
                                                <Mail size={18} color="#94A3B8" style={styles.inputIcon} />
                                                <TextInput
                                                    autoCapitalize="none"
                                                    value={emailAddress}
                                                    placeholder="name@example.com"
                                                    placeholderTextColor="#94A3B8"
                                                    onChangeText={setEmailAddress}
                                                    style={styles.input}
                                                    keyboardType="email-address"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Password</Text>
                                            <View style={styles.inputWrapper}>
                                                <Lock size={18} color="#94A3B8" style={styles.inputIcon} />
                                                <TextInput
                                                    value={password}
                                                    placeholder="••••••••"
                                                    placeholderTextColor="#94A3B8"
                                                    secureTextEntry={!showPassword}
                                                    onChangeText={setPassword}
                                                    style={styles.input}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={onSignUpPress}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.actionBtn}>
                                                {loading ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text style={styles.actionText}>Create Account</Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.form}>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Verification Code</Text>
                                            <View style={styles.inputWrapper}>
                                                <Lock size={18} color="#94A3B8" style={styles.inputIcon} />
                                                <TextInput
                                                    value={code}
                                                    placeholder="123456"
                                                    placeholderTextColor="#94A3B8"
                                                    onChangeText={setCode}
                                                    style={styles.input}
                                                    keyboardType="number-pad"
                                                />
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={onPressVerify}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.actionBtn}>
                                                {loading ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text style={styles.actionText}>Verify & Complete</Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <Link href="/(auth)/signin" asChild>
                                        <TouchableOpacity>
                                            <Text style={styles.signInLink}>Sign In</Text>
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    inner: {
        flex: 1,
    },
    topSection: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    backBtn: {
        position: 'absolute',
        top: 60,
        left: 24,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        zIndex: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 3,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 6,
        textAlign: 'center',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 24,
        borderRadius: 32,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.05,
        shadowRadius: 30,
        elevation: 8,
    },
    form: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderColor: '#E2E8F0',
        height: 46,
        paddingHorizontal: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '600',
    },
    actionBtn: {
        backgroundColor: Colors.light.brand,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: Colors.light.brand,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
    },
    actionText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    signInLink: {
        fontSize: 14,
        color: Colors.light.brand,
        fontWeight: '800',
    },
});
