import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

// Supabase Initialization
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback Mock Data in case DB is empty
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: '3 Bed Luxury Apartment in DHA Phase 6',
    price: 'PKR 3.5 Crore',
    location: 'Karachi, Pakistan',
    beds: '3',
    baths: '3',
    area: '2000 Sqft',
    agent: 'PropTok Platinum Agent',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    likes: '1.2K',
    comments: '45'
  },
  {
    id: '2',
    title: 'Modern Villa with Private Pool',
    price: 'PKR 8.2 Crore',
    location: 'Gulberg, Lahore',
    beds: '5',
    baths: '6',
    area: '4500 Sqft',
    agent: 'Estate Masters',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    likes: '3.4K',
    comments: '120'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Live Data from Supabase
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('properties').select('*');
      
      if (error || !data || data.length === 0) {
        setProperties(MOCK_PROPERTIES);
      } else {
        setProperties(data);
      }
    } catch (err) {
      setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type, title) => {
    Alert.alert(type, `${type} clicked for: ${title}`);
  };

  const renderPropertyCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image || item.image_url }} style={styles.propertyImage} />
      <View style={styles.overlay} />

      {/* Right Action Bar */}
      <View style={styles.rightBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Like', item.title)}>
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>{item.likes || '0'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Comments', item.title)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments || '0'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('WhatsApp', item.title)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Call', item.title)}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.agent || 'Verified Agent'}</Text>
        </View>

        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.featuresRow}>
          {item.beds && item.beds !== '0' && <Text style={styles.featureChip}>🛏️ {item.beds} Beds</Text>}
          {item.baths && item.baths !== '0' && <Text style={styles.featureChip}>🚿 {item.baths} Baths</Text>}
          {item.area && <Text style={styles.featureChip}>📐 {item.area}</Text>}
        </View>

        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => handleAction('Details View', item.title)}
        >
          <Text style={styles.detailsButtonText}>View Full Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PropTok</Text>
        <View style={styles.topTabs}>
          <Text style={[styles.topTabText, styles.activeTopTab]}>For You</Text>
          <Text style={styles.topTabText}>Following</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Loading PropTok Feed...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={height - 110}
          snapToAlignment="start"
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('Home')}>
          <Text style={[styles.navIcon, activeTab === 'Home' && styles.activeNav]}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Search')}>
          <Text style={[styles.navIcon, activeTab === 'Search' && styles.activeNav]}>🔍</Text>
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addPropertyBtn} onPress={() => handleAction('Add Property', 'Upload Screen')}>
          <Text style={styles.addPropertyText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Saved')}>
          <Text style={[styles.navIcon, activeTab === 'Saved' && styles.activeNav]}>🔖</Text>
          <Text style={styles.navLabel}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Profile')}>
          <Text style={[styles.navIcon, activeTab === 'Profile' && styles.activeNav]}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20,
  },
  headerTitle: { color: '#007aff', fontSize: 22, fontWeight: 'bold' },
  topTabs: { flexDirection: 'row', gap: 15 },
  topTabText: { color: '#888', fontSize: 16, fontWeight: '600' },
  activeTopTab: { color: '#fff', borderBottomWidth: 2, borderBottomColor: '#007aff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10 },
  cardContainer: { width: width, height: height - 110, justifyContent: 'flex-end' },
  propertyImage: { ...StyleSheet.absoluteFillObject, width: width, height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  rightBar: { position: 'absolute', right: 15, bottom: 120, alignItems: 'center', gap: 18 },
  actionButton: { alignItems: 'center' },
  actionIcon: { fontSize: 28 },
  actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  bottomInfo: { padding: 20, paddingBottom: 30, width: width - 80 },
  badge: { backgroundColor: '#007aff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  price: { color: '#4cd964', fontSize: 24, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600', marginVertical: 4 },
  location: { color: '#ccc', fontSize: 14 },
  featuresRow: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  featureChip: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12 },
  detailsButton: { backgroundColor: '#007aff', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  detailsButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  bottomNav: { height: 60, backgroundColor: '#111', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#333' },
  navIcon: { fontSize: 20, textAlign: 'center', opacity: 0.6 },
  activeNav: { opacity: 1 },
  navLabel: { color: '#fff', fontSize: 10, marginTop: 2, textAlign: 'center' },
  addPropertyBtn: { backgroundColor: '#007aff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addPropertyText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: -2 },
});
