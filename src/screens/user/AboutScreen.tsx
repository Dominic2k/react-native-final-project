import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { COLORS } from '../../constants/colors'; 

const APP_INFO = {
  name: "TechStore", 
  version: "1.0.0",
  description: "Leading technology product shopping app. We connect you with the most trusted stores, bringing quality tech products right to your doorstep.",
  email: "support@techstore.com",
  phone: "1900 123 456",
  website: "https://techstore.com",
  address: "123 Tech Street, San Francisco, USA"
};

export default function AboutScreen() {

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header & Logo */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7541/7541900.png' }} // Thay bằng logo thật của bạn
            style={styles.logo} 
          />
          <Text style={styles.appName}>{APP_INFO.name}</Text>
          <Text style={styles.version}>Version {APP_INFO.version}</Text>
        </View>

        {/* 2. Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.descriptionText}>
            {APP_INFO.description}
          </Text>
        </View>

        {/* 3. Core Values (Icon minh họa) */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>Fast Delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <Text style={styles.featureText}>Trusted</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎧</Text>
            <Text style={styles.featureText}>24/7 Support</Text>
          </View>
        </View>

        {/* 4. Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={() => handleLink(`tel:${APP_INFO.phone}`)}>
            <Text style={styles.contactIcon}>📞</Text>
            <View>
              <Text style={styles.contactLabel}>Hotline</Text>
              <Text style={styles.contactValue}>{APP_INFO.phone}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleLink(`mailto:${APP_INFO.email}`)}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{APP_INFO.email}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>🏢</Text>
            <View>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{APP_INFO.address}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.copyright}>
          © 2024 {APP_INFO.name}. All rights reserved.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND || '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Header Style
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  version: {
    color: '#888',
    fontSize: 14,
  },

  // Section Style
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2, // Shadow cho Android
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'justify',
  },

  // Core Values Style
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '30%',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  // Contact Style
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: '#888',
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY || '#333',
  },

  copyright: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  },
});