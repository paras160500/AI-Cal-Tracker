import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { Link, useRouter } from 'expo-router';
import { Chrome, Eye, EyeOff, LayoutPanelTop, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
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
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import Background from '../../components/Background';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

/**
 * Renders the sign-in screen with email/password fields, password visibility toggle, and sign-in actions.
 *
 * Shows UI for entering credentials, initiates Clerk sign-in, triggers haptic feedback and error alerts,
 * and navigates to the app root on successful authentication.
 *
 * @returns The React element for the sign-in screen.
 */
export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            }
        } catch (err: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert(err.errors[0]?.message || 'Sign in failed');
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
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Top Illustration Area */}
                        <View style={styles.topSection}>
                            <Animated.View
                                entering={FadeInDown.delay(200).duration(800).springify()}
                                style={styles.iconContainer}
                            >
                                <LayoutPanelTop size={48} color={Colors.light.brand} />
                            </Animated.View>
                            <Animated.View entering={FadeInDown.delay(300).duration(800).springify()}>
                                <Text style={styles.title}>Hello Again!</Text>
                                <Text style={styles.subtitle}>Fill your details to continue</Text>
                            </Animated.View>
                        </View>

                        {/* Main Form Card */}
                        <Animated.View
                            entering={FadeInUp.delay(400).duration(1000).springify()}
                            style={styles.card}
                        >
                            <View style={styles.form}>
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

                                <TouchableOpacity style={styles.forgotBtn}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onSignInPress}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.signInBtn}>
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.signInText}>Sign In</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.divider}>
                                    <View style={styles.line} />
                                    <Text style={styles.dividerText}>Or Sign In With</Text>
                                    <View style={styles.line} />
                                </View>

                                <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
                                    <Chrome size={20} color="#1A1A1A" />
                                    <Text style={styles.googleBtnText}>Sign In with Google</Text>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>New User? </Text>
                                    <Link href="/(auth)/signup" asChild>
                                        <TouchableOpacity>
                                            <Text style={styles.signUpLink}>Create Account</Text>
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </View>
                        </Animated.View>
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
    topSection: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
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
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 24,
        borderRadius: 32,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.05,
        shadowRadius: 30,
        elevation: 10,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderColor: '#E2E8F0',
        height: 50,
        paddingHorizontal: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    signInBtn: {
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
    signInText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 12,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        height: 56,
        borderRadius: 16,
        gap: 12,
    },
    googleBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    signUpLink: {
        fontSize: 14,
        color: Colors.light.brand,
        fontWeight: '800',
    },
});
