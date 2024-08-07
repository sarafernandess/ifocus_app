import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';

const WelcomeScreen = ({ navigation }) => {
    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView className="flex-1" style={{ height: "100%", flexDirection: "column", justifyContent: 'center' }}>
                    <View className='flex-1' style={{ alignItems: 'center', height: "auto" }}>
                        <View style={{ height: 'auto' }}>
                            <Image source={require('../../assets/images/welcome.png')}
                                style={{
                                    height: 350,
                                    width: 350,
                                }}
                            />
                        </View>
                        <View style={{ width: "90%" }}>
                            <Text className="text-1"
                                style={{
                                    fontSize: 48,
                                    fontWeight: '800',
                                    color: COLORS.green
                                }}> Let's Get </Text>
                            <Text className="text-1"
                                style={{
                                    fontSize: 46,
                                    fontWeight: '800',
                                    color: COLORS.white
                                }}> Started! </Text>
                        </View>
                        <View style={{ marginVertical: 22, width: "88%" }}>
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                            }}> Conecte-se com seu e-mail institucional</Text>
                        </View>
                        <Button
                            title="Entrar"
                            onPress={() => navigation.navigate("Login")}
                            style={{
                                width: "88%"
                            }}
                        />
                        <View style={{
                            flexDirection: "row",
                            marginTop: 12,
                            justifyContent: "center"
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                            }}> Não possui uma conta? </Text>
                            <Pressable onPress={() => navigation.navigate("SignUp")}>
                                <Text style={{
                                    fontSize: 16,
                                    color: COLORS.green,
                                    fontWeight: "bold",
                                    marginLeft: 4
                                }}
                                >Cadastre-se</Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
    )
}

export default WelcomeScreen;
