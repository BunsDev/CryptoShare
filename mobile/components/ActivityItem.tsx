import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import store from "../store/store";
import { Colors, GlobalStyle } from "../styles/Global";
import { screenWidth } from "../styles/NavigationBar";
import Utils from "../utils/Utils";

export default function Item({ info, showActivityPopup, theme, settings }: any) {
	return (
		<TouchableOpacity
			onPress={() => {}}
			style={[styles.itemCard, styles[`itemCard${theme}`]]}
		>
			<View style={styles.itemLeft}>
				<Text style={[styles.itemText, styles[`itemText${theme}`], { backgroundColor:Colors[theme].Activity.accentSecond, color:Colors[theme].accentContrast, marginBottom:10 }]}>{info.activityDate}</Text>
				<Text style={[styles.itemText, styles[`itemText${theme}`], { backgroundColor:Colors[theme].Activity.accentThird, color:Colors[theme].accentContrast }]}>{info.activityAssetSymbol.toUpperCase()}</Text>
			</View>
			<View style={styles.itemRight}>
				<Text style={[styles.itemText, styles[`itemText${theme}`], styles[`itemText${Utils.capitalizeFirstLetter(info.activityType + theme)}`], { marginBottom:10 }]}>{Utils.capitalizeFirstLetter(info.activityType)}</Text>
				<Text style={[styles.itemText, styles[`itemText${theme}`]]}>Amount: {info.activityAssetAmount}</Text>
			</View>
		</TouchableOpacity>
	);
}

let styles: any = StyleSheet.create({
	itemCard: {
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
		marginLeft: 10,
		marginBottom: 10,
		backgroundColor: Colors.Dark.mainFirst,
		borderRadius: GlobalStyle.borderRadius,
		shadowColor: GlobalStyle.shadowColor,
		shadowOffset: GlobalStyle.shadowOffset,
		shadowOpacity: GlobalStyle.shadowOpacity,
		shadowRadius: GlobalStyle.shadowRadius,
		elevation: GlobalStyle.shadowElevation,
	},
	itemCardLight: {
		backgroundColor: Colors.Light.mainFirst
	},
	itemLeft: {
		justifyContent: "center",
		alignItems: "flex-start",
		flexGrow: 1
	},
	itemRight: {
		justifyContent: "center",
		alignItems: "flex-end",
	},
	itemText: {
		paddingTop: 6,
		paddingBottom: 6,
		paddingRight: 10,
		paddingLeft: 10,
		color: Colors.Dark.mainContrast,
		fontWeight: "bold",
		backgroundColor: Colors.Dark.mainFourth,
		borderRadius: GlobalStyle.borderRadius
	},
	itemTextLight: {
		color: Colors.Light.mainContrast,
		backgroundColor: Colors.Light.mainFifth
	},
	itemTextBuyDark: {
		backgroundColor: Colors.Dark.positiveFirst,
		color: Colors.Dark.accentContrast,
	},
	itemTextBuyLight: {
		backgroundColor: Colors.Light.positiveFirst,
		color: Colors.Light.accentContrast,
	},
	itemTextSellDark: {
		backgroundColor: Colors.Dark.negativeFirst,
		color: Colors.Dark.accentContrast,
	},
	itemTextSellLight: {
		backgroundColor: Colors.Light.negativeFirst,
		color: Colors.Light.accentContrast,
	},
	itemTextTransferDark: {
		backgroundColor: Colors.Dark.mainSecond,
		color: Colors.Dark.accentContrast,
	},
	itemTextTransferLight: {
		backgroundColor: Colors.Light.mainSecond,
		color: Colors.Light.accentContrast,
	},
});