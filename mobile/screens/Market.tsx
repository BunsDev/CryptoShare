import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Utils from "../utils/Utils";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/Market";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../styles/Global";
import { cryptoAPI } from "../utils/Requests";

export default function Market({ navigation }: any) {
	const dispatch = useDispatch();
	const { theme } = useSelector((state: any) => state.theme);
	const { settings } = useSelector((state: any) => state.settings);

	const [symbol, setSymbol] = useState<string>("");
	const [type, setType] = useState<string>("crypto");

	const [firstFetch, setFirstFetch] = useState<boolean>(true);
	const [marketRowsCrypto, setMarketRowsCrypto] = useState<any>({});

	// TODO: Add "onPress" functionality.
	const Item = ({ info }: any) => {
		return (
			<TouchableOpacity style={[styles.itemCard, styles[`itemCard${theme}`]]}>
				<View style={styles.itemTop}>
					<Image source={{ uri:info.icon }} style={styles.itemIcon}/>
					<Text style={[styles.itemText, styles.itemTextName, styles[`itemTextName${theme}`]]} numberOfLines={1} ellipsizeMode="tail">{info.name} ({info.symbol.toUpperCase()})</Text>
				</View>
				<View style={styles.itemBottom}>
					<ScrollView style={[styles.itemScrollView]} contentContainerStyle={styles.itemScrollViewContent} horizontal={true} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
						<Text style={[styles.itemText, styles[`itemText${theme}`], styles.itemTextRank, styles[`itemTextRank${theme}`]]} numberOfLines={1} ellipsizeMode="tail">#{info.rank}</Text>
						<Text style={[styles.itemText, styles[`itemText${theme}`]]} numberOfLines={1} ellipsizeMode="tail">24h: {info.priceChangeDay}%</Text>
						<Text style={[styles.itemText, styles[`itemText${theme}`]]} numberOfLines={1} ellipsizeMode="tail">Volume: {Utils.currencySymbols[settings.currency] + Utils.abbreviateNumber(info.volume, 2)}</Text>
					</ScrollView>
					<ScrollView style={[styles.itemScrollView, { marginBottom:10 }]} contentContainerStyle={styles.itemScrollViewContent} horizontal={true} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
						<Text style={[styles.itemText, styles[`itemText${theme}`]]} numberOfLines={1} ellipsizeMode="tail">Price: {Utils.currencySymbols[settings.currency] + Utils.separateThousands(info.price)}</Text>
						<Text style={[styles.itemText, styles[`itemText${theme}`]]} numberOfLines={1} ellipsizeMode="tail">Market Cap: {Utils.currencySymbols[settings.currency] + Utils.abbreviateNumber(info.marketCap, 2)}</Text>
					</ScrollView>
				</View>
			</TouchableOpacity>
		);
	}

	const renderItem = ({ item }: any) => {
		let info = marketRowsCrypto[item];

		return (
			<Item info={info}/>
		);
	}
	
	useFocusEffect(Utils.backHandler(navigation));

	useEffect(() => {
		if(firstFetch) {
			populateMarketListCrypto();
			setFirstFetch(false);
		}

		navigation.addListener("focus", () => {
			if(navigation.isFocused()) {
				setTimeout(() => {
					if(!firstFetch) {
						populateMarketListCrypto();
					}
				}, 500);
			}
		});
		
		let refresh = setInterval(() => {
			if(navigation.isFocused()) {

			}
		}, 15000);

		return () => {
			setFirstFetch(true);
			clearInterval(refresh);
		};
	}, []);

	return (
		<ImageBackground source={Utils.getBackground(theme)} resizeMethod="scale" resizeMode="cover">
			<SafeAreaView style={styles.area}>
				<View style={[styles.areaSearchWrapper, styles[`areaSearchWrapper${theme}`]]}>
					<TextInput
						placeholder="Symbol..." 
						selectionColor={Colors[theme].mainContrast} 
						placeholderTextColor={Colors[theme].mainContrastDarker} 
						style={[styles.inputSearch, styles[`inputSearch${theme}`]]} 
						onChangeText={(value) => setSymbol(value)}
						value={symbol}
					/>
					<TouchableOpacity style={[styles.button, styles.buttonSearch, styles[`buttonSearch${theme}`]]}>
						<Text style={[styles.searchText, styles[`searchText${theme}`]]}>Search</Text>
					</TouchableOpacity>
				</View>
				{ type === "crypto" &&
					<FlatList
						contentContainerStyle={{ paddingTop:10 }}
						data={Object.keys(marketRowsCrypto)}
						renderItem={renderItem}
						keyExtractor={item => marketRowsCrypto[item].coinID}
						style={[styles.wrapper, styles[`wrapper${theme}`]]
					}/>
				}
				<View style={[styles.areaActionsWrapper, styles[`areaActionsWrapper${theme}`]]}>
					<TouchableOpacity style={[styles.button, styles.iconButton, styles[`iconButton`]]}>
						<Icon
							name="chart-line" 
							size={24} 
							color={Colors[theme].accentContrast}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => changeType("crypto")} style={[styles.button, styles.choiceButton, styles[`choiceButton${theme}`], type === "crypto" ? styles[`choiceButtonActive${theme}`] : null]}>
						<Text style={[styles.choiceText, styles[`choiceText${theme}`]]}>Crypto</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => changeType("stocks")} style={[styles.button, styles.choiceButton, styles[`choiceButton${theme}`], type === "stocks" ? styles[`choiceButtonActive${theme}`] : null]}>
						<Text style={[styles.choiceText, styles[`choiceText${theme}`]]}>Stocks</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);

	function changeType(type: string) {
		setType(type);
	}

	async function populateMarketListCrypto() {
		try {
			let marketData = await cryptoAPI.getMarket(settings.currency, 100, 1);

			let rows: any = {};

			let ids = Object.keys(marketData);

			for(let i = 0; i < 100; i++) {
				try {
					let id = ids[i];
				
					let rank = i + 1;
	
					let coin = marketData[id];
	
					let coinID = coin.id;
					let price = coin.current_price;
					let icon = coin.image;
					let marketCap = coin.market_cap;
					let priceChangeDay = Utils.formatPercentage(coin.market_cap_change_percentage_24h);
					let athChange = Utils.formatPercentage(coin.ath_change_percentage);
					let ath = coin.ath;
					let high24h = coin.high_24h;
					let low24h = coin.low_24h;
					let volume = coin.total_volume;
					let supply = coin.circulating_supply;
					let name = coin.name;
					let symbol = coin.symbol;
	
					let info = { coinID:coinID, currency:settings.currency, icon:icon, marketCap:marketCap, price:price, ath:ath, priceChangeDay:priceChangeDay, athChange:athChange, high24h:high24h, low24h:low24h, volume:volume, supply:supply, name:name, symbol:symbol, rank:rank };

					rows[i] = info;
				} catch(error) {
					console.log(error);
				}
			}

			setMarketRowsCrypto(rows);
		} catch(error) {
			console.log(error);
			Utils.notify(theme, "Something went wrong...");
		}
	}
}